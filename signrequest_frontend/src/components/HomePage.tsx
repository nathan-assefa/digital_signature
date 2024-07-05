import { Heart, Pipette, SearchCheck } from "lucide-react";
import SignDocument from "./SignDocument";
import { useEffect } from "react";
import { Link } from "react-router-dom";

const HomePage = () => {
  useEffect(() => {
    // Scroll to the top of the page when the component mounts
    window.scrollTo(0, 0);
  }, []);
  const SERVER_URL = import.meta.env.VITE_SERVER_URL;
  const url = `${SERVER_URL}/send-signing-request/`;
  return (
    <div className="homepage-wrapper">
      <div className="homepage">
        <div className="home-left-col">
          <SignDocument url={url} />
        </div>
        <div className="home-right-col">
          <div>
            <h1>Boost efficiency with reliable e-signing</h1>
            <p className="subhead">
              Empower your documents with secure e-signatures effortlessly.
            </p>
            <div className="landing-pic"></div>
          </div>
        </div>
      </div>
      <div className="land-middle">
        <div className="middle-left">
          <Pipette className="pipette" />
          <p className="sign-anywhere">Sign anywhere</p>
        </div>
        <div className="middle-right">
          <SearchCheck className="sing-check" />
          <p className="fast-secure">Fast, secure and legally binding</p>
        </div>
      </div>

      <div className="features">
        <p className="e-sign">E-signature</p>
        <p className="e-sign-dicription">
          An all-encompassing and budget-friendly solution for signatures.
        </p>
        <div className="two-features">
          <div className="first-feature">
            <SearchCheck className="srch-check" />
            <p className="fully-secured fc">Fully secured</p>
            <p className="feature-described first-f-d">
              All documents and signatures are 256 bit AES encrypted and we are
              ISO 27001 certified.
            </p>
          </div>
          <div className="second-feature">
            <Heart className="heart" />
            <p className="easy-to-use fc">Easy to use</p>
            <p className="feature-described">
              Automatically manage and store all electronically signed documents
              in one place.
            </p>
          </div>
          <div className="second-feature"></div>
        </div>
      </div>
      <section className="features-section">
        <div className="container">
          <ul className="features-list">
            <li>Easy Signature Creation</li>
            <li>Document Integration</li>
            <li>Multi-Platform Support</li>
            <li>Secure Authentication</li>
            <li>Time-Stamped Signatures</li>
            <li>Seamless Collaboration</li>
          </ul>

          <div className="signing-picuture"></div>
        </div>
      </section>
      <div className="bill-plan">
        <p className="b-p">We have a plan for you</p>
        <p className="b-p-decription">
          For personal use or a heavy signing load. Highly customized and
          integrated or quick and easy. SignRequest has a suitable plan.
        </p>
        <div className="two-plans">
          <div className="professional">
            <p className="pro">Professional</p>
            <p className="b-price">$9</p>
            <p className="per-mon">per month / 1 user</p>
            <p className="unlimited">Unlimited documents</p>
            <Link to="/billing" className="link">
              <button className="learn-more">Learn more</button>
            </Link>
          </div>
          <div className="business">
            <p className="pro">Business</p>
            <p className="b-price">$15</p>
            <p className="per-mon">per month / 1 user</p>
            <p className="unlimited">Unlimited documents</p>
            <Link to="/billing" className="link">
              <button className="learn-more">Learn more</button>
            </Link>
          </div>
        </div>
      </div>
      <section className="testimonials-section">
        <div className="container">
          <ul>
            <li>
              <div className="testimony-picture"></div>

              <blockquote>
                "SignRequest transformed the way I handle documents. It's
                intuitive, secure, and streamlined, making business transactions
                effortlessly efficient. Highly recommend!"
              </blockquote>
              <cite>- Nathan Assefa</cite>
            </li>
          </ul>
          <div className="testimony-right"></div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
