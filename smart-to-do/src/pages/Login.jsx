 import { useState } from "react";
import { supabase } from "../lib/supabase";

function Login({ goToSignup }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  async function handleLogin(e) {
    e.preventDefault();

    if (loading) return;

    setError("");
    setLoading(true);

    try {
      const {
        data,
        error,
      } =
        await supabase.auth.signInWithPassword({
          email: email.trim().toLowerCase(),
          password,
        });

      if (error) {
        console.error(
          "Login error:",
          error
        );

        setError(error.message);
        return;
      }

      console.log(
        "Login successful:",
        data.user
      );

      /*
       * App.jsx listens to the auth state
       * and automatically opens Dashboard.
       */
    } catch (err) {
      console.error(
        "Unexpected login error:",
        err
      );

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
        <div className="auth-image login-image">
          <img
            src="/assets/login-illustration.png"
            alt="Login illustration"
          />
        </div>

        {/* CONTENT */}
        <div className="auth-content">

          <h1>
            Welcome Back! 👋
          </h1>

          <p className="subtitle">
            Login to continue your productivity journey
          </p>

          <form onSubmit={handleLogin}>

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
                  placeholder="Enter your password"
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
                      (previous) =>
                        !previous
                    )
                  }
                >
                  {showPassword
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

            {/* LOGIN */}
            <button
              type="submit"
              className="primary-button purple-button"
              disabled={loading}
            >
              {loading
                ? "Logging in..."
                : "Login"}
            </button>

          </form>

          <p className="switch-text">
            Don't have an account?

            <button
              type="button"
              onClick={goToSignup}
            >
              Sign up
            </button>
          </p>

        </div>
      </div>
    </main>
  );
}

export default Login;