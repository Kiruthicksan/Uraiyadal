import React, { useState } from "react";
import BorderAnimatedContainer from "../components/BorderAnimator";
import {
  LoaderIcon,
  LockIcon,
  MailIcon,
  MessageCircleIcon,
  UserIcon,
} from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { Link } from "react-router-dom";
import signup from "../assets/signup.png";

export interface FormDataType {
  userName: string;
  email: string;
  password: string;
}

const SignUpPage = () => {
  // --------- local state for managing form data------------
  const [formData, setFormData] = useState<FormDataType>({
    userName: "",
    email: "",
    password: "",
  });

  const { isLoading, signUp } = useAuthStore();



  //    ---------- function for tracking the value --------

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  //  ----- funtion to fetching api
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    signUp(formData);
  };

  return (
    <div className="w-full flex items-center justify-center p-4 bg-slate-900">
      <div className="relative w-full max-w-6xl md:h-[800px] h-[650px]">
        <BorderAnimatedContainer>
          <div className="w-full flex flex-col md:flex-row">
            {/* form */}
            <div className="md:w-1/2  p-8 flex items-center justify-center md:border-r border-slate-600/30">
              <div className="w-full max-w-md">
                {/* Heading */}
                <div className="text-center mb-8">
                  <MessageCircleIcon className="w-12 h-12 mx-auto text-slate-400 mb-4" />
                  <h2 className="text-2xl font-bold text-slate-200 mb-2">
                    Create Account
                  </h2>
                  <p className="text-slate-400">Sign up for a new account</p>
                </div>

                {/* form */}

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* userName */}

                  <div>
                    <label className="auth-input-label">UserName</label>
                    <div className="relative">
                      <UserIcon className="auth-input-icon" />

                      <input
                        type="text"
                        value={formData.userName}
                        onChange={handleChange}
                        name="userName"
                        className="input"
                      />
                    </div>
                  </div>
                  {/* email */}
                  <div>
                    <label className="auth-input-label">Email</label>
                    <div className="relative">
                      <MailIcon className="auth-input-icon" />

                      <input
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        name="email"
                        className="input"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="auth-input-label">Password</label>
                    <div className="relative">
                      <LockIcon className="auth-input-icon" />

                      <input
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                        name="password"
                        className="input"
                      />
                    </div>
                  </div>
                  <button
                    className="auth-btn"
                    type="submit"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <LoaderIcon className="w-full h-5 animate-spin text-center" />
                    ) : (
                      "Create Account"
                    )}
                  </button>
                </form>
                <div className="mt-6 text-center">
                  <Link to="/login" className="auth-link">
                    Already have an account? Login
                  </Link>
                </div>
              </div>
            </div>
            <div className="hidden md:w-1/2 md:flex items-center justify-center p-6 bg-linear-to-bl from-slate-800/20 to-transparent">
              <div>
                <img
                  src={signup}
                  alt="People using mobile devices"
                  className="w-full h-auto object-contain"
                />
                <div className="mt-6 text-center">
                  <h3 className="text-xl font-medium text-cyan-400">
                    Start Your Journey Today
                  </h3>

                  <div className="mt-4 flex justify-center gap-4">
                    <span className="auth-badge">Free</span>
                    <span className="auth-badge">Easy Setup</span>
                    <span className="auth-badge">Private</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </BorderAnimatedContainer>
      </div>
    </div>
  );
};
export default SignUpPage;
