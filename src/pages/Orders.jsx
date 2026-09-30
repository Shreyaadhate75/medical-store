import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../supabase";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    setMessage("");

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      setMessage(
        "Please login to view your orders."
      );
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("orders")
      .select(`
        id,
        total_amount,
        order_type,
        payment_status,
        order_status,
        delivery_address,
        created_at,
        order_items (
          id,
          quantity,
          price,
          medicine_id,
          medicines (
            name,
            category
          )
        )
      `)
      .eq("user_id", user.id)
      .order("created_at", {
        ascending: false,
      });

    if (error) {
      console.error(
        "Orders fetch error:",
        error
      );

      setMessage(
        "Unable to load your orders. Please try again."
      );

      setOrders([]);
      setLoading(false);
      return;
    }

    setOrders(data || []);
    setLoading(false);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }
    );
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "pending":
        return "Order Placed";

      case "confirmed":
        return "Confirmed";

      case "preparing":
        return "Preparing";

      case "ready":
        return "Ready";

      case "out_for_delivery":
        return "Out for Delivery";

      case "delivered":
        return "Delivered";

      case "cancelled":
        return "Cancelled";

      default:
        return status || "Pending";
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "delivered":
        return "order-status delivered";

      case "cancelled":
        return "order-status cancelled";

      case "out_for_delivery":
        return "order-status delivery";

      case "confirmed":
      case "preparing":
      case "ready":
        return "order-status active";

      default:
        return "order-status pending";
    }
  };

  return (
    <div className="page">
      {/* Navbar */}
      <nav className="navbar">
        <Link to="/" className="logo">
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

        <div className="nav-links">
          <Link to="/">
            Home
          </Link>

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

        <Link
          to="/login"
          className="login-btn"
        >
          Login
        </Link>
      </nav>

      {/* Main */}
      <main className="content-page orders-page">
        <div className="page-heading">
          <p className="eyebrow">
            YOUR ORDERS
          </p>

          <h1>
            My Orders
          </h1>

          <p>
            Track your medicines, prescription
            orders and delivery status from one
            place.
          </p>
        </div>

        {/* Loading */}
        {loading && (
          <div className="empty-orders">
            <div className="empty-icon">
              ◷
            </div>

            <h2>
              Loading your orders...
            </h2>

            <p>
              Please wait while we fetch your
              latest orders.
            </p>
          </div>
        )}

        {/* Message */}
        {!loading && message && (
          <div className="empty-orders">
            <div className="empty-icon">
              🔐
            </div>

            <h2>
              Login required
            </h2>

            <p>
              {message}
            </p>

            <Link
              to="/login"
              className="primary-btn"
            >
              Login →
            </Link>
          </div>
        )}

        {/* No Orders */}
        {!loading &&
          !message &&
          orders.length === 0 && (
            <div className="empty-orders">
              <div className="empty-icon">
                ◷
              </div>

              <h2>
                No orders yet
              </h2>

              <p>
                You haven't placed any orders
                yet. Browse our medicines or
                upload a prescription to get
                started.
              </p>

              <div className="order-actions">
                <Link
                  to="/medicines"
                  className="primary-btn"
                >
                  Browse Medicines →
                </Link>

                <Link
                  to="/prescription"
                  className="secondary-btn"
                >
                  Upload Prescription
                </Link>
              </div>
            </div>
          )}

        {/* Orders */}
        {!loading &&
          !message &&
          orders.length > 0 && (
            <div className="orders-list">
              {orders.map((order) => (
                <div
                  className="order-card"
                  key={order.id}
                >
                  {/* Order Header */}
                  <div className="order-card-header">
                    <div>
                      <p className="order-label">
                        ORDER
                      </p>

                      <h2>
                        #{order.id}
                      </h2>

                      <span className="order-date">
                        {formatDate(
                          order.created_at
                        )}
                      </span>
                    </div>

                    <span
                      className={getStatusClass(
                        order.order_status
                      )}
                    >
                      {getStatusLabel(
                        order.order_status
                      )}
                    </span>
                  </div>

                  {/* Order Items */}
                  <div className="order-items">
                    {order.order_items?.map(
                      (item) => (
                        <div
                          className="order-item"
                          key={item.id}
                        >
                          <div className="order-item-icon">
                            ✚
                          </div>

                          <div className="order-item-info">
                            <strong>
                              {item.medicines
                                ?.name ||
                                "Medicine"}
                            </strong>

                            <span>
                              {item.medicines
                                ?.category ||
                                "Healthcare"}
                            </span>

                            <small>
                              Qty:{" "}
                              {item.quantity}
                            </small>
                          </div>

                          <strong className="order-item-price">
                            ₹
                            {(
                              Number(
                                item.price
                              ) *
                              Number(
                                item.quantity
                              )
                            ).toFixed(2)}
                          </strong>
                        </div>
                      )
                    )}
                  </div>

                  {/* Order Details */}
                  <div className="order-details">
                    <div>
                      <span>
                        Order Type
                      </span>

                      <strong>
                        {order.order_type ===
                        "delivery"
                          ? "🚚 Home Delivery"
                          : "🏪 Store Pickup"}
                      </strong>
                    </div>

                    <div>
                      <span>
                        Payment
                      </span>

                      <strong>
                        {order.payment_status ===
                        "paid"
                          ? "Paid"
                          : "Payment Pending"}
                      </strong>
                    </div>

                    {order.order_type ===
                      "delivery" &&
                      order.delivery_address && (
                        <div className="order-address">
                          <span>
                            Delivery Address
                          </span>

                          <strong>
                            {
                              order.delivery_address
                            }
                          </strong>
                        </div>
                      )}
                  </div>

                  {/* Total */}
                  <div className="order-card-footer">
                    <span>
                      Total Amount
                    </span>

                    <strong>
                      ₹
                      {Number(
                        order.total_amount
                      ).toFixed(2)}
                    </strong>
                  </div>
                </div>
              ))}
            </div>
          )}
      </main>
    </div>
  );
}

export default Orders;

