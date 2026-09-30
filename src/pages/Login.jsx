import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { supabase } from "../supabase";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const handleChange = (e) => {
    setForm((current) => ({
      ...current,
      [e.target.name]: e.target.value,
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    setLoading(true);
    setMessage("");
    setMessageType("");

    const email = form.email.trim();

    const { data, error } =
      await supabase.auth.signInWithPassword({
        email,
        password: form.password,
      });

    if (error) {
      console.error("Login error:", error);

      if (
        error.message
          .toLowerCase()
          .includes("invalid login credentials")
      ) {
        setMessage(
          "Invalid email or password. Please use Forgot Password if you don't remember your password."
        );
      } else {
        setMessage(error.message);
      }

      setMessageType("error");
      setLoading(false);
      return;
    }

    if (!data.session) {
      setMessage(
        "Login could not be completed. Please try again."
      );
      setMessageType("error");
      setLoading(false);
      return;
    }

    setLoading(false);

    const from = location.state?.from || "/orders";

    navigate(from, {
      replace: true,
    });
  };

  const handleForgotPassword = async () => {
    const email = form.email.trim();

    if (!email) {
      setMessage(
        "Please enter your email address first."
      );
      setMessageType("error");
      return;
    }

    setResetLoading(true);
    setMessage("");
    setMessageType("");

    const { error } =
      await supabase.auth.resetPasswordForEmail(
        email,
        {
          redirectTo: `${window.location.origin}/reset-password`,
        }
      );

    if (error) {
      console.error(
        "Password reset error:",
        error
      );

      setMessage(error.message);
      setMessageType("error");
      setResetLoading(false);
      return;
    }

    setMessage(
      "Password reset link has been sent to your email. Please check your inbox."
    );
    setMessageType("success");
    setResetLoading(false);
  };

  return (
    <div className="login-page">
      <div className="login-card">

        {/* Logo */}
        <Link
          to="/"
          className="login-logo"
        >
          <div className="logo-icon">
            +
          </div>

          <div>
            <strong>
              Medicare
            </strong>

            <span>
              Pharmacy & Wellness
            </span>
          </div>
        </Link>

        {/* Heading */}
        <div className="login-heading">
          <p className="eyebrow">
            WELCOME BACK
          </p>

          <h1>
            Sign in to Medicare
          </h1>

          <p>
            Access your prescriptions, orders and
            pharmacy services.
          </p>
        </div>

        {/* Login Form */}
        <form
          className="login-form"
          onSubmit={handleLogin}
        >

          {/* Email */}
          <div className="form-group">
            <label htmlFor="email">
              Email Address
            </label>

            <input
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email"
              value={form.email}
              onChange={handleChange}
              autoComplete="email"
              required
            />
          </div>

          {/* Password */}
          <div className="form-group">

            <div
              className="password-label-row"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                width: "100%",
                marginBottom: "8px",
              }}
            >
              <label
                htmlFor="password"
                style={{
                  margin: 0,
                }}
              >
                Password
              </label>

              <button
                type="button"
                onClick={handleForgotPassword}
                disabled={resetLoading}
                style={{
                  border: "none",
                  background: "transparent",
                  padding: 0,
                  margin: 0,
                  color: "#28734b",
                  fontSize: "12px",
                  fontWeight: "700",
                  cursor: resetLoading
                    ? "not-allowed"
                    : "pointer",
                }}
              >
                {resetLoading
                  ? "Sending..."
                  : "Forgot Password?"}
              </button>
            </div>

            <input
              id="password"
              name="password"
              type="password"
              placeholder="Enter your password"
              value={form.password}
              onChange={handleChange}
              autoComplete="current-password"
              required
            />
          </div>

          {/* Sign In */}
          <button
            type="submit"
            className="login-submit"
            disabled={loading}
          >
            {loading
              ? "Signing In..."
              : "Sign In →"}
          </button>
        </form>

        {/* Message */}
        {message && (
          <p
            className={
              messageType === "success"
                ? "login-note success-message"
                : "login-note error-message"
            }
          >
            {message}
          </p>
        )}

        {/* Register */}
        <p className="login-note">
          Don't have an account?{" "}
          <Link to="/register">
            Create Account
          </Link>
        </p>

        {/* Back */}
        <Link
          to="/"
          className="back-home"
        >
          ← Back to Home
        </Link>

      </div>
    </div>
  );
}

export default Login;

