import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../supabase";

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    setLoading(true);
    setMessage("");

    const { data, error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: {
          full_name: form.fullName,
          phone: form.phone,
        },
      },
    });

    if (error) {
      setMessage(error.message);
      setLoading(false);
      return;
    }

    if (data.user) {
      setMessage(
        "Account created successfully! Please check your email to verify your account."
      );
    }

    setLoading(false);
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
          <p className="eyebrow">CREATE ACCOUNT</p>

          <h1>Join Medicare</h1>

          <p>
            Create your account to manage prescriptions and orders.
          </p>
        </div>

        <form className="login-form" onSubmit={handleRegister}>
          <div className="form-group">
            <label htmlFor="fullName">Full Name</label>

            <input
              id="fullName"
              name="fullName"
              type="text"
              placeholder="Enter your full name"
              value={form.fullName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone">Phone Number</label>

            <input
              id="phone"
              name="phone"
              type="tel"
              placeholder="Enter your phone number"
              value={form.phone}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address</label>

            <input
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>

            <input
              id="password"
              name="password"
              type="password"
              placeholder="Create a password"
              value={form.password}
              onChange={handleChange}
              minLength="6"
              required
            />
          </div>

          <button
            type="submit"
            className="login-submit"
            disabled={loading}
          >
            {loading ? "Creating Account..." : "Create Account →"}
          </button>
        </form>

        {message && (
          <p className="login-note">
            {message}
          </p>
        )}

        <p className="login-note">
          Already have an account?{" "}
          <Link to="/login">Sign in</Link>
        </p>

        <Link to="/" className="back-home">
          ← Back to Home
        </Link>
      </div>
    </div>
  );
}

export default Register;