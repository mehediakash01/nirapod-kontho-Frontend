const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || '';

if (!CLOUDINARY_CLOUD_NAME) {
  console.warn('Missing NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME environment variable');
}

export const cloudinaryConfig = {
  cloudName: CLOUDINARY_CLOUD_NAME,
};

export const uploadToCloudinary = async (file: File, resourceType: 'auto' | 'image' | 'video' | 'raw' = 'auto'): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'nirapod-kontho');
  formData.append('resource_type', resourceType);

  const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/upload`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Failed to upload file to Cloudinary');
  }

  const data = await response.json();
  return data.secure_url;
};
