import {
  LoaderIcon,
  LockIcon,
  MailIcon,
  MessageCircleIcon,
} from "lucide-react";
import BorderAnimatedContainer from "../components/BorderAnimator";
import { useState, type ChangeEvent, type FormEvent } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Link } from "react-router-dom";
import loginImage from "../assets/login.png";

export interface LoginFormData {
  email: string;
  password: string;
}

const LoginPage = () => {
  // -- local state for mangaing form data --

  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });

  // -- global store ---
  const { isLoading, logIn } = useAuthStore();

  // to track forminput value --
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // to handle the login process--

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    logIn(formData);
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
                    Welcome Back
                  </h2>
                  <p className="text-slate-400">
                    Sign In to access your account
                  </p>
                </div>

                {/* form */}

                <form onSubmit={handleSubmit} className="space-y-6">
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
                      "Log In"
                    )}
                  </button>
                </form>
                <div className="mt-6 text-center">
                  <Link to="/signup" className="auth-link">
                    Don't have an account ? SignUp
                  </Link>
                </div>
              </div>
            </div>
            <div className="hidden md:w-1/2 md:flex items-center justify-center p-6 bg-linear-to-bl from-slate-800/20 to-transparent">
              <div>
                <img
                  src={loginImage}
                  alt="People using mobile devices"
                  className="w-full h-auto object-contain"
                />
                <div className="mt-6 text-center">
                  <h3 className="text-xl font-medium text-cyan-400">
                    Connect Anytime, Anywhere
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
export default LoginPage;
