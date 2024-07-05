import classNames from "classnames";
import { XCircle } from "lucide-react";

interface ModelData {
  open: boolean;
  children: React.ReactNode;
  onClose: () => void;
  className?: string;
}

const OVERLAY_STLES: React.CSSProperties = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: "rgba(0, 0, 0, .7)",
  zIndex: 1000,
};

const Modal: React.FC<ModelData> = ({ open, children, onClose, className }) => {
  if (!open) return null;

  const modalClassName = classNames("user-modal", className);

  return (
    <>
      <div style={OVERLAY_STLES}></div>
      <div className={modalClassName}>
        <button className="follow-button modal-btn" onClick={onClose}>
          <XCircle />
        </button>
        {children}
      </div>
    </>
  );
};
export default Modal;
