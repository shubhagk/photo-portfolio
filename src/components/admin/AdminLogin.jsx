import { useState } from "react";

export default function AdminLogin({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log("HANDLE LOGIN RUNNING");
    try {
      const res = await fetch(
        "https://xg7ieiyyce.execute-api.eu-north-1.amazonaws.com/default/admin-login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username,
            password,
          }),
        },
      );

      const data = await res.json();

      if (data.success) {
        localStorage.setItem("adminLoggedIn", "true");

        onLogin();
      } else {
        setError("Invalid credentials");
      }
    } catch (err) {
      setError("Server error");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-black">
      <form
        onSubmit={handleLogin}
        className="bg-zinc-900 p-8 rounded-xl w-full max-w-md"
      >
        <h1 className="text-2xl font-bold mb-6">Admin Login</h1>

        <input
          className="w-full mb-4 p-3 rounded bg-zinc-800"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="password"
          className="w-full mb-4 p-3 rounded bg-zinc-800"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <div className="text-red-400 mb-4">{error}</div>}

        <button
          type="submit"
          className="w-full bg-white text-black py-3 rounded"
        >
          Login
        </button>
      </form>
    </div>
  );
}
