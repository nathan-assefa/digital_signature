import LeftSideBar from "../components/LeftSideBar";
import { useParams } from "react-router-dom";
import { useDocumentList } from "../contexts/DocumentsContext";
import TimeAgo from "../utils/timeFormat";
import { useEffect, useState } from "react";
import { BookText, Clock3 } from "lucide-react";

const SingleDocumentStatus = () => {
  const [showButton, setShowBtton] = useState(false);
  const { id: signDocumentId } = useParams();
  const { document: documents } = useDocumentList();

  const singleDocument = documents?.find((d) => d.id == signDocumentId);

  useEffect(() => {
    if (singleDocument && singleDocument.document_log_file) {
      setShowBtton(true);
    }
  }, [singleDocument]);

  const downloadOriginalDocument = () => {
    const fileName = singleDocument?.document?.name;
    const aTag = document.createElement("a");
    aTag.href = singleDocument?.document?.file!;
    aTag.setAttribute("download", fileName!);
    document.body.appendChild(aTag);
    aTag.click();
    aTag.remove();
  };
  const downloadDocumentLog = () => {
    const fileName = singleDocument?.document_log_file;
    const aTag = document.createElement("a");
    aTag.href = singleDocument?.document_log_file!;
    aTag.setAttribute("download", fileName!);
    document.body.appendChild(aTag);
    aTag.click();
    aTag.remove();
  };

  return (
    <>
      <div className="single-document-wrapper">
        <div className="dashbord-wrapper">
          <LeftSideBar />
        </div>
        <div className="single-document-right-col">
          <div className="single-document-header">
            <span className="docs">Documents / </span>
            <span className="doc-name"> {singleDocument?.document?.name}</span>
          </div>
          <div className="single-doc-detail">
            <BookText className="document-detail-icon" />
            <div className="doc-detail">
              <p className="doc-name">{singleDocument?.document?.name}</p>
              <p className="signed-date">
                {singleDocument?.date_requested && (
                  <TimeAgo date={new Date(singleDocument.date_requested)} />
                )}
              </p>
              <p className="document-id">
                Document id: {singleDocument?.document.id}
              </p>
              <div className="doc-status">
                <Clock3 className="doc-st-icon" />
                <p className="is-signed">
                  {singleDocument?.is_signed ? "Signed" : "Unsigned"}
                </p>
              </div>
            </div>
          </div>
          <div className="single-document-btn">
            {/* <div className="single-document-icon"></div> */}
            <div className="download-documents">
              <button
                onClick={() => downloadOriginalDocument()}
                className="download-document doc-btn"
              >
                Download document
              </button>
              {showButton && (
                <button
                  onClick={() => downloadDocumentLog()}
                  className="download-signing-log doc-btn"
                >
                  Download signing log
                </button>
              )}
            </div>
          </div>
          <div className="recipient-info">
            <p className="recipient">Recipient</p>
            <div className="doc-sender">
              <p className="sender-email">
                {singleDocument?.document?.owner?.email}
              </p>
              <p className="doc-stat">Viewed</p>
            </div>
            <div className="doc-recivier">
              <p className="recivier-email">
                {singleDocument?.recipient?.email}
              </p>
              <div className="recipient-activity">
                <div className="doc-sign-date">
                  {singleDocument?.date_requested && (
                    <TimeAgo date={new Date(singleDocument.date_requested)} />
                  )}
                </div>
                <p className="recivier-signed">
                  {singleDocument?.is_signed ? "Signed" : "Unsigned"}
                </p>
              </div>
            </div>
          </div>
          <div className="sender-message">
            <p className="email-info">Email</p>
            <p className="sender-msg">Message</p>
            <div className="msg-detail">
              <p>{singleDocument?.document?.message.replace(/"/g, "")}</p>
              <p>Kind regards</p>
              <p>
                {singleDocument?.document?.owner?.first_name}{" "}
                {singleDocument?.document?.owner?.last_name}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SingleDocumentStatus;
