 import { useState } from "react";
import { supabase } from "../lib/supabase";

function Signup({ goToLogin }) {
  const [name, setName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [message, setMessage] =
    useState("");


  async function handleSignup(e) {
    e.preventDefault();

    setError("");
    setMessage("");

    if (password !== confirmPassword) {
      setError(
        "Passwords do not match."
      );
      return;
    }

    if (password.length < 6) {
      setError(
        "Password must be at least 6 characters."
      );
      return;
    }

    setLoading(true);

    const { error } =
      await supabase.auth.signUp({
        email,
        password,

        options: {
          data: {
            full_name: name,
          },
        },
      });

    if (error) {
      setError(error.message);
    } else {
      setMessage(
        "Account created! Check your email to verify your account."
      );

      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
    }

    setLoading(false);
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

          <h1>
            Create Account! ✨
          </h1>

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
                    setPassword(
                      e.target.value
                    )
                  }
                  required
                />

                <button
                  type="button"
                  className="icon-button"
                  onClick={() =>
                    setShowPassword(
                      !showPassword
                    )
                  }
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {showPassword
                    ? "🙈"
                    : "👁"}
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
                  type="password"
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) =>
                    setConfirmPassword(
                      e.target.value
                    )
                  }
                  required
                />

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


            {/* SIGN UP */}

            <button
              type="submit"
              className="primary-button"
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