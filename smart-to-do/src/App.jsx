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

    async function initializeAuth() {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error) {
          console.error("Session error:", error);
        }

        if (!mounted) return;

        setSession(session ?? null);

        if (session) {
          setPage("dashboard");
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    initializeAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (event, newSession) => {
        if (!mounted) return;

        console.log("Supabase auth event:", event);

        setSession(newSession ?? null);

        if (newSession) {
          setPage("dashboard");
        } else if (event === "SIGNED_OUT") {
          setPage("login");
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

  if (session) {
    return <Dashboard />;
  }

  if (page === "signup") {
    return (
      <Signup
        goToLogin={() => setPage("login")}
      />
    );
  }

  return (
    <Login
      goToSignup={() => setPage("signup")}
    />
  );
}

export default App;