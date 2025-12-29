const Logo = () => {
  return (
    <div className="logo-wrapper">
      <svg
        width="34"
        height="34"
        viewBox="0 0 24 24"
        fill="none"
      >
        <rect x="3" y="3" width="7" height="7" rx="1" fill="white" />
        <rect x="14" y="3" width="7" height="7" rx="1" fill="white" />
        <rect x="3" y="14" width="7" height="7" rx="1" fill="white" />
        <rect x="14" y="14" width="7" height="7" rx="1" fill="white" />
      </svg>

      <span className="logo-text">Inventra</span>
    </div>
  );
};

export default Logo;
