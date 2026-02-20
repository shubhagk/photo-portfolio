import Navbar from "../components/Navbar.jsx";

export default function Contact() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0806] to-[#1a1410]">
      <Navbar />

      <section className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-sm tracking-[0.5em] font-light text-amber-400 mb-4 uppercase">
              Get in Touch
            </h1>
            <div className="w-16 h-px bg-amber-400 mx-auto mb-8" />
            <h2 className="text-4xl md:text-5xl font-serif font-light mb-6">
              Let's Connect
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Interested in prints, licensing, or safari photography expeditions? I'd love to hear from you.
            </p>
          </div>

          <form className="max-w-2xl mx-auto space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm text-gray-400 mb-2 tracking-wide">
                  Your Name
                </label>
                <input
                  type="text"
                  placeholder="John Doe"
                  className="
                    w-full bg-black/40 border border-white/10
                    px-5 py-4 rounded-lg
                    text-white placeholder-gray-600
                    focus:outline-none focus:border-amber-400/50
                    transition-colors
                  "
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2 tracking-wide">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="john@example.com"
                  className="
                    w-full bg-black/40 border border-white/10
                    px-5 py-4 rounded-lg
                    text-white placeholder-gray-600
                    focus:outline-none focus:border-amber-400/50
                    transition-colors
                  "
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2 tracking-wide">
                Subject
              </label>
              <input
                type="text"
                placeholder="Photography Inquiry"
                className="
                  w-full bg-black/40 border border-white/10
                  px-5 py-4 rounded-lg
                  text-white placeholder-gray-600
                  focus:outline-none focus:border-amber-400/50
                  transition-colors
                "
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2 tracking-wide">
                Message
              </label>
              <textarea
                placeholder="Tell me about your interest..."
                rows="6"
                className="
                  w-full bg-black/40 border border-white/10
                  px-5 py-4 rounded-lg
                  text-white placeholder-gray-600
                  focus:outline-none focus:border-amber-400/50
                  transition-colors
                  resize-none
                "
              />
            </div>

            <button
              type="submit"
              className="
                w-full md:w-auto
                bg-gradient-to-r from-amber-600 to-amber-500
                hover:from-amber-500 hover:to-amber-400
                text-black font-medium
                px-12 py-4 rounded-lg
                tracking-wider uppercase text-sm
                transition-all duration-300
                hover:shadow-lg hover:shadow-amber-500/20
              "
            >
              Send Message
            </button>
          </form>

          <div className="mt-20 pt-16 border-t border-white/10">
            <div className="text-center">
              <h3 className="text-xl font-serif mb-6 text-gray-300">
                Connect on Social Media
              </h3>
              <div className="flex justify-center gap-8">
                <a href="#" className="text-gray-400 hover:text-amber-400 transition-colors text-sm tracking-wider">
                  INSTAGRAM
                </a>
                <a href="#" className="text-gray-400 hover:text-amber-400 transition-colors text-sm tracking-wider">
                  TWITTER
                </a>
                <a href="#" className="text-gray-400 hover:text-amber-400 transition-colors text-sm tracking-wider">
                  FACEBOOK
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
