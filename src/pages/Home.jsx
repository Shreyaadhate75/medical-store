import { Link } from "react-router-dom";

function Home() {
  return (
    <div>
      <nav className="navbar">
        <Link to="/" className="logo">
          <div className="logo-icon">+</div>
          <div>
            <strong>Medicare</strong>
            <span>Pharmacy & Wellness</span>
          </div>
        </Link>

        <div className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/medicines">Medicines</Link>
          <Link to="/prescription">Prescription</Link>
          <Link to="/orders">My Orders</Link>
        </div>

        <Link to="/login" className="login-btn">
          Login
        </Link>
      </nav>

      <main className="hero">
        <div className="hero-content">
          <p className="eyebrow">TRUSTED PHARMACY • BETTER CARE</p>

          <h1>
            Your Health,
            <br />
            <span>Our Priority.</span>
          </h1>

          <p className="hero-text">
            Find medicines, upload your prescription and track your orders —
            all in one simple and secure place.
          </p>

          <div className="hero-buttons">
            <Link to="/medicines" className="primary-btn">
              Find Medicines →
            </Link>

            <Link to="/prescription" className="secondary-btn">
              Upload Prescription
            </Link>
          </div>

          <div className="trust-row">
            <div>✓ Verified Medicines</div>
            <div>✓ Secure Prescription</div>
            <div>✓ Easy Order Tracking</div>
          </div>
        </div>

        <div className="hero-card">
          <div className="medicine-symbol">✚</div>

          <h2>Healthcare made simpler.</h2>

          <p>
            Manage medicines, prescriptions and orders from one convenient
            platform.
          </p>

          <div className="availability">
            <span></span>
            Pharmacy services available
          </div>
        </div>
      </main>

      <section className="features-section">
        <p className="eyebrow">EVERYTHING YOU NEED</p>

        <h2>Healthcare at your fingertips.</h2>

        <div className="feature-grid">
          <Link to="/medicines" className="feature-card">
            <div className="feature-icon">⌕</div>
            <h3>Medicine Availability</h3>
            <p>
              Search medicines and check their availability before ordering.
            </p>
            <strong>Explore Medicines →</strong>
          </Link>

          <Link to="/prescription" className="feature-card">
            <div className="feature-icon">↑</div>
            <h3>Upload Prescription</h3>
            <p>
              Upload your prescription securely for pharmacy verification.
            </p>
            <strong>Upload Now →</strong>
          </Link>

          <Link to="/orders" className="feature-card">
            <div className="feature-icon">◷</div>
            <h3>Track Your Order</h3>
            <p>
              Check your order status and keep track of your medicines.
            </p>
            <strong>View Orders →</strong>
          </Link>
        </div>
      </section>

      <footer className="footer">
        <div>
          <strong>Medicare</strong>
          <p>Pharmacy & Wellness</p>
        </div>

        <p>© 2026 Medicare. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default Home;