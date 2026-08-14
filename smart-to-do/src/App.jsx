 import { useEffect, useState } from "react";
import "./App.css";
import { supabase } from "./lib/supabase";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";

function App() {
  const [session, setSession] = useState(null);
  const [page, setPage] = useState("login");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    getSession();

    // Listen for login/logout changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (_event, currentSession) => {
        setSession(currentSession);

        if (currentSession) {
          setPage("dashboard");
        } else {
          setPage("login");
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  async function getSession() {
    const {
      data: { session: currentSession },
      error,
    } = await supabase.auth.getSession();

    if (error) {
      console.error(
        "Session error:",
        error.message
      );
    }

    setSession(currentSession);

    if (currentSession) {
      setPage("dashboard");
    }

    setLoading(false);
  }

  // Loading screen
  if (loading) {
    return (
      <div className="loading-screen">

        <div className="loader"></div>

        <h3>Goal Grid</h3>

        <p>
          Loading your workspace...
        </p>

      </div>
    );
  }

  // Logged-in user
  if (session) {
    return <Dashboard />;
  }

  // Signup page
  if (page === "signup") {
    return (
      <Signup
        goToLogin={() =>
          setPage("login")
        }
      />
    );
  }

  // Login page
  return (
    <Login
      goToSignup={() =>
        setPage("signup")
      }
    />
  );
}

export default App;