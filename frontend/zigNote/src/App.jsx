import React from "react"
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home/Home"
import Login from "./pages/Login/Login"
import SignUp from "./pages/SignUp/SignUp"
import VerifyEmail from "./pages/VerifyEmail/VerifyEmail"

const routes = (
  <Router>
    <Routes>
      <Route path="/" element={<Navigate to="/signup" replace />} />
      <Route path="/dashboard" exact element={<Home />} />
      <Route path="/login" exact element={<Login />} />
      <Route path="/signup" exact element={<SignUp />} />
      <Route path="/verify-email" exact element={<VerifyEmail />} />
    </Routes>
  </Router>
)

const App = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-1">
        {routes}
      </div>
      <footer className="w-full bg-white text-slate-500 py-4 text-center text-sm border-t border-slate-200 z-50">
        &copy; 2026 AC. Licensed under the <a href="https://opensource.org/licenses/ISC" target="_blank" rel="noreferrer" className="underline hover:text-blue-600">ISC License</a>.
      </footer>
    </div>
  )
}

export default App