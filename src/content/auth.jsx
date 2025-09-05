import { createContext, useContext, useMemo, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";

const AuthContext = createContext(null);
const LS_KEY = "admin_authed";

// Password: Vite -> VITE_ADMIN_PASSWORD, if not - "changeme"
const PASS =
  (typeof import.meta !== "undefined" &&
    import.meta.env &&
    import.meta.env.VITE_ADMIN_PASSWORD) ||
  "changeme";

export function AuthProvider({ children }) {
  const [authed, setAuthed] = useState(() => {
    try {
      return localStorage.getItem(LS_KEY) === "1";
    } catch {
      return false;
    }
  });

  const value = useMemo(
    () => ({
      authed,
      login: (pwd) => {
        const ok = pwd === PASS;
        if (ok) {
          setAuthed(true);
          try {
            localStorage.setItem(LS_KEY, "1");
          } catch {}
        }
        return ok;
      },
      logout: () => {
        setAuthed(false);
        try {
          localStorage.removeItem(LS_KEY);
        } catch {}
      },
    }),
    [authed]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}

export function ProtectedRoute({ children }) {
  const { authed } = useAuth();
  const location = useLocation();
  const authedLS = (() => {
    try {
      return localStorage.getItem("admin_authed") === "1";
    } catch {
      return false;
    }
  })();

  if (!authed && !authedLS) {
    return <Navigate to="/" replace state={{ from: location }} />;
  }
  return children;
}
