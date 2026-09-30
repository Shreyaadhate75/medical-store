import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../supabase";

function AdminDashboard() {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [prescriptionLoading, setPrescriptionLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminUser, setAdminUser] = useState(null);
  const [message, setMessage] = useState("");
  const [updatingOrder, setUpdatingOrder] = useState(null);

  useEffect(() => {
    checkAdmin();
  }, []);

  const checkAdmin = async () => {
    setLoading(true);
    setMessage("");

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      navigate("/login", {
        state: {
          from: "/admin",
        },
      });
      return;
    }

    setAdminUser(user);

    const { data, error } = await supabase.rpc(
      "is_admin"
    );

    if (error) {
      console.error("Admin check error:", error);

      setMessage(
        "Unable to verify admin access. Please try again."
      );

      setLoading(false);
      return;
    }

    if (!data) {
      setMessage(
        "You do not have permission to access the Admin Dashboard."
      );

      setLoading(false);
      return;
    }

    setIsAdmin(true);

    await Promise.all([
      fetchOrders(),
      fetchPrescriptions(),
    ]);

    setLoading(false);
  };

  const fetchOrders = async () => {
    const { data, error } = await supabase
      .from("orders")
      .select(`
        id,
        user_id,
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
        ),
        profiles (
          full_name,
          phone
        )
      `)
      .order("created_at", {
        ascending: false,
      });

    if (error) {
      console.error(
        "Admin orders error:",
        error
      );

      setMessage(
        "Unable to load customer orders."
      );

      setOrders([]);
      return;
    }

    setOrders(data || []);
  };

  const fetchPrescriptions = async () => {
    setPrescriptionLoading(true);

    const { data, error } = await supabase
      .from("prescriptions")
      .select(`
        id,
        user_id,
        file_name,
        file_path,
        status,
        admin_note,
        uploaded_at,
        verified_at,
        profiles (
          full_name,
          phone
        )
      `)
      .order("uploaded_at", {
        ascending: false,
      });

    if (error) {
      console.error(
        "Admin prescriptions error:",
        error
      );

      setPrescriptions([]);
      setPrescriptionLoading(false);
      return;
    }

    setPrescriptions(data || []);
    setPrescriptionLoading(false);
  };

  const updateOrderStatus = async (
    orderId,
    newStatus
  ) => {
    setUpdatingOrder(orderId);
    setMessage("");

    const { error } = await supabase
      .from("orders")
      .update({
        order_status: newStatus,
      })
      .eq("id", orderId);

    if (error) {
      console.error(
        "Order status update error:",
        error
      );

      setMessage(
        "Unable to update order status."
      );

      setUpdatingOrder(null);
      return;
    }

    setOrders((currentOrders) =>
      currentOrders.map((order) =>
        order.id === orderId
          ? {
              ...order,
              order_status: newStatus,
            }
          : order
      )
    );

    setUpdatingOrder(null);
  };

  const updatePaymentStatus = async (
    orderId,
    newStatus
  ) => {
    setUpdatingOrder(orderId);
    setMessage("");

    const { error } = await supabase
      .from("orders")
      .update({
        payment_status: newStatus,
      })
      .eq("id", orderId);

    if (error) {
      console.error(
        "Payment status update error:",
        error
      );

      setMessage(
        "Unable to update payment status."
      );

      setUpdatingOrder(null);
      return;
    }

    setOrders((currentOrders) =>
      currentOrders.map((order) =>
        order.id === orderId
          ? {
              ...order,
              payment_status: newStatus,
            }
          : order
      )
    );

    setUpdatingOrder(null);
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
        return "Pending";
    }
  };

  const pendingOrders = orders.filter(
    (order) =>
      order.order_status === "pending"
  ).length;

  const activeOrders = orders.filter(
    (order) =>
      [
        "confirmed",
        "preparing",
        "ready",
        "out_for_delivery",
      ].includes(order.order_status)
  ).length;

  const deliveredOrders = orders.filter(
    (order) =>
      order.order_status === "delivered"
  ).length;

  const pendingPrescriptions =
    prescriptions.filter(
      (prescription) =>
        prescription.status === "pending"
    ).length;

  if (loading) {
    return (
      <div className="admin-page">
        <div className="admin-loading">
          <div className="admin-loading-icon">
            +
          </div>

          <h2>
            Loading Admin Dashboard...
          </h2>

          <p>
            Please wait while we load your
            pharmacy data.
          </p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="admin-page">
        <div className="admin-access-denied">
          <div className="admin-denied-icon">
            🔐
          </div>

          <p className="eyebrow">
            ACCESS RESTRICTED
          </p>

          <h1>
            Admin access required
          </h1>

          <p>
            {message ||
              "You do not have permission to access the Admin Dashboard."}
          </p>

          <Link
            to="/"
            className="primary-btn"
          >
            Back to Home →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <nav className="admin-navbar">
        <Link
          to="/"
          className="admin-logo"
        >
          <div className="logo-icon">
            +
          </div>

          <div>
            <strong>
              Medicare
            </strong>

            <span>
              Admin Dashboard
            </span>
          </div>
        </Link>

        <div className="admin-nav-actions">
          <Link
            to="/"
            className="admin-nav-link"
          >
            View Website
          </Link>

          <Link
            to="/orders"
            className="admin-nav-link"
          >
            Customer Orders
          </Link>

          <span className="admin-user">
            {adminUser?.email}
          </span>
        </div>
      </nav>

      <main className="admin-content">
        <div className="admin-heading">
          <div>
            <p className="eyebrow">
              PHARMACY MANAGEMENT
            </p>

            <h1>
              Admin Dashboard
            </h1>

            <p>
              Manage customer orders,
              prescriptions and pharmacy
              operations from one place.
            </p>
          </div>

          <div className="admin-welcome">
            <span>
              Signed in as
            </span>

            <strong>
              {adminUser?.email}
            </strong>
          </div>
        </div>

        {message && (
          <div className="admin-message">
            {message}
          </div>
        )}

        <section className="admin-stats">
          <div className="admin-stat-card">
            <div className="admin-stat-icon">
              📦
            </div>

            <div>
              <span>
                Total Orders
              </span>

              <strong>
                {orders.length}
              </strong>
            </div>
          </div>

          <div className="admin-stat-card">
            <div className="admin-stat-icon">
              ⏳
            </div>

            <div>
              <span>
                Pending Orders
              </span>

              <strong>
                {pendingOrders}
              </strong>
            </div>
          </div>

          <div className="admin-stat-card">
            <div className="admin-stat-icon">
              🚚
            </div>

            <div>
              <span>
                Active Orders
              </span>

              <strong>
                {activeOrders}
              </strong>
            </div>
          </div>

          <div className="admin-stat-card">
            <div className="admin-stat-icon">
              📋
            </div>

            <div>
              <span>
                Pending Prescriptions
              </span>

              <strong>
                {pendingPrescriptions}
              </strong>
            </div>
          </div>
        </section>

        <section className="admin-section">
          <div className="admin-section-heading">
            <div>
              <p className="eyebrow">
                CUSTOMER ORDERS
              </p>

              <h2>
                All Orders
              </h2>

              <p>
                View and manage every customer
                order placed through the website.
              </p>
            </div>

            <div className="admin-count">
              {orders.length} orders
            </div>
          </div>

          {orders.length === 0 ? (
            <div className="admin-empty">
              <div>📦</div>

              <h3>
                No customer orders yet
              </h3>

              <p>
                Orders placed by customers
                will appear here.
              </p>
            </div>
          ) : (
            <div className="admin-orders-list">
              {orders.map((order) => (
                <div
                  className="admin-order-card"
                  key={order.id}
                >
                  <div className="admin-order-header">
                    <div>
                      <span className="admin-order-label">
                        ORDER #{order.id}
                      </span>

                      <h3>
                        {order.profiles
                          ?.full_name ||
                          "Customer"}
                      </h3>

                      <p>
                        {formatDate(
                          order.created_at
                        )}
                      </p>
                    </div>

                    <span
                      className={`admin-status ${order.order_status}`}
                    >
                      {getStatusLabel(
                        order.order_status
                      )}
                    </span>
                  </div>

                  <div className="admin-customer-grid">
                    <div>
                      <span>
                        Customer
                      </span>

                      <strong>
                        {order.profiles
                          ?.full_name ||
                          "Not available"}
                      </strong>
                    </div>

                    <div>
                      <span>
                        Phone
                      </span>

                      <strong>
                        {order.profiles
                          ?.phone ||
                          "Not available"}
                      </strong>
                    </div>

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
                          ? "✓ Paid"
                          : "Pending"}
                      </strong>
                    </div>

                    {order.order_type ===
                      "delivery" &&
                      order.delivery_address && (
                        <div className="admin-address">
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

                  <div className="admin-medicines">
                    <div className="admin-subheading">
                      <strong>
                        Ordered Medicines
                      </strong>
                    </div>

                    {order.order_items?.map(
                      (item) => (
                        <div
                          className="admin-medicine-row"
                          key={item.id}
                        >
                          <div className="admin-medicine-icon">
                            ✚
                          </div>

                          <div>
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
                          </div>

                          <span>
                            Qty: {item.quantity}
                          </span>

                          <strong>
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

                  <div className="admin-order-footer">
                    <div className="admin-total">
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

                    <div className="admin-controls">
                      <div>
                        <label>
                          Order Status
                        </label>

                        <select
                          value={
                            order.order_status ||
                            "pending"
                          }
                          disabled={
                            updatingOrder ===
                            order.id
                          }
                          onChange={(e) =>
                            updateOrderStatus(
                              order.id,
                              e.target.value
                            )
                          }
                        >
                          <option value="pending">
                            Order Placed
                          </option>

                          <option value="confirmed">
                            Confirmed
                          </option>

                          <option value="preparing">
                            Preparing
                          </option>

                          <option value="ready">
                            Ready
                          </option>

                          <option value="out_for_delivery">
                            Out for Delivery
                          </option>

                          <option value="delivered">
                            Delivered
                          </option>

                          <option value="cancelled">
                            Cancelled
                          </option>
                        </select>
                      </div>

                      <div>
                        <label>
                          Payment Status
                        </label>

                        <select
                          value={
                            order.payment_status ||
                            "pending"
                          }
                          disabled={
                            updatingOrder ===
                            order.id
                          }
                          onChange={(e) =>
                            updatePaymentStatus(
                              order.id,
                              e.target.value
                            )
                          }
                        >
                          <option value="pending">
                            Pending
                          </option>

                          <option value="paid">
                            Paid
                          </option>

                          <option value="failed">
                            Failed
                          </option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="admin-section">
          <div className="admin-section-heading">
            <div>
              <p className="eyebrow">
                PRESCRIPTION MANAGEMENT
              </p>

              <h2>
                Prescription Requests
              </h2>

              <p>
                Review prescription uploads from
                customers.
              </p>
            </div>

            <div className="admin-count">
              {prescriptions.length} requests
            </div>
          </div>

          {prescriptionLoading ? (
            <div className="admin-empty">
              <div>📋</div>

              <h3>
                Loading prescriptions...
              </h3>
            </div>
          ) : prescriptions.length === 0 ? (
            <div className="admin-empty">
              <div>📋</div>

              <h3>
                No prescription requests
              </h3>

              <p>
                Customer prescription uploads
                will appear here.
              </p>
            </div>
          ) : (
            <div className="admin-prescription-list">
              {prescriptions.map(
                (prescription) => (
                  <div
                    className="admin-prescription-card"
                    key={prescription.id}
                  >
                    <div className="prescription-file-icon">
                      PDF
                    </div>

                    <div className="prescription-info">
                      <span>
                        Prescription #
                        {prescription.id}
                      </span>

                      <h3>
                        {prescription.file_name}
                      </h3>

                      <p>
                        Customer:{" "}
                        {prescription.profiles
                          ?.full_name ||
                          "Customer"}
                      </p>

                      <small>
                        Uploaded:{" "}
                        {formatDate(
                          prescription.uploaded_at
                        )}
                      </small>
                    </div>

                    <span
                      className={`prescription-status ${prescription.status}`}
                    >
                      {prescription.status}
                    </span>
                  </div>
                )
              )}
            </div>
          )}
        </section>

        <section className="admin-bottom-stats">
          <div>
            <span>
              Delivered Orders
            </span>

            <strong>
              {deliveredOrders}
            </strong>
          </div>

          <div>
            <span>
              Prescription Requests
            </span>

            <strong>
              {prescriptions.length}
            </strong>
          </div>

          <div>
            <span>
              Pending Verification
            </span>

            <strong>
              {pendingPrescriptions}
            </strong>
          </div>
        </section>
      </main>
    </div>
  );
}

export default AdminDashboard;

