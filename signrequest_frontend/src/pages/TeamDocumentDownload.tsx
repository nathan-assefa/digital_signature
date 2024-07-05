import { useParams } from "react-router-dom";
// import { useTeamDocumentList } from "../contexts/TeamDocumentsContext";
import TimeAgo from "../utils/timeFormat";
import { useEffect, useState } from "react";
import { BookText, Clock3 } from "lucide-react";
import { getTeamDocument } from "../utils/team-documents";
import { useQuery } from "@tanstack/react-query";
import { TeamDocumentSigning } from "../utils/types";

const TeamDocumentDownloadLogFiles = () => {
  const [showButton, setShowBtton] = useState(false);
  const { sign_id: signDocumentId } = useParams();
  // const { document: documents } = useTeamDocumentList();

  const { data: singleDocument } = useQuery<TeamDocumentSigning>(
    ["sign-document"],
    () => getTeamDocument(signDocumentId!),
    {
      initialData: undefined,
    }
  );

  // const singleDocument = documents?.find((d) => d.id == signDocumentId);

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
      <div className="download-document-wrapper">
        <div className="download-document-right-col">
          <div className="download-document-header">
            <span className="docs">Documents / </span>
            <span className="doc-name"> {singleDocument?.document?.name}</span>
          </div>
          <div className="download-doc-detail">
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
          <div className="download-document-btn">
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
                {singleDocument && singleDocument.document.team.name}
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
              <p>{singleDocument?.document?.team.name}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TeamDocumentDownloadLogFiles;
