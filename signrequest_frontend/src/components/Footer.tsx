import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <div className="footer">
      <footer>
        <div className="footer-container">
          <div className="footer-wrapper">
            <div className="footer-menu">
              <div className="foot-left-col">
                <Link to="/" className="link">
                  <div className="single-footer-menu">Home</div>
                </Link>
                <Link to="/account" className="link">
                  <div className="single-footer-menu">Account</div>
                </Link>
                <Link to="/documents" className="link">
                  <div className="single-footer-menu">Documents</div>
                </Link>
                <Link to="/signature" className="link">
                  <div className="single-footer-menu">E-signature</div>
                </Link>
                <Link to="/templates" className="link">
                  <div className="single-footer-menu">Templates</div>
                </Link>
              </div>
              <div className="foot-right-col">
                <Link to="/billing" className="link">
                  <div className="single-footer-menu">Billing</div>
                </Link>
                <Link to="/create-teams" className="link">
                  <div className="single-footer-menu">Teams</div>
                </Link>
                <Link to={`/team/users/${0}`} className="link">
                  <div className="single-footer-menu">User</div>
                </Link>
                <div className="single-footer-menu">Logout</div>
              </div>
              <div className="signing-picuture"></div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
