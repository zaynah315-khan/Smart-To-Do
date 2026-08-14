 import { useEffect, useState } from "react";
import { supabase } from "./lib/supabase";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";

function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState("login");

  useEffect(() => {
    let mounted = true;

    async function loadSession() {
      const {
        data,
        error,
      } = await supabase.auth.getSession();

      if (error) {
        console.error(
          "Get session error:",
          error
        );
      }

      if (mounted) {
        setSession(data?.session ?? null);
        setLoading(false);
      }
    }

    loadSession();

    const {
      data: authData,
    } = supabase.auth.onAuthStateChange(
      (_event, newSession) => {
        if (!mounted) return;

        setSession(newSession);

        if (newSession) {
          setPage("dashboard");
        }
      }
    );

    return () => {
      mounted = false;

      authData.subscription.unsubscribe();
    };
  }, []);

  if (loading) {
    return (
      <main className="auth-page">
        <div className="auth-card">

          <div className="empty">
            <div className="loader"></div>

            <p>
              Checking your account...
            </p>
          </div>

        </div>
      </main>
    );
  }

  /*
   * VERIFIED / LOGGED-IN USER
   */
  if (session) {
    return <Dashboard />;
  }

  /*
   * SIGNUP
   */
  if (page === "signup") {
    return (
      <Signup
        goToLogin={() =>
          setPage("login")
        }
      />
    );
  }

  /*
   * LOGIN
   */
  return (
    <Login
      goToSignup={() =>
        setPage("signup")
      }
    />
  );
}

export default App;