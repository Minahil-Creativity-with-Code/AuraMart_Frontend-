import React, { useState, useEffect } from "react";
import { Chart as ChartJS, defaults } from "chart.js/auto";
import { Bar, Doughnut, Line } from "react-chartjs-2";
import { Link, useNavigate } from "react-router-dom";
import { MdSpaceDashboard, MdBorderColor } from "react-icons/md";
import { AiOutlineProduct } from "react-icons/ai";
import { FaUserFriends, FaRegUser } from "react-icons/fa";
import { GoDotFill } from "react-icons/go";
import { GiHamburgerMenu } from "react-icons/gi";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

// Chart.js defaults
defaults.maintainAspectRatio = false;
defaults.responsive = true;
defaults.plugins.title.display = true;
defaults.plugins.title.align = "start";
defaults.plugins.title.font.size = 20;
defaults.plugins.title.color = "#E0E0E0";

const Dashboard = () => {
  const { logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [productDropdownOpen, setProductDropdownOpen] = useState(false);
  const [dashboardData, setDashboardData] = useState({
    monthlyData: [],
    statusData: [],
    categoryData: [],
    summary: { totalProducts: 0, totalOrders: 0, totalUsers: 0 }
  });
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Get auth token from localStorage
      const token = localStorage.getItem('token');
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      // Fetch all dashboard data in parallel
      const [monthlyRes, statusRes, categoryRes, summaryRes] = await Promise.all([
        axios.get('http://localhost:5000/api/dashboard/monthly-orders-sales', config),
        axios.get('http://localhost:5000/api/dashboard/orders-by-status', config),
        axios.get('http://localhost:5000/api/dashboard/products-by-category', config),
        axios.get('http://localhost:5000/api/dashboard/summary', config)
      ]);

      setDashboardData({
        monthlyData: monthlyRes.data,
        statusData: statusRes.data,
        categoryData: categoryRes.data,
        summary: summaryRes.data
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      // Fallback to empty data if API fails
      setDashboardData({
        monthlyData: [],
        statusData: [],
        categoryData: [],
        summary: { totalProducts: 0, totalOrders: 0, totalUsers: 0 }
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/"); // Go to home after logout
  };

  const summaryCards = [
    { 
      name: "Total Products", 
      count: dashboardData.summary.totalProducts, 
      image: "/productIcon.jpg" 
    },
    { 
      name: "Total Orders", 
      count: dashboardData.summary.totalOrders, 
      image: "/orderIcon.jpg" 
    },
    { 
      name: "Total Users", 
      count: dashboardData.summary.totalUsers, 
      image: "/userIcon.jpg" 
    }
  ];

  return (
    <div className="dashboard">
      <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
        <GiHamburgerMenu />
      </button>

      {/* Sidebar */}
      <aside className={`sidebar ${menuOpen ? "open" : ""}`}>
        <h2>Admin Panel</h2>
        <nav>
          <ul>
            <Link to="/dashboard" className="active">
              <MdSpaceDashboard /> Dashboard
            </Link>
            <div className="div-sidebar">
              <div
                className={`dropdown-product ${productDropdownOpen ? "active" : ""}`}
                onClick={() => setProductDropdownOpen(!productDropdownOpen)}
              >
                <AiOutlineProduct /> Products ▾
              </div>
            </div>
            <ul className={`extend ${productDropdownOpen ? "show" : ""}`}>
              <li>
                <Link to="/products">
                  <GoDotFill /> All Products
                </Link>
              </li>
              <li>
                <Link to="/addproduct">
                  <GoDotFill /> Add Products
                </Link>
              </li>
              <li>
                <Link to="/categories">
                  <GoDotFill /> Categories
                </Link>
              </li>
              <li>
                <Link to="/attributes">
                  <GoDotFill /> Attributes
                </Link>
              </li>
            </ul>
            <Link to="/order">
              <MdBorderColor /> Orders
            </Link>
            <Link to="/customer">
              <FaUserFriends /> Customers
            </Link>
            <Link to="/user">
              <FaRegUser /> User
            </Link>
          </ul>
        </nav>

        <div className="support">
          Customer Support
          <br />
          <Link to="/addproduct">
            <button>Connect Now</button>
          </Link>
        </div>

        <div className="user-profile">
          <img src="admin.jpg" alt="Admin" className="adminImage" />
          <div className="user-details">
            <div>
              Admin <br />
              <Link to="/userProfile" className="view">
                View Profile
              </Link>
            </div>
          </div>
        </div>
        <br />
        <button onClick={handleLogout} className="logout-button" title="Logout">
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="dashboard-main">
        <section className="greeting">
          <h1>Dashboard</h1>
          <button 
            onClick={fetchDashboardData} 
            disabled={loading}
            style={{
              padding: '8px 16px',
              backgroundColor: 'orange',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.6 : 1
            }}
          >
            {loading ? 'Refreshing...' : ' Refresh Data'}
          </button>
        </section>

        <section className="products">
          {summaryCards.length > 0 ? (
            summaryCards.map((product, index) => (
              <div key={index} className="product">
                <img src={product.image} alt={product.name} />
                <h4>{product.name}</h4>
                <p>{product.count}</p>
              </div>
            ))
          ) : (
            <p>No products found.</p>
          )}
        </section>
<br /> <br />
        <div className="charts-grid">
          {/* Monthly Orders & Sales */}
          <div className="dataCard revenueCard">
            {loading ? (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px' }}>
                <p>Loading chart data...</p>
              </div>
            ) : dashboardData.monthlyData.length > 0 ? (
              <Line
                data={{
                  labels: dashboardData.monthlyData.map((data) => data.month),
                  datasets: [
                    {
                      label: "Orders",
                      data: dashboardData.monthlyData.map((data) => data.orders),
                      backgroundColor: "#ffffffff",
                      borderColor: "#ffcc00ff",
                    },
                    {
                      label: "Sales (PKR)",
                      data: dashboardData.monthlyData.map((data) => data.sales),
                      backgroundColor: "rgba(255, 255, 255, 1)",
                      borderColor: "#484545ff",
                    },
                  ],
                }}
                options={{
                  elements: { line: { tension: 0.5 } },
                  plugins: {
                    title: { text: "Monthly Orders & Sales" },
                    legend: { labels: { color: "#E0E0E0" } },
                  },
                  scales: {
                    x: { ticks: { color: "#E0E0E0" }, grid: { color: "rgba(255,255,255,0.1)" } },
                    y: { ticks: { color: "#E0E0E0" }, grid: { color: "rgba(255,255,255,0.1)" } },
                  },
                }}
              />
            ) : (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px' }}>
                <p>No monthly data available</p>
              </div>
            )}
          </div>

          {/* Orders by Status */}
          <div className="dataCard customerCard">
            {loading ? (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px' }}>
                <p>Loading chart data...</p>
              </div>
            ) : dashboardData.statusData.length > 0 ? (
              <Bar
                data={{
                  labels: dashboardData.statusData.map((data) => data.status),
                  datasets: [
                    {
                      label: "Orders",
                      data: dashboardData.statusData.map((data) => data.count),
                      backgroundColor: [
                        "rgba(255, 165, 0, 0.8)",  // Orange
                        "rgba(128, 128, 128, 0.8)", // Grey
                        "rgba(0, 0, 0, 0.8)",       // Black
                        "rgba(192, 192, 192, 0.8)", // Light Grey
                        "rgba(255, 140, 0, 0.8)",   // Dark Orange
                      ],
                      borderRadius: 5,
                    },
                  ],
                }}
                options={{
                  plugins: {
                    title: { text: "Orders by Status" },
                    legend: { labels: { color: "#E0E0E0" } },
                  },
                  scales: {
                    x: {
                      ticks: { color: "#E0E0E0" },
                      grid: { color: "rgba(255,255,255,0.1)" },
                    },
                    y: {
                      ticks: { color: "#E0E0E0" },
                      grid: { color: "rgba(255,255,255,0.1)" },
                    },
                  },
                }}
              />
            ) : (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px' }}>
                <p>No status data available</p>
              </div>
            )}
          </div>

          {/* Products by Category */}
          <div className="dataCard categoryCard">
            {loading ? (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px' }}>
                <p>Loading chart data...</p>
              </div>
            ) : dashboardData.categoryData.length > 0 ? (
              <Doughnut
                data={{
                  labels: dashboardData.categoryData.map((data) => data.category),
                  datasets: [
                    {
                      label: "Products",
                      data: dashboardData.categoryData.map((data) => data.count),
                      backgroundColor: [
                        "rgba(255, 165, 0, 0.8)",  // Orange → Featured
                        "rgba(128, 128, 128, 0.8)", // Grey → Lawn
                        "rgba(0, 0, 0, 0.8)",       // Black → Embroidered Lawn
                        "rgba(192, 192, 192, 0.8)", // Light Grey → Linen
                        "rgba(255, 140, 0, 0.8)",   // Dark Orange → Silk
                        "rgba(255, 99, 132, 0.8)",  // Pink → Organza
                        "rgba(54, 162, 235, 0.8)",  // Blue → Clutch Bag
                      ],
                      borderColor: ["#000000", "#000000", "#000000", "#000000", "#000000", "#000000", "#000000"],
                    },
                  ],
                }}
                options={{
                  plugins: {
                    title: { text: "Products by Category" },
                    legend: { labels: { color: "#E0E0E0" } },
                  },
                }}
              />
            ) : (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px' }}>
                <p>No category data available</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
