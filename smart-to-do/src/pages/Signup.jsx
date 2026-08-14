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

    // Prevent duplicate requests
    if (loading) return;

    setError("");
    setMessage("");

    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanName) {
      setError("Please enter your full name.");
      return;
    }

    if (!cleanEmail) {
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

      const { data, error } =
        await supabase.auth.signUp({
          email: cleanEmail,
          password: password,

          options: {
            emailRedirectTo: redirectUrl,

            data: {
              full_name: cleanName,
            },
          },
        });

      if (error) {
        console.error("Signup error:", error);

        if (
          error.message
            ?.toLowerCase()
            .includes("rate limit")
        ) {
          setError(
            "Email sending limit has been reached. Please wait and try again later."
          );
        } else {
          setError(error.message);
        }

        return;
      }

      /*
       * If Supabase requires email confirmation,
       * session will normally be null here.
       */
      if (data?.user && !data?.session) {
        setMessage(
          "Account created successfully! Please check your email and verify your account. After verification, Goal Grid will open automatically."
        );
      } else if (data?.session) {
        /*
         * Email confirmation is disabled.
         * App.jsx will automatically show Dashboard.
         */
        setMessage("Account created successfully!");
      }

      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
    } catch (err) {
      console.error("Unexpected signup error:", err);

      setError(
        "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-page">
      <div className="auth-card">

        {/* IMAGE */}
        <div className="auth-image signup-image">
          <img
            src="/assets/signup-illustration.png"
            alt="Signup illustration"
          />
        </div>

        {/* CONTENT */}
        <div className="auth-content">

          <h1>Create Account! ✨</h1>

          <p className="subtitle">
            Start organizing your tasks today
          </p>

          <form onSubmit={handleSignup}>

            {/* NAME */}
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
                  onChange={(e) =>
                    setName(e.target.value)
                  }
                  required
                />
              </div>
            </div>

            {/* EMAIL */}
            <div className="form-group">
              <label htmlFor="email">
                Email address
              </label>

              <div className="input-wrapper">
                <span className="input-icon">
                  ✉
                </span>

                <input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  required
                />
              </div>
            </div>

            {/* PASSWORD */}
            <div className="form-group">
              <label htmlFor="password">
                Password
              </label>

              <div className="input-wrapper">
                <span className="input-icon">
                  🔒
                </span>

                <input
                  id="password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  required
                />

                <button
                  type="button"
                  className="icon-button"
                  onClick={() =>
                    setShowPassword(
                      (previous) => !previous
                    )
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
                    setConfirmPassword(
                      e.target.value
                    )
                  }
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
                >
                  {showConfirmPassword
                    ? "🙈"
                    : "👁"}
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

            {/* BUTTON */}
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