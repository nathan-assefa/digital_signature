import { Link } from "react-router-dom";

interface ModelData {
  onClose: () => void;
}

const PopUpForDocumentSigning: React.FC<ModelData> = ({ onClose }) => {
  return (
    <Link to="/" onClick={onClose} className="link">
      <div onClick={onClose} className="popup-container">
        <div className="popup-add-button">
          <button className="popup-add-file">Add files to sign</button>
        </div>

        <div className="popupleft-col-footer">
          <button className="popup-btn popup-help-btn">Help</button>
          <button className="popup-btn popup-sign-btn">Sign</button>
          <button className="popup-btn popup-setting-btn">Setting</button>
        </div>
      </div>
    </Link>
  );
};

export default PopUpForDocumentSigning;
