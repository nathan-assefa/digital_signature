import { useEffect } from "react";
import LeftSideBar from "../components/LeftSideBar";
import { Link } from "react-router-dom";
// import Template from "../assets/templates";

const Templates = () => {
  useEffect(() => {
    // Scroll to the top of the page when the component mounts
    window.scrollTo(0, 0);
  }, []);
  return (
    <>
      <div className="templates-wrapper">
        <div className="dashbord-wrapper">
          <LeftSideBar />
        </div>
        <div className="templates-right-col">
          <div className="templates-header">Templates</div>
          <Link to="/billing" className="link">
            <div className="template-btn">
              <div className="template-icon"></div>
              {/* <Template /> */}
              <button className="create-template">Create template</button>
            </div>
          </Link>
          <p className="upgrate-template">
            To send SignRequests in bulk upgrade to the Business Plan
          </p>
        </div>
      </div>
    </>
  );
};

export default Templates;
