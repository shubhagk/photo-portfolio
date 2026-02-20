import { NavLink } from "react-router-dom";

export default function Navbar() {
  const links = [
    { label: "Home", to: "/" },
    { label: "Gallery", to: "/gallery" },
    { label: "Portfolio", to: "/portfolio" },
    { label: "Safaris", to: "/safaris" },
    { label: "Journal", to: "/journal" },
    { label: "Contact", to: "/contact" },
  ];

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-black/80 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-10 py-6 flex items-center justify-between">
        {/* Logo */}
        <div className="font-serif text-2xl tracking-wide flex items-center gap-3">
          <img
            src="/VetInWild.jpg"
            width="50"
            alt="Logo"
            className="rounded-sm"
          />
        </div>

        {/* Navigation */}
        <nav className="flex items-center gap-10">
          {links.map((link) => (
            <NavLink
              key={link.label}
              to={link.to}
              className={({ isActive }) =>
                `
                italic
                tracking-[0.25em]
                text-sm
                uppercase
                transition-colors
                whitespace-nowrap
                ${isActive ? "text-white" : "text-white/70 hover:text-white"}
                `
              }
            >
              {link.label}&nbsp; &nbsp;
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}
