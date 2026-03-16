import React, { useState } from 'react';
import NavBar from '../../components/NavBar/NavBar';
import axiosInstance from '../../utils/axiosInstance';
import { Link, useNavigate } from 'react-router-dom';
import PasswordInput from '../../components/Input/PasswordInput';
import { validateEmail } from '../../utils/helper';

const SignUp = () => {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [info, setInfo] = useState("");
  const [verificationLink, setVerificationLink] = useState("");

  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();

    if(!name) {
      setError("Please enter your name");
      return;
    }

    if(!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if(!password) {
      setError("Please enter the password");
      return;
    }

    setError('');
    setInfo("");
    setVerificationLink("");

    //SignUp API Call
    try {
      const response = await axiosInstance.post("/create-account", {
        fullName: name,
        email: email,
        password: password,
      });

      // Handle successful registration response
      if(response.data && response.data.error) {
        setError(response.data.message);
        return;
      }

      if (response.data && response.data.message) {
        setInfo(response.data.message);
      }
      if (response.data && response.data.verificationLink) {
        setVerificationLink(response.data.verificationLink);
      }

    } catch (error) {
      // Handle registration error
      if(error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    }
  };

  return (
    <>
    <NavBar />

    <div className="min-h-screen flex items-center justify-center -mt-7">
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl px-8 py-10 shadow-xl"> 
        <form onSubmit={handleSignUp}>
          <h4 className="text-2xl font-semibold text-slate-900 mb-2">Create account</h4>
          <p className="text-sm text-slate-600 mb-6">
            Join ZigNote to organize your notes beautifully.
          </p>

          <input 
          type="text" 
          placeholder="Name" 
          className="input-box"
          value = {name}
          onChange = {(e) => setName(e.target.value)}
         /> 

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

          {error && <p className="text-red-500 text-xs pb-1">{error}</p>}
          {info && !error && <p className="text-emerald-600 text-xs pb-1">{info}</p>}
          {verificationLink && !error && (
            <a
              href={verificationLink}
              className="text-sm text-primary underline hover:text-blue-700 transition-colors block mb-3"
              target="_blank"
              rel="noreferrer"
            >
              Open verification link
            </a>
          )}

          <button type="submit" className="btn-primary">
            Create Account
          </button>

          <p className="text-sm text-center mt-4 text-slate-600">
            Already have an account?{" "}
            <Link to="/login" className="font-medium text-primary hover:text-blue-400 transition-colors">
              Login
            </Link>
          </p>

          </form>
      </div>
    </div>
    </>
  );
};

export default SignUp