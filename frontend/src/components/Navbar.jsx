export default function Navbar() {
  return (
    <nav
      className="
      fixed
      top-0
      left-0
      w-full
      z-50
      backdrop-blur-md
      bg-black/30
      border-b
      border-white/10
      "
    >
      <div
        className="
        max-w-7xl
        mx-auto
        px-8
        py-5
        flex
        justify-between
        items-center
        "
      >

        <h1 className="font-bold text-xl">
          ELUNO AI OPS
        </h1>

        <div className="flex gap-8 text-zinc-400">

          <a href="#features">
            Features
          </a>

          <a href="#metrics">
            Metrics
          </a>

        </div>

      </div>
    </nav>
  );
}