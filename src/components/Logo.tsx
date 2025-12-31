import logo from "../assets/abc-logo.png";
import "../styles/Logo.css";

const Logo = () => {
  return (
    <div className="logo-container">
      <img src={logo} alt="ABC Logo" className="logo-image" />
      <span className="logo-text">ABC (Pvt) Ltd</span>
    </div>
  );
};

export default Logo;
