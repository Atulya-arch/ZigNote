import React, { useState } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import NavBar from '../../components/NavBar/NavBar';
import { Link, useNavigate } from 'react-router-dom';
import PasswordInput from '../../components/Input/PasswordInput';
import { validateEmail } from '../../utils/helper';

const Login = () => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [info, setInfo] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if(!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if(!password) {
      setError("Please enter the password");
      return;
    }

    setError("");
    setInfo("");

    //Login API Call
    try {
      const response = await axiosInstance.post("/login", {
        email: email,
        password: password,
      });

      // Handle successful login response
      if(response.data && response.data.accessToken) {
        localStorage.setItem("token", response.data.accessToken)
        navigate("/dashboard");
      }

    } catch (error) {
      // Handle login error
      if(error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError("An unexpected error occurred. Please try again later.");
      }
    }
  };

  const handleResendVerification = async () => {
    if (!validateEmail(email)) {
      setError("Please enter a valid email address first.");
      return;
    }

    setError("");
    setInfo("");

    try {
      const res = await axiosInstance.post("/resend-verification", { email });
      setInfo(res.data?.message || "Verification email sent.");
    } catch (err) {
      setError(err?.response?.data?.message || "Could not resend verification email.");
    }
  };

  return ( 
    <>
    <NavBar />

    <div className="min-h-screen flex items-center justify-center -mt-7">
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl px-8 py-10 shadow-xl"> 
        <form onSubmit={handleLogin}>
          <h4 className="text-2xl font-semibold text-slate-900 mb-2">Log in</h4>
          <p className="text-sm text-slate-600 mb-6">
            Welcome back. Please enter your details to continue.
          </p>

          <input 
          type="text" 
          placeholder="Email" 
          className="input-box"
          value = {email}
          onChange = {(e) => setEmail(e.target.value)}
         /> 

          <PasswordInput 
            value = {password}
            onChange = {(e) => setPassword(e.target.value)}
          />

          {error && <p className = "text-red-500 text-xs pb-1">{error}</p>}
          {info && !error && <p className="text-emerald-600 text-xs pb-1">{info}</p>}

          {error === "Please verify your email before logging in." && (
            <button
              type="button"
              onClick={handleResendVerification}
              className="text-sm text-primary underline hover:text-blue-700 transition-colors mb-3"
            >
              Resend verification email
            </button>
          )}

          <button type="submit" className="btn-primary">
            Login
          </button>

          <p className="text-sm text-center mt-4 text-slate-600">
            Not registered yet?{" "}
            <Link to="/signup" className="font-medium text-primary hover:text-blue-400 transition-colors">
              Create an Account
            </Link>
          </p>

        </form>
      </div>
    </div>
  </>
  );
};

export default Login;