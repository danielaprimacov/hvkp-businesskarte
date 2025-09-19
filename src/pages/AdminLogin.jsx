import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../content/auth";

export default function AdminLogin() {
  const nav = useNavigate();
  const loc = useLocation();
  const { login } = useAuth();
  const [pwd, setPwd] = useState("");
  const [err, setErr] = useState("");

  const onSubmit = (e) => {
    e.preventDefault();
    if (login(pwd)) {
      const to =
        (loc.state && loc.state.from && loc.state.from.pathname) || "/admin";
      nav(to, { replace: true });
    } else {
      setErr("Wrong password");
    }
  };

  return (
    <div className="bg-blue-200 min-h-screen pt-30">
      <div className="flex flex-col">
        <div className="w-full max-w-sm mx-auto p-6 border border-blue-300 rounded bg-blue-300 shadow-md">
          <h1 className="text-xl text-center text-blue-600 tracking-wider font-semibold mb-4">
            Admin
          </h1>
          {err && <p className="text-red-600 mb-2">{err}</p>}
          <form onSubmit={onSubmit}>
            <input
              type="password"
              value={pwd}
              onChange={(e) => setPwd(e.target.value)}
              placeholder="Passwort"
              className="w-full border border-white/40 p-2 rounded mb-3 focus:outline-none focus:border-blue-500"
            />
            <button className="w-full bg-blue-600 text-white p-2 rounded cursor-pointer hover:bg-blue-500 transition duration-300">
              Anmelden
            </button>
          </form>
        </div>

        <Link
          to="/"
          className="text-center text-blue-800 mt-5 hover:text-blue-500 transition duration-300"
        >
          Zurück
        </Link>
      </div>
    </div>
  );
}
