import React, { useState } from "react";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { app } from "../firebaseConfig";

const auth = getAuth(app);

const Login: React.FC<{ onLogin?: () => void }> = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
      if (onLogin) onLogin();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#0D0D12]">
      <form onSubmit={handleSubmit} className="bg-[#181824] p-8 rounded-lg shadow-lg w-full max-w-sm">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">Sign In</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="mb-4 w-full px-3 py-2 rounded bg-[#232336] text-white border border-[#2D2D3A] focus:outline-none focus:ring-2 focus:ring-[#8A5CF6]"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="mb-4 w-full px-3 py-2 rounded bg-[#232336] text-white border border-[#2D2D3A] focus:outline-none focus:ring-2 focus:ring-[#8A5CF6]"
          required
        />
        {error && <div className="text-red-400 mb-4 text-center">{error}</div>}
        <button
          type="submit"
          className="w-full py-2 px-4 bg-[#8A5CF6] text-white rounded font-semibold hover:bg-[#A881FF] transition"
          disabled={loading}
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>
    </div>
  );
};

export default Login;
