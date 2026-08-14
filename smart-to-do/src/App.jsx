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

    async function getInitialSession() {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error) {
        console.error(
          "Session error:",
          error
        );
      }

      if (mounted) {
        setSession(session);
        setLoading(false);
      }
    }

    getInitialSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (!mounted) return;

        setSession(session);

        if (session) {
          setPage("dashboard");
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
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

  /* USER IS LOGGED IN */
  if (session) {
    return <Dashboard />;
  }

  /* SIGNUP PAGE */
  if (page === "signup") {
    return (
      <Signup
        goToLogin={() =>
          setPage("login")
        }
      />
    );
  }

  /* LOGIN PAGE */
  return (
    <Login
      goToSignup={() =>
        setPage("signup")
      }
    />
  );
}

export default App;