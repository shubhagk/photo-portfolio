export default function Navbar() {
  const links = [
    { label: "Home", href: "/" },
    { label: "Gallery", href: "/Gallery" },
    { label: "Portfolio", href: "/portfolio" },
    { label: "Safaris", href: "/safaris" },
    { label: "Journal", href: "/journal" },
    { label: "Contact", href: "../contact" },
  ];

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-blue-900/80 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-10 py-6 flex items-center justify-between bg-cover bg-center bg-no-repeat bg-black">
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
            <a
              key={link.label}
              href={link.href}
              className="
                 hover
                italic
                tracking-[0.25em]
                text-sm
                uppercase
                no-underline
                transition-colors
                whitespace-nowrap
              "
            >
              {link.label}&nbsp; &nbsp;
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
