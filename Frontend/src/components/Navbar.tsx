export function Navbar() {
  return (
    <header className="topbar">
      <div className="brand-wrap">
        <div className="brand-mark">C</div>
        <span>Consent Drift</span>
      </div>

      <nav className="main-nav" aria-label="Main navigation">
        <a href="#">Overview</a>
        <a href="#">Permissions</a>
        <a href="#">Risk</a>
        <a href="#">Settings</a>
      </nav>

      <div className="nav-actions">
        <button className="btn btn-ghost">Log in</button>
        <button className="btn btn-primary">New scan</button>
      </div>
    </header>
  );
}
