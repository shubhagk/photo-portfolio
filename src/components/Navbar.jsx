import { NavLink } from "react-router-dom";

export default function Navbar() {
  const links = [
    { label: "Home", to: "/" },
    { label: "Gallery", to: "/gallery" },
    { label: "Contact", to: "/contact" },
  ];

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-black/60 backdrop-blur-md border-b border-white/5">
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-5 flex items-center justify-between">
        {/* Logo */}
        <NavLink to="/" className="flex items-center gap-3 group">
          <img
            src="/VetInWild.jpg"
            width="48"
            alt="VetInWild Logo"
            className="rounded-md ring-2 ring-white/10 group-hover:ring-amber-400/40 transition-all duration-300"
          />
          <span className="font-serif text-xl tracking-wider text-white group-hover:text-amber-400 transition-colors hidden sm:block">
            VetInWild
          </span>
        </NavLink>

        {/* Navigation */}
        <nav className="flex items-center gap-8 md:gap-12">
          {links.map((link) => (
            <NavLink
              key={link.label}
              to={link.to}
              className={({ isActive }) =>
                `
                relative
                tracking-[0.2em]
                text-xs md:text-sm
                uppercase
                font-light
                transition-all
                duration-300
                whitespace-nowrap
                group
                ${isActive ? "text-amber-400" : "text-gray-300 hover:text-white"}
                `
              }
            >
              {link.label}
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-amber-400 group-hover:w-full transition-all duration-300" />
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}
