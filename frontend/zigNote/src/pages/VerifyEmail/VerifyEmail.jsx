import React, { useEffect, useState } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import NavBar from "../../components/NavBar/NavBar";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [status, setStatus] = useState("loading"); // loading | success | error
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    let timer;

    const run = async () => {
      if (!token) {
        setStatus("error");
        setMessage("Missing verification token.");
        return;
      }

      try {
        const res = await axiosInstance.get("/verify-email", { params: { token } });
        setStatus("success");
        setMessage(res.data?.message || "Email verified successfully.");
        // Automatically redirect to login after verification so users don't stay on this page.
        timer = setTimeout(() => {
          navigate("/login", { replace: true });
        }, 2500);
      } catch (err) {
        setStatus("error");
        setMessage(err?.response?.data?.message || "Verification failed. Token may be invalid or expired.");
      }
    };

    run();

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [token, navigate]);

  return (
    <>
      <NavBar />
      <div className="min-h-screen flex items-center justify-center -mt-7 px-4">
        <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl px-8 py-10 shadow-xl">
          <h4 className="text-2xl font-semibold text-slate-900 mb-2">Verify email</h4>
          <p className="text-sm text-slate-600 mb-6">
            {status === "loading" ? "Verifying your email…" : message}
          </p>

          {status === "success" ? (
            <Link to="/login" className="btn-primary inline-flex items-center justify-center">
              Go to login
            </Link>
          ) : status === "error" ? (
            <Link to="/signup" className="btn-primary inline-flex items-center justify-center">
              Back to signup
            </Link>
          ) : (
            <button type="button" className="btn-primary opacity-80 cursor-not-allowed">
              Verifying…
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default VerifyEmail;

