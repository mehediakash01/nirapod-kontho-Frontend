export default function Navbar() {
  return (
    <nav className="flex justify-between items-center px-6 py-4 bg-white shadow">
      <h1 className="text-xl font-bold text-primary">
        Nirapod Kontho
      </h1>

      <div className="flex gap-4">
        <button>Login</button>
        <button className="bg-primary text-white px-4 py-2 rounded">
          Report
        </button>
      </div>
    </nav>
  );
}