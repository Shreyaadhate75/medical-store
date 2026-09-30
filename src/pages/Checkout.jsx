import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../supabase";

function Checkout() {
  const navigate = useNavigate();

  const [cart, setCart] = useState([]);
  const [user, setUser] = useState(null);

  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    orderType: "delivery",
    address: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const savedCart = localStorage.getItem("medicare_cart");

    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch {
        setCart([]);
      }
    }

    getUser();
  }, []);

  const getUser = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    setUser(user);

    if (user) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name, phone")
        .eq("id", user.id)
        .maybeSingle();

      if (profile) {
        setForm((current) => ({
          ...current,
          fullName: profile.full_name || "",
          phone: profile.phone || "",
        }));
      }
    }
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const subtotal = cart.reduce((total, item) => {
    return total + Number(item.price) * Number(item.quantity);
  }, 0);

  const deliveryFee =
    form.orderType === "delivery" && subtotal > 0 ? 30 : 0;

  const total = subtotal + deliveryFee;

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    setMessage("");

    if (!user) {
      setMessage("Please login before placing an order.");
      return;
    }

    if (cart.length === 0) {
      setMessage("Your cart is empty.");
      return;
    }

    if (form.orderType === "delivery" && !form.address.trim()) {
      setMessage("Please enter your delivery address.");
      return;
    }

    setLoading(true);

    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        user_id: user.id,
        total_amount: total,
        order_type: form.orderType,
        payment_status: "pending",
        order_status: "pending",
        delivery_address:
          form.orderType === "delivery"
            ? form.address.trim()
            : null,
      })
      .select()
      .single();

    if (orderError) {
      console.error(orderError);
      setMessage(orderError.message);
      setLoading(false);
      return;
    }

    const orderItems = cart.map((item) => ({
      order_id: order.id,
      medicine_id: item.id,
      quantity: item.quantity,
      price: Number(item.price),
    }));

    const { error: itemsError } = await supabase
      .from("order_items")
      .insert(orderItems);

    if (itemsError) {
      console.error(itemsError);

      await supabase
        .from("orders")
        .delete()
        .eq("id", order.id);

      setMessage(
        "Order could not be completed. Please try again."
      );

      setLoading(false);
      return;
    }

    localStorage.removeItem("medicare_cart");

    setLoading(false);

    navigate("/orders");
  };

  if (cart.length === 0) {
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

        <main className="content-page">
          <div className="empty-orders">
            <div className="empty-icon">🛒</div>

            <h2>Your cart is empty</h2>

            <p>
              Add medicines before continuing to checkout.
            </p>

            <Link to="/medicines" className="primary-btn">
              Browse Medicines →
            </Link>
          </div>
        </main>
      </div>
    );
  }

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

      <main className="content-page checkout-page">
        <div className="page-heading">
          <p className="eyebrow">SECURE CHECKOUT</p>

          <h1>Complete your order.</h1>

          <p>
            Enter your details and choose how you would like to
            receive your medicines.
          </p>
        </div>

        <form
          className="checkout-layout"
          onSubmit={handlePlaceOrder}
        >
          <div className="checkout-form-card">
            <div className="checkout-section">
              <p className="eyebrow">CUSTOMER DETAILS</p>

              <h2>Your Information</h2>

              <div className="checkout-form-grid">
                <div className="form-group">
                  <label htmlFor="fullName">
                    Full Name
                  </label>

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
                  <label htmlFor="phone">
                    Phone Number
                  </label>

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
              </div>
            </div>

            <div className="checkout-section">
              <p className="eyebrow">ORDER TYPE</p>

              <h2>How would you like to receive it?</h2>

              <div className="order-type-options">
                <label
                  className={
                    form.orderType === "delivery"
                      ? "order-type-card selected"
                      : "order-type-card"
                  }
                >
                  <input
                    type="radio"
                    name="orderType"
                    value="delivery"
                    checked={form.orderType === "delivery"}
                    onChange={handleChange}
                  />

                  <div>
                    <strong>🚚 Home Delivery</strong>

                    <span>
                      Get your medicines delivered to your
                      address.
                    </span>
                  </div>
                </label>

                <label
                  className={
                    form.orderType === "pickup"
                      ? "order-type-card selected"
                      : "order-type-card"
                  }
                >
                  <input
                    type="radio"
                    name="orderType"
                    value="pickup"
                    checked={form.orderType === "pickup"}
                    onChange={handleChange}
                  />

                  <div>
                    <strong>🏪 Store Pickup</strong>

                    <span>
                      Collect your order directly from the
                      pharmacy.
                    </span>
                  </div>
                </label>
              </div>
            </div>

            {form.orderType === "delivery" && (
              <div className="checkout-section">
                <p className="eyebrow">DELIVERY DETAILS</p>

                <h2>Where should we deliver?</h2>

                <div className="form-group">
                  <label htmlFor="address">
                    Delivery Address
                  </label>

                  <textarea
                    id="address"
                    name="address"
                    placeholder="Enter your complete delivery address"
                    value={form.address}
                    onChange={handleChange}
                    rows="4"
                    required
                  ></textarea>
                </div>

                <button
                  type="button"
                  className="location-btn"
                  onClick={() =>
                    setMessage(
                      "Location feature will be connected next."
                    )
                  }
                >
                  📍 Use My Location
                </button>
              </div>
            )}

            {message && (
              <div className="checkout-message">
                {message}
              </div>
            )}

            <button
              type="submit"
              className="place-order-btn"
              disabled={loading}
            >
              {loading
                ? "Placing Order..."
                : `Place Order • ₹${total.toFixed(2)}`}
            </button>

            <p className="checkout-note">
              🔒 Your order details are securely stored.
            </p>
          </div>

          <div className="checkout-summary">
            <p className="eyebrow">ORDER SUMMARY</p>

            <h2>Your Medicines</h2>

            <div className="checkout-items">
              {cart.map((item) => (
                <div
                  className="checkout-item"
                  key={item.id}
                >
                  <div>
                    <strong>{item.name}</strong>

                    <span>
                      Qty: {item.quantity}
                    </span>
                  </div>

                  <strong>
                    ₹
                    {(
                      Number(item.price) *
                      Number(item.quantity)
                    ).toFixed(2)}
                  </strong>
                </div>
              ))}
            </div>

            <div className="summary-divider"></div>

            <div className="summary-row">
              <span>Subtotal</span>

              <strong>
                ₹{subtotal.toFixed(2)}
              </strong>
            </div>

            <div className="summary-row">
              <span>
                {form.orderType === "delivery"
                  ? "Delivery"
                  : "Store Pickup"}
              </span>

              <strong>
                {form.orderType === "delivery"
                  ? `₹${deliveryFee.toFixed(2)}`
                  : "Free"}
              </strong>
            </div>

            <div className="summary-divider"></div>

            <div className="summary-total">
              <span>Total</span>

              <strong>
                ₹{total.toFixed(2)}
              </strong>
            </div>

            <div className="checkout-info">
              <strong>Prescription medicines</strong>

              <p>
                Prescription-required medicines may need
                pharmacy verification before confirmation.
              </p>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}

export default Checkout;