import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../supabase";

function ResetPassword() {
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  const handleUpdatePassword = async (e) => {
    e.preventDefault();

    setMessage("");
    setSuccess(false);

    if (password.length < 6) {
      setMessage(
        "Password must be at least 6 characters."
      );
      return;
    }

    if (password !== confirmPassword) {
      setMessage(
        "Passwords do not match."
      );
      return;
    }

    setLoading(true);

    const { error } =
      await supabase.auth.updateUser({
        password,
      });

    if (error) {
      console.error(
        "Password update error:",
        error
      );

      setMessage(error.message);
      setLoading(false);
      return;
    }

    setSuccess(true);
    setMessage(
      "Password updated successfully!"
    );

    setLoading(false);

    setTimeout(() => {
      navigate("/login");
    }, 1500);
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <Link to="/" className="login-logo">
          <div className="logo-icon">+</div>

          <div>
            <strong>Medicare</strong>
            <span>Pharmacy & Wellness</span>
          </div>
        </Link>

        <div className="login-heading">
          <p className="eyebrow">
            RESET PASSWORD
          </p>

          <h1>
            Create a new password
          </h1>

          <p>
            Choose a new password for your
            Medicare account.
          </p>
        </div>

        <form
          className="login-form"
          onSubmit={handleUpdatePassword}
        >
          <div className="form-group">
            <label htmlFor="password">
              New Password
            </label>

            <input
              id="password"
              type="password"
              placeholder="Enter new password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              autoComplete="new-password"
              minLength="6"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">
              Confirm Password
            </label>

            <input
              id="confirmPassword"
              type="password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) =>
                setConfirmPassword(
                  e.target.value
                )
              }
              autoComplete="new-password"
              minLength="6"
              required
            />
          </div>

          <button
            type="submit"
            className="login-submit"
            disabled={loading}
          >
            {loading
              ? "Updating Password..."
              : "Update Password →"}
          </button>
        </form>

        {message && (
          <p
            className={
              success
                ? "login-note success-message"
                : "login-note error-message"
            }
          >
            {message}
          </p>
        )}

        <Link
          to="/login"
          className="back-home"
        >
          ← Back to Login
        </Link>
      </div>
    </div>
  );
}

export default ResetPassword;

