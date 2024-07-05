import { useEffect } from "react";
import LeftSideBar from "../components/LeftSideBar";
import { Link } from "react-router-dom";

const Signature = () => {
  useEffect(() => {
    // Scroll to the top of the page when the component mounts
    window.scrollTo(0, 0);
  }, []);
  return (
    <>
      <div className="signatures-wrapper">
        <div className="dashbord-wrapper">
          <LeftSideBar />
        </div>
        <div className="signatures-right-col">
          <div className="signatures-header">Signatures</div>
          <div className="signature-btn">
            <div className="signature-icon"></div>
            <Link className="link" to="/billing">
              <button className="change-signature">Change signatures</button>
            </Link>
            <p className="upgrate-template">
              To store signatures, kindly upgrade your account for expanded
              features.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Signature;
