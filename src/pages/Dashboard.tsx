import Navigation from "../components/Navigation";
import "../styles/Dashboard.css";

const Dashboard = () => {
  return (
    <div className="page-with-nav">
      <Navigation />
      <div className="page-content">
        <div className="page-header">
          <h1>Dashboard</h1>
          <p className="subtitle">Overview and analytics coming soon</p>
        </div>

        <div className="content-wrapper">
          <div
            className="no-data"
            style={{ textAlign: "center", padding: "40px" }}
          >
            <p>This dashboard page is blank.</p>
            <p>We will add widgets and KPIs here.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
