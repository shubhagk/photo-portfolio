export default function Footer() {
  return (
    <footer className="bg-gray-900 text-center py-10 px-6">
      {/* Social Media Section */}
      <div className="mt-20 pt-16 border-t border-white/10">
        <div className="text-center">
          <h3 className="text-xl font-serif mb-6 text-gray-300">
            Connect on Social Media
          </h3>

          <div className="flex justify-center gap-8">
            <a
              href="https://instagram.com/yourprofile"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-amber-400 transition-colors text-sm tracking-wider"
            >
              INSTAGRAM
            </a>

            <a
              href="https://x.com/yourprofile"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-amber-400 transition-colors text-sm tracking-wider"
            >
              X
            </a>

            <a
              href="https://facebook.com/yourprofile"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-amber-400 transition-colors text-sm tracking-wider"
            >
              FACEBOOK
            </a>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="mt-10 text-gray-500 text-sm">
        © {new Date().getFullYear()} VetInWild Photography
      </div>
    </footer>
  );
}
