export default function Contact() {
  return (
    <section className="container center mx-auto px-4 py-14">
      <div className="ml-[80px]">
        <h1 className="text-3xl font-semibold mb-6">Contact</h1>
      </div>

      <form className="max-w-lg space-y-4">
        <input
          type="text"
          placeholder="Name"
          className="w-full border px-4 py-2 rounded"
        />
        <input
          type="email"
          placeholder="Email"
          className="w-full border px-4 py-2 rounded"
        />
        <textarea
          placeholder="Message"
          rows="4"
          className="w-full border px-4 py-2 rounded"
        />
        <button className="bg-black text-white px-6 py-2 rounded">Send</button>
      </form>
    </section>
  );
}
