 import { useState } from "react";
import { supabase } from "../lib/supabase";

function Signup({ goToLogin }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function handleSignup(e) {
    e.preventDefault();

    setError("");
    setMessage("");

    if (loading) return;

    if (!name.trim()) {
      setError("Please enter your full name.");
      return;
    }

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const redirectUrl = window.location.origin;

      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password: password,

        options: {
          data: {
            full_name: name.trim(),
          },

          // Automatically uses the URL from which the app is opened.
          // Example:
          // http://localhost:5174
          // or
          // http://192.168.x.x:5174
          emailRedirectTo: redirectUrl,
        },
      });

      if (error) {
        console.error("Signup error:", error);
        setError(error.message);
        return;
      }

      if (data?.user && !data?.session) {
        setMessage(
          "Account created successfully! Please check your email and confirm your account."
        );

        setName("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");

        return;
      }

      if (data?.session) {
        setMessage("Account created successfully!");
      }
    } catch (err) {
      console.error("Unexpected signup error:", err);

      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-page">
      <div className="auth-card">

        {/* SIGNUP IMAGE */}
        <div className="auth-image signup-image">
          <img
            src="/assets/signup-illustration.png"
            alt="Signup illustration"
          />
        </div>

        {/* SIGNUP CONTENT */}
        <div className="auth-content">

          <h1>Create Account! ✨</h1>

          <p className="subtitle">
            Start organizing your tasks today
          </p>

          <form onSubmit={handleSignup}>

            {/* FULL NAME */}
            <div className="form-group">
              <label htmlFor="name">
                Full name
              </label>

              <div className="input-wrapper">
                <span className="input-icon">
                  👤
                </span>

                <input
                  id="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoComplete="name"
                  required
                />
              </div>
            </div>

            {/* EMAIL */}
            <div className="form-group">
              <label htmlFor="signup-email">
                Email address
              </label>

              <div className="input-wrapper">
                <span className="input-icon">
                  ✉
                </span>

                <input
                  id="signup-email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            {/* PASSWORD */}
            <div className="form-group">
              <label htmlFor="signup-password">
                Password
              </label>

              <div className="input-wrapper">
                <span className="input-icon">
                  🔒
                </span>

                <input
                  id="signup-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
                  required
                />

                <button
                  type="button"
                  className="icon-button"
                  onClick={() =>
                    setShowPassword((previous) => !previous)
                  }
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {showPassword ? "🙈" : "👁"}
                </button>
              </div>
            </div>

            {/* CONFIRM PASSWORD */}
            <div className="form-group">
              <label htmlFor="confirmPassword">
                Confirm password
              </label>

              <div className="input-wrapper">
                <span className="input-icon">
                  🔒
                </span>

                <input
                  id="confirmPassword"
                  type={
                    showConfirmPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) =>
                    setConfirmPassword(e.target.value)
                  }
                  autoComplete="new-password"
                  required
                />

                <button
                  type="button"
                  className="icon-button"
                  onClick={() =>
                    setShowConfirmPassword(
                      (previous) => !previous
                    )
                  }
                  aria-label={
                    showConfirmPassword
                      ? "Hide confirm password"
                      : "Show confirm password"
                  }
                >
                  {showConfirmPassword ? "🙈" : "👁"}
                </button>
              </div>
            </div>

            {/* ERROR */}
            {error && (
              <p className="error">
                {error}
              </p>
            )}

            {/* SUCCESS */}
            {message && (
              <p className="success">
                {message}
              </p>
            )}

            {/* SIGN UP BUTTON */}
            <button
              type="submit"
              className="primary-button pink-button"
              disabled={loading}
            >
              {loading
                ? "Creating account..."
                : "Sign Up"}
            </button>
          </form>

          {/* LOGIN */}
          <p className="switch-text">
            Already have an account?

            <button
              type="button"
              onClick={goToLogin}
            >
              Login
            </button>
          </p>

        </div>
      </div>
    </main>
  );
}

export default Signup;