import { Navigate } from "react-router-dom";
import { useAuth } from "../context/Authcontext.jsx";

export default function ProtectRoute({ children }) {
  const { token, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0b141a] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div
            className="w-12 h-12 border-4 border-[#25D366] border-t-transparent rounded-full"
            style={{ animation: "spin 1s linear infinite" }}
          />
          <p className="text-gray-400 text-lg">Loading...</p>
        </div>
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (!token) {
    return <Navigate to="/" replace />;
  }

  return children;
}
