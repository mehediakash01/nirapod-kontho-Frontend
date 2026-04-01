'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { createReport, type CreateReportRequest } from '../services/report.api';
import { uploadToCloudinary } from '@/lib/cloudinary';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import type { CreateReportPayload } from '../types';

type SeverityOption = 'MILD' | 'MODERATE' | 'URGENT';
type PrivacyMode = 'FULLY_ANONYMOUS' | 'ANONYMOUS_CONTACTABLE';

type FormValues = CreateReportPayload & {
  privacyMode: PrivacyMode;
  voiceNoteFile?: File | null;
  evidenceFiles?: File[];
};

type EvidencePreview = {
  file: File;
  url: string;
};

const MAX_EVIDENCE_FILES = 5;

const LocationMapPicker = dynamic(() => import('./LocationMapPicker'), {
  ssr: false,
});

const toDateTimeLocalValue = (date: Date) => {
  const offsetMs = date.getTimezoneOffset() * 60 * 1000;
  return new Date(date.getTime() - offsetMs).toISOString().slice(0, 16);
};

export default function CreateReportForm() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isRecording, setIsRecording] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [voiceNotePreviewUrl, setVoiceNotePreviewUrl] = useState<string | null>(null);
  const [voiceNoteCloudinaryUrl, setVoiceNoteCloudinaryUrl] = useState<string | null>(null);
  const [evidencePreviews, setEvidencePreviews] = useState<EvidencePreview[]>([]);
  const [evidenceCloudinaryUrls, setEvidenceCloudinaryUrls] = useState<string[]>([]);

  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    mode: 'onBlur',
    defaultValues: {
      type: 'HARASSMENT',
      description: '',
      location: '',
      incidentDate: toDateTimeLocalValue(new Date()),
      severity: 'MODERATE',
      latitude: undefined,
      longitude: undefined,
      isAnonymous: true,
      privacyMode: 'FULLY_ANONYMOUS',
      voiceNoteFile: null,
      evidenceFiles: [],
    },
  });

  const severity = watch('severity');
  const privacyMode = watch('privacyMode');

  useEffect(() => {
    setValue('isAnonymous', privacyMode === 'FULLY_ANONYMOUS', { shouldValidate: true });
  }, [privacyMode, setValue]);

  useEffect(() => {
    return () => {
      if (voiceNotePreviewUrl) {
        URL.revokeObjectURL(voiceNotePreviewUrl);
      }
      evidencePreviews.forEach((item) => URL.revokeObjectURL(item.url));
    };
  }, [voiceNotePreviewUrl, evidencePreviews]);

  const stepFields: Array<Array<keyof FormValues>> = useMemo(
    () => [
      ['type', 'incidentDate', 'severity'],
      ['location', 'privacyMode'],
      ['description'],
    ],
    []
  );

  const progressPercent = (currentStep / 3) * 100;

  const goNext = async () => {
    const fields = stepFields[currentStep - 1];
    const valid = await trigger(fields);
    if (!valid) {
      toast.error('Please fix the highlighted fields before continuing.');
      return;
    }
    setCurrentStep((prev) => Math.min(prev + 1, 3));
  };

  const goPrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported on this device.');
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setValue('latitude', Number(position.coords.latitude.toFixed(6)), {
          shouldValidate: true,
        });
        setValue('longitude', Number(position.coords.longitude.toFixed(6)), {
          shouldValidate: true,
        });
        setIsLocating(false);
        toast.success('Current location added.');
      },
      () => {
        setIsLocating(false);
        toast.error('Unable to fetch your location. Please type it manually.');
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleEvidenceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(event.target.files ?? []);

    if (!selected.length) {
      setValue('evidenceFiles', [], { shouldValidate: true });
      evidencePreviews.forEach((item) => URL.revokeObjectURL(item.url));
      setEvidencePreviews([]);
      setEvidenceCloudinaryUrls([]);
      return;
    }

    const trimmed = selected.slice(0, MAX_EVIDENCE_FILES);
    if (selected.length > MAX_EVIDENCE_FILES) {
      toast.error(`Only ${MAX_EVIDENCE_FILES} files are allowed.`);
    }

    evidencePreviews.forEach((item) => URL.revokeObjectURL(item.url));
    const previews = trimmed.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));

    setEvidencePreviews(previews);
    setValue('evidenceFiles', trimmed, { shouldValidate: true });

    // Upload all files to Cloudinary
    setIsUploading(true);
    Promise.all(
      trimmed.map((file) => {
        const resourceType = file.type.startsWith('image/') ? 'image' : file.type.startsWith('video/') ? 'video' : 'auto';
        return uploadToCloudinary(file, resourceType as 'auto' | 'image' | 'video' | 'raw');
      })
    )
      .then((urls) => {
        setEvidenceCloudinaryUrls(urls);
        toast.success(`${urls.length} file(s) uploaded to Cloudinary`);
      })
      .catch(() => {
        toast.error('Failed to upload some evidence files. Please try again.');
        setEvidenceCloudinaryUrls([]);
      })
      .finally(() => {
        setIsUploading(false);
      });
  };

  const handleStartRecording = async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      toast.error('Voice recording is not supported on this device/browser.');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);

      chunksRef.current = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        const file = new File([blob], `voice-note-${Date.now()}.webm`, { type: 'audio/webm' });
        const previewUrl = URL.createObjectURL(blob);

        if (voiceNotePreviewUrl) {
          URL.revokeObjectURL(voiceNotePreviewUrl);
        }

        setVoiceNotePreviewUrl(previewUrl);
        setValue('voiceNoteFile', file, { shouldValidate: true });
        setIsRecording(false);

        // Upload to Cloudinary in background
        uploadToCloudinary(file, 'video')
          .then((url) => {
            setVoiceNoteCloudinaryUrl(url);
            toast.success('Voice note uploaded successfully');
          })
          .catch(() => {
            toast.error('Failed to upload voice note to Cloudinary');
            setVoiceNoteCloudinaryUrl(null);
          });

        stream.getTracks().forEach((track) => track.stop());
      };

      recorderRef.current = recorder;
      recorder.start();
      setIsRecording(true);
      toast.success('Recording started. Tap Stop when done.');
    } catch {
      toast.error('Microphone permission denied or unavailable.');
    }
  };

  const handleStopRecording = () => {
    if (recorderRef.current && isRecording) {
      recorderRef.current.stop();
    }
  };

  const removeVoiceNote = () => {
    if (voiceNotePreviewUrl) {
      URL.revokeObjectURL(voiceNotePreviewUrl);
    }
    setVoiceNotePreviewUrl(null);
    setVoiceNoteCloudinaryUrl(null);
    setValue('voiceNoteFile', null, { shouldValidate: true });
  };

  const onSubmit = async (data: FormValues) => {
    try {
      setIsUploading(true);

      // Prepare evidence URLs from Cloudinary
      const evidenceUrls = evidenceCloudinaryUrls.map((url, index) => {
        const preview = evidencePreviews[index];
        return {
          fileUrl: url,
          fileType: preview?.file.type || 'application/octet-stream',
        };
      });

      // Create report payload with Cloudinary URLs (not files)
      const reportPayload: CreateReportRequest = {
        type: data.type,
        description: data.description,
        location: data.location,
        incidentDate: data.incidentDate,
        severity: data.severity,
        latitude: data.latitude,
        longitude: data.longitude,
        isAnonymous: data.isAnonymous,
        voiceNoteUrl: voiceNoteCloudinaryUrl || undefined,
        evidenceFiles: evidenceUrls.length > 0 ? evidenceUrls : undefined,
      };

      await createReport(reportPayload);
      toast.success('Report submitted successfully');
      router.push('/dashboard/user/reports');
    } catch {
      toast.error('Failed to create report');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="mx-auto max-w-3xl space-y-6 rounded-xl border bg-white p-4 shadow-sm sm:p-6"
    >
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-xl font-bold text-primary sm:text-2xl">Create Safety Report</h2>
          <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            Step {currentStep} of 3
          </span>
        </div>

        <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
          <div
            className="h-full rounded-full bg-primary transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {currentStep === 1 ? (
        <section className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground">Step 1: Incident Basics</h3>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Incident Type</label>
            <select
              {...register('type', { required: 'Incident type is required.' })}
              className="h-11 w-full rounded-md border px-3 text-sm focus:border-primary focus:outline-none"
            >
              <option value="HARASSMENT">Harassment</option>
              <option value="DOMESTIC_VIOLENCE">Domestic Violence</option>
              <option value="STALKING">Stalking</option>
              <option value="CORRUPTION">Corruption</option>
              <option value="THREAT">Threat</option>
            </select>
            {errors.type ? <p className="text-xs text-red-600">{errors.type.message}</p> : null}
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Incident Date & Time</label>
            <input
              type="datetime-local"
              {...register('incidentDate', { required: 'Incident date and time is required.' })}
              className="h-11 w-full rounded-md border px-3 text-sm focus:border-primary focus:outline-none"
            />
            {errors.incidentDate ? (
              <p className="text-xs text-red-600">{errors.incidentDate.message}</p>
            ) : null}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Severity Level</label>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
              {(['MILD', 'MODERATE', 'URGENT'] as SeverityOption[]).map((level) => (
                <button
                  key={level}
                  type="button"
                  onClick={() => setValue('severity', level, { shouldValidate: true })}
                  className={`rounded-md border px-3 py-2 text-sm font-semibold transition ${
                    severity === level
                      ? 'border-primary bg-primary text-white'
                      : 'border-gray-300 bg-white text-gray-700 hover:border-primary/60'
                  }`}
                >
                  {level === 'MILD' ? 'Mild' : level === 'MODERATE' ? 'Moderate' : 'Urgent'}
                </button>
              ))}
            </div>
            <input
              type="hidden"
              {...register('severity', { required: 'Please choose severity level.' })}
            />
            {errors.severity ? <p className="text-xs text-red-600">{errors.severity.message}</p> : null}
          </div>
        </section>
      ) : null}

      {currentStep === 2 ? (
        <section className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground">Step 2: Location & Privacy</h3>

          <LocationMapPicker
            location={watch('location') || ''}
            latitude={watch('latitude')}
            longitude={watch('longitude')}
            onChange={({ location, latitude, longitude }) => {
              setValue('location', location, { shouldValidate: true });
              setValue('latitude', Number(latitude.toFixed(6)), { shouldValidate: true });
              setValue('longitude', Number(longitude.toFixed(6)), { shouldValidate: true });
            }}
          />

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Location</label>
            <input
              {...register('location', {
                required: 'Location is required.',
                minLength: {
                  value: 3,
                  message: 'Location should be at least 3 characters.',
                },
              })}
              placeholder="Area, landmark, road, or district"
              className="h-11 w-full rounded-md border px-3 text-sm focus:border-primary focus:outline-none"
            />
            {errors.location ? <p className="text-xs text-red-600">{errors.location.message}</p> : null}
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Latitude (optional)</label>
              <input
                type="number"
                step="any"
                {...register('latitude', { valueAsNumber: true })}
                placeholder="24.8949"
                className="h-11 w-full rounded-md border px-3 text-sm focus:border-primary focus:outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Longitude (optional)</label>
              <input
                type="number"
                step="any"
                {...register('longitude', { valueAsNumber: true })}
                placeholder="91.8687"
                className="h-11 w-full rounded-md border px-3 text-sm focus:border-primary focus:outline-none"
              />
            </div>
          </div>

          <button
            type="button"
            onClick={handleUseCurrentLocation}
            disabled={isLocating}
            className="rounded-md border border-primary px-4 py-2 text-sm font-semibold text-primary transition hover:bg-primary hover:text-white disabled:opacity-60"
          >
            {isLocating ? 'Fetching location...' : 'Use Current Location'}
          </button>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Privacy Option</label>
            <div className="grid gap-2 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => setValue('privacyMode', 'FULLY_ANONYMOUS', { shouldValidate: true })}
                className={`rounded-md border px-3 py-2 text-left text-sm ${
                  privacyMode === 'FULLY_ANONYMOUS'
                    ? 'border-primary bg-primary text-white'
                    : 'border-gray-300 bg-white text-gray-700'
                }`}
              >
                <p className="font-semibold">Fully Anonymous</p>
                <p className="text-xs opacity-90">Default. Your identity is hidden.</p>
              </button>

              <button
                type="button"
                onClick={() => setValue('privacyMode', 'ANONYMOUS_CONTACTABLE', { shouldValidate: true })}
                className={`rounded-md border px-3 py-2 text-left text-sm ${
                  privacyMode === 'ANONYMOUS_CONTACTABLE'
                    ? 'border-primary bg-primary text-white'
                    : 'border-gray-300 bg-white text-gray-700'
                }`}
              >
                <p className="font-semibold">Anonymous but Contactable</p>
                <p className="text-xs opacity-90">Moderators may contact you for clarification.</p>
              </button>
            </div>
            <input type="hidden" {...register('privacyMode', { required: true })} />
          </div>
        </section>
      ) : null}

      {currentStep === 3 ? (
        <section className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground">Step 3: Evidence & Description</h3>

          <div className="space-y-2 rounded-xl border border-primary/25 bg-primary/5 p-4">
            <p className="text-sm font-semibold text-primary">Voice Note (Recommended)</p>
            <p className="text-xs text-gray-600">
              Share your report in your own voice if typing is difficult. This can help moderators understand urgency better.
            </p>
            <div className="flex flex-wrap gap-2">
              {!isRecording ? (
                <button
                  type="button"
                  onClick={handleStartRecording}
                  className="rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-90"
                >
                  Start Voice Recording
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleStopRecording}
                  className="rounded-lg bg-red-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700"
                >
                  Stop Recording
                </button>
              )}

              {voiceNotePreviewUrl ? (
                <button
                  type="button"
                  onClick={removeVoiceNote}
                  className="rounded-lg border border-gray-300 px-4 py-3 text-sm font-semibold text-gray-700"
                >
                  Remove Voice Note
                </button>
              ) : null}
            </div>

            {voiceNotePreviewUrl ? (
              <audio controls src={voiceNotePreviewUrl} className="w-full" />
            ) : null}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Evidence Upload (Photos, Videos, Audio)</label>
            <input
              type="file"
              multiple
              accept="image/*,video/*,audio/*"
              onChange={handleEvidenceChange}
              className="block w-full rounded-md border p-2 text-sm"
            />
            <p className="text-xs text-gray-500">You can upload up to {MAX_EVIDENCE_FILES} files.</p>

            {evidencePreviews.length ? (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {evidencePreviews.map(({ file, url }) => {
                  const isImage = file.type.startsWith('image/');
                  const isVideo = file.type.startsWith('video/');
                  const isAudio = file.type.startsWith('audio/');

                  return (
                    <div key={`${file.name}-${url}`} className="rounded-md border p-2">
                      <p className="mb-2 truncate text-xs text-gray-600">{file.name}</p>
                      {isImage ? <img src={url} alt={file.name} className="h-36 w-full rounded object-cover" /> : null}
                      {isVideo ? <video src={url} controls className="h-36 w-full rounded object-cover" /> : null}
                      {isAudio ? <audio src={url} controls className="w-full" /> : null}
                      {!isImage && !isVideo && !isAudio ? (
                        <p className="text-xs text-gray-500">Preview unavailable</p>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            ) : null}
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Description</label>
            <textarea
              {...register('description', {
                required: 'Description is required.',
                minLength: {
                  value: 10,
                  message: 'Description should be at least 10 characters.',
                },
              })}
              placeholder="What happened? When did it start? Who was involved? Mention anything that can help verify your report."
              rows={6}
              className="w-full rounded-md border p-3 text-sm focus:border-primary focus:outline-none"
            />
            {errors.description ? (
              <p className="text-xs text-red-600">{errors.description.message}</p>
            ) : null}
          </div>
        </section>
      ) : null}

      <div className="flex flex-wrap items-center justify-between gap-3 border-t pt-4">
        <button
          type="button"
          onClick={goPrevious}
          disabled={currentStep === 1 || isSubmitting}
          className="rounded-md border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 disabled:opacity-50"
        >
          Back
        </button>

        {currentStep < 3 ? (
          <button
            type="button"
            onClick={goNext}
            disabled={isUploading}
            className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
          >
            Continue
          </button>
        ) : (
          <button
            type="submit"
            disabled={isSubmitting || isUploading}
            className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white disabled:opacity-70"
          >
            {isUploading ? 'Uploading files...' : isSubmitting ? 'Submitting...' : 'Submit Report'}
          </button>
        )}
      </div>
    </form>
  );
}