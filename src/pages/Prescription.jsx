import { Link } from "react-router-dom";

function Prescription() {
  return (
    <div className="page">
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

      <main className="content-page prescription-page">
        <div className="page-heading">
          <p className="eyebrow">SECURE & PRIVATE</p>

          <h1>Upload your prescription.</h1>

          <p>
            Upload a clear photo or PDF of your prescription. Our pharmacy
            team will verify it and confirm medicine availability.
          </p>
        </div>

        <div className="upload-card">
          <div className="upload-icon">↑</div>

          <h2>Upload Prescription</h2>

          <p>
            JPG, PNG or PDF
            <br />
            Maximum file size: 5MB
          </p>

          <label className="upload-button">
            Choose File

            <input
              type="file"
              accept=".jpg,.jpeg,.png,.pdf"
              hidden
            />
          </label>

          <small>
            Your prescription is kept secure and is only used for
            verification.
          </small>
        </div>

        <div className="steps">
          <div className="step active">
            <div>1</div>
            <h3>Upload</h3>
            <p>Send your prescription securely.</p>
          </div>

          <div className="step">
            <div>2</div>
            <h3>Verification</h3>
            <p>Our pharmacy team checks the prescription.</p>
          </div>

          <div className="step">
            <div>3</div>
            <h3>Confirmation</h3>
            <p>Get availability and order details.</p>
          </div>
        </div>

        <div className="back-link">
          <Link to="/medicines">← Back to Medicines</Link>
        </div>
      </main>
    </div>
  );
}

export default Prescription;