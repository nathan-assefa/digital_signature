import LeftSideBar from "../components/LeftSideBar";
import { useDocumentList } from "../contexts/DocumentsContext";
import Magnifier from "../assets/Magnifier";
import Modal from "../components/Modal";
import { useEffect, useState } from "react";
import PopUpToSignDocument from "../components/PopUpToSignDocument";
import DocumentList from "../components/DocumentList";

const Docuement = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { search, setSearch, document } = useDocumentList();
  useEffect(() => {
    // Scroll to the top of the page when the component mounts
    window.scrollTo(0, 0);
  }, []);
  return (
    <>
      <div className="document-wrapper">
        <div className="dashbord-wrapper">
          <LeftSideBar />
        </div>
        <div className="documents-right-col">
          <div className="documents-header">documents</div>
          <div className="document-btn">
            <div className="document-icon"></div>
            <button onClick={() => setIsOpen(true)} className="create-document">
              Add document to sign
            </button>
          </div>
          <div className="document-search-input">
            <div className="search-input">
              <div className="magnifier">
                <Magnifier />
              </div>
              <input
                className="search"
                placeholder="Search Documents by file name"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
          <div className="document-storage-description">
            <p className="description">
              Document storage is part of our paid plans. SignRequest
              automatically deletes finished documents. Upgrade now for the full
              SignRequest experience.
            </p>
          </div>
          <DocumentList document={document} doc_status_url="document-status" />
        </div>
        <div className="pop-up">
          <Modal open={isOpen} onClose={() => setIsOpen(false)}>
            <PopUpToSignDocument onClose={() => setIsOpen(false)} />
          </Modal>
        </div>
      </div>
    </>
  );
};

export default Docuement;
