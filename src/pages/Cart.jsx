import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Cart() {
  const navigate = useNavigate();

  const [cart, setCart] = useState(() => {
    try {
      const savedCart = localStorage.getItem("medicare_cart");
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (error) {
      console.error("Cart data error:", error);
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("medicare_cart", JSON.stringify(cart));
  }, [cart]);

  const updateCart = (newCart) => {
    setCart(newCart);
    localStorage.setItem("medicare_cart", JSON.stringify(newCart));
  };

  const increaseQuantity = (id) => {
    const newCart = cart.map((item) => {
      if (item.id === id) {
        return {
          ...item,
          quantity: item.quantity + 1,
        };
      }

      return item;
    });

    updateCart(newCart);
  };

  const decreaseQuantity = (id) => {
    const newCart = cart
      .map((item) => {
        if (item.id === id) {
          return {
            ...item,
            quantity: item.quantity - 1,
          };
        }

        return item;
      })
      .filter((item) => item.quantity > 0);

    updateCart(newCart);
  };

  const removeItem = (id) => {
    const newCart = cart.filter((item) => item.id !== id);
    updateCart(newCart);
  };

  const clearCart = () => {
    updateCart([]);
  };

  const subtotal = cart.reduce((total, item) => {
    return (
      total +
      Number(item.price) * Number(item.quantity)
    );
  }, 0);

  const deliveryFee = subtotal > 0 ? 30 : 0;
  const total = subtotal + deliveryFee;

  return (
    <div className="page">
      {/* Navbar */}
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

          <Link to="/medicines">
            Medicines
          </Link>

          <Link to="/prescription">
            Prescription
          </Link>

          <Link to="/orders">
            My Orders
          </Link>
        </div>

        <Link to="/login" className="login-btn">
          Login
        </Link>
      </nav>

      {/* Cart Page */}
      <main className="content-page cart-page">
        <div className="page-heading">
          <p className="eyebrow">
            YOUR ORDER
          </p>

          <h1>Your Cart</h1>

          <p>
            Review your medicines before continuing
            to checkout.
          </p>
        </div>

        {/* Empty Cart */}
        {cart.length === 0 ? (
          <div className="empty-orders">
            <div className="empty-icon">
              🛒
            </div>

            <h2>
              Your cart is empty
            </h2>

            <p>
              Add medicines from our pharmacy
              to start your order.
            </p>

            <Link
              to="/medicines"
              className="primary-btn"
            >
              Browse Medicines →
            </Link>
          </div>
        ) : (
          <div className="cart-layout">

            {/* Cart Items */}
            <div className="cart-items">
              <div className="cart-header">
                <h2>
                  Selected Medicines
                </h2>

                <button
                  type="button"
                  className="clear-cart"
                  onClick={clearCart}
                >
                  Clear Cart
                </button>
              </div>

              {cart.map((item) => (
                <div
                  className="cart-item"
                  key={item.id}
                >
                  <div className="cart-item-icon">
                    ✚
                  </div>

                  <div className="cart-item-info">
                    <p>
                      Medicine
                    </p>

                    <h3>
                      {item.name}
                    </h3>

                    <strong>
                      ₹
                      {Number(
                        item.price
                      ).toFixed(2)}
                    </strong>
                  </div>

                  {/* Quantity */}
                  <div className="quantity-control">
                    <button
                      type="button"
                      onClick={() =>
                        decreaseQuantity(
                          item.id
                        )
                      }
                    >
                      −
                    </button>

                    <span>
                      {item.quantity}
                    </span>

                    <button
                      type="button"
                      onClick={() =>
                        increaseQuantity(
                          item.id
                        )
                      }
                    >
                      +
                    </button>
                  </div>

                  {/* Item Total */}
                  <div className="cart-item-total">
                    <strong>
                      ₹
                      {(
                        Number(item.price) *
                        Number(item.quantity)
                      ).toFixed(2)}
                    </strong>

                    <button
                      type="button"
                      className="remove-item"
                      onClick={() =>
                        removeItem(item.id)
                      }
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}

              <Link
                to="/medicines"
                className="continue-shopping"
              >
                ← Continue Shopping
              </Link>
            </div>

            {/* Order Summary */}
            <div className="cart-summary">
              <p className="eyebrow">
                ORDER SUMMARY
              </p>

              <h2>
                Summary
              </h2>

              <div className="summary-row">
                <span>
                  Subtotal
                </span>

                <strong>
                  ₹
                  {subtotal.toFixed(2)}
                </strong>
              </div>

              <div className="summary-row">
                <span>
                  Delivery
                </span>

                <strong>
                  ₹
                  {deliveryFee.toFixed(2)}
                </strong>
              </div>

              <div className="summary-divider"></div>

              <div className="summary-total">
                <span>
                  Total
                </span>

                <strong>
                  ₹
                  {total.toFixed(2)}
                </strong>
              </div>

              {/* Checkout Button */}
              <button
                type="button"
                className="checkout-btn"
                onClick={() =>
                  navigate("/checkout")
                }
              >
                Continue →
              </button>

              <p className="secure-note">
                🔒 Secure checkout • Pharmacy
                verification
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default Cart;