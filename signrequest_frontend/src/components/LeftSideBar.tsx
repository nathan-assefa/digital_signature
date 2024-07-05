import {
  Home,
  CircleUser,
  FileStack,
  BookDashed,
  Receipt,
  Users,
  User,
  LogOut,
} from "lucide-react";
import Avator from "../assets/avator";
import Signature from "../assets/signature";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const RightSideBar = () => {
  const { username } = useAuth();
  return (
    <div className="side-bar-container">
      <div className="two-col-wrapper">
        <div className="left-col">
          <div>
            <Link to="/" className="link">
              <div className="icon-wrapper">
                <div className="sigle-row-left">
                  <Home className="side-bar-icon side-bar-home-icon" />
                </div>
              </div>
            </Link>
            <Link to="/account">
              <div className="icon-wrapper">
                <div className="sigle-row-left">
                  <CircleUser className=" side-bar-icon side-bar-account-icon" />
                </div>
              </div>
            </Link>
            <Link to="/documents" className="link">
              <div className="icon-wrapper">
                <div className="sigle-row-left ">
                  <FileStack className="side-bar-icon side-bar-document-icon" />
                </div>
              </div>
            </Link>
            <Link to="/signature" className="link">
              <div className="icon-wrapper">
                <div className="sigle-row-left">
                  <Signature />
                </div>
              </div>
            </Link>
            <Link to="/templates" className="link">
              <div className="icon-wrapper">
                <div className="sigle-row-left">
                  <BookDashed className="side-bar-icon side-bar-template-icon" />
                </div>
              </div>
            </Link>
            <Link to="/billing" className="link">
              <div className="icon-wrapper">
                <div className="sigle-row-left">
                  <Receipt className="side-bar-icon side-bar-billing-icon" />
                </div>
              </div>
            </Link>
            <Link to="/create-teams" className="link">
              <div className="icon-wrapper">
                <div className="sigle-row-left">
                  <Users className="side-bar-icon side-bar-team-icon" />
                </div>
              </div>
            </Link>
            <Link to="/users" className="link">
              <div className="icon-wrapper">
                <div className="sigle-row-left ">
                  <User className="side-bar-icon side-bar-user-icon" />
                </div>
              </div>
            </Link>
            <Link to="/login" className="link">
              <div className="icon-wrapper">
                <div className="sigle-row-left n">
                  <LogOut className="side-bar-icon side-bar-logout-ico" />
                </div>
              </div>
            </Link>
          </div>
        </div>

        <div className="right-col">
          <div className="avator">
            <Avator />
            <p>
              <span>{username}</span> (current) personal
            </p>
          </div>
          <div className="menu">
            <Link to="/" className="link">
              <div className="single-row-right">Home</div>
            </Link>
            <Link to="/account" className="link">
              <div className="single-row-right">Account</div>
            </Link>
            <Link to="/documents" className="link">
              <div className="single-row-right">Documents</div>
            </Link>
            <Link to="/signature" className="link">
              <div className="single-row-right">E-signature</div>
            </Link>
            <Link to="/templates" className="link">
              <div className="single-row-right">Templates</div>
            </Link>
            <Link to="/billing" className="link">
              <div className="single-row-right">Billing</div>
            </Link>
            <Link to="/create-teams" className="link">
              <div className="single-row-right">Teams</div>
            </Link>
            <Link to={`/team/users/${0}`} className="link">
              <div className="single-row-right">User</div>
            </Link>
            <Link to="/login" className="link">
              <div className="single-row-right">Logout</div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RightSideBar;
