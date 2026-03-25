export default function Impact() {
  return (
    <section className="py-20 px-6">
      <h2 className="text-3xl font-bold text-center text-primary">
        Real Impact
      </h2>

      <div className="mt-10 grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {[1, 2, 3].map((_, i) => (
          <div key={i} className="p-6 bg-white shadow rounded-xl">
            <p className="text-gray-600 italic">
              This platform helped me report safely and get support.
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}