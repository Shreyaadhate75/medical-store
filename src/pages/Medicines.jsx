import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../supabase";

function Medicines() {
  const navigate = useNavigate();

  const [medicines, setMedicines] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [cart, setCart] = useState(() => {
    try {
      const savedCart = localStorage.getItem("medicare_cart");
      return savedCart ? JSON.parse(savedCart) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    fetchMedicines();
  }, []);

  useEffect(() => {
    localStorage.setItem("medicare_cart", JSON.stringify(cart));
  }, [cart]);

  const fetchMedicines = async () => {
    setLoading(true);
    setError("");

    const { data, error } = await supabase
      .from("medicines")
      .select("*")
      .order("name", { ascending: true });

    if (error) {
      console.error(error);
      setError("Unable to load medicines. Please try again.");
      setMedicines([]);
    } else {
      setMedicines(data || []);
    }

    setLoading(false);
  };

  const filteredMedicines = medicines.filter((medicine) => {
    const searchText = search.toLowerCase().trim();

    return (
      medicine.name?.toLowerCase().includes(searchText) ||
      medicine.category?.toLowerCase().includes(searchText)
    );
  });

  const addToCart = (medicine) => {
    setCart((currentCart) => {
      const existingItem = currentCart.find(
        (item) => item.id === medicine.id
      );

      if (existingItem) {
        return currentCart.map((item) =>
          item.id === medicine.id
            ? {
                ...item,
                quantity: item.quantity + 1,
              }
            : item
        );
      }

      return [
        ...currentCart,
        {
          id: medicine.id,
          name: medicine.name,
          price: Number(medicine.price),
          quantity: 1,
        },
      ];
    });
  };

  const cartCount = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

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

        <div className="nav-actions">
          <Link to="/cart" className="cart-btn">
            🛒 Cart
            {cartCount > 0 && (
              <span className="cart-count">{cartCount}</span>
            )}
          </Link>

          <Link to="/login" className="login-btn">
            Login
          </Link>
        </div>
      </nav>

      <main className="content-page">
        <div className="page-heading">
          <p className="eyebrow">OUR PHARMACY</p>

          <h1>Find your medicines.</h1>

          <p>
            Search medicines and check their availability before placing
            your order.
          </p>
        </div>

        <div className="medicine-search">
          <span>⌕</span>

          <input
            type="text"
            placeholder="Search medicine, category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {loading && (
          <div className="loading-message">
            Loading medicines...
          </div>
        )}

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {!loading && !error && (
          <>
            {filteredMedicines.length > 0 ? (
              <div className="medicine-grid">
                {filteredMedicines.map((medicine) => {
                  const available = medicine.stock_quantity > 0;

                  return (
                    <div
                      className="medicine-card"
                      key={medicine.id}
                    >
                      <div className="medicine-card-top">
                        <div className="medicine-image">
                          ✚
                        </div>

                        <span
                          className={
                            available
                              ? "available"
                              : "unavailable"
                          }
                        >
                          {available
                            ? "Available"
                            : "Out of Stock"}
                        </span>
                      </div>

                      <p className="medicine-category">
                        {medicine.category || "Healthcare"}
                      </p>

                      <h3>{medicine.name}</h3>

                      <div className="medicine-bottom">
                        <strong>
                          ₹{Number(medicine.price).toFixed(2)}
                        </strong>

                        {available ? (
                          <button
                            className="order-btn"
                            type="button"
                            onClick={() => addToCart(medicine)}
                          >
                            Add to Order
                          </button>
                        ) : (
                          <button
                            className="disabled-btn"
                            disabled
                          >
                            Unavailable
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="empty-orders">
                <div className="empty-icon">⌕</div>

                <h2>No medicines found</h2>

                <p>
                  We couldn't find a medicine matching "{search}".
                  Try another medicine name or category.
                </p>
              </div>
            )}
          </>
        )}

        <div className="prescription-banner">
          <div>
            <p className="eyebrow">PRESCRIPTION MEDICINES</p>

            <h2>Can't find your medicine?</h2>

            <p>
              Upload your prescription and our pharmacy team can verify
              availability for you.
            </p>
          </div>

          <Link to="/prescription" className="primary-btn">
            Upload Prescription →
          </Link>
        </div>

        {cartCount > 0 && (
          <div className="floating-cart">
            <div>
              <strong>{cartCount} item(s) in cart</strong>
              <span>
                ₹
                {cart
                  .reduce(
                    (total, item) =>
                      total + item.price * item.quantity,
                    0
                  )
                  .toFixed(2)}
              </span>
            </div>

            <button
              type="button"
              onClick={() => navigate("/cart")}
            >
              View Cart →
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

export default Medicines;