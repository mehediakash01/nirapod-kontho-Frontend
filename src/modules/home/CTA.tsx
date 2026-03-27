import Link from 'next/link';

export default function CTA() {
  return (
    <section className="py-20 px-6 text-center">
      <h2 className="text-3xl font-bold text-primary">
        Support Victims
      </h2>

      <p className="mt-4 text-gray-600">
        Your contribution helps provide legal and medical support.
      </p>

      <Link href="/donation" className="mt-6 inline-block bg-secondary text-white px-6 py-3 rounded-lg">
        Donate Now
      </Link>
    </section>
  );
}