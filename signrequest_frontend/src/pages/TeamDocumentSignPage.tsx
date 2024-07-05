import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { getTeamDocumentToSign } from "../utils/sign-team-documents";
import { TeamDocumentSigning } from "../utils/types";
import { Document, Page } from "react-pdf";
import { useState } from "react";
import TeamSignatureCanvas from "../components/TeamSignatureCanvas";

const TeamDocumentSignPage = () => {
  const [displaySignCanvas, setDesiplaySignCanvas] = useState(false);

  const { sign_id: signDocumentId } = useParams();
  console.log(signDocumentId);
  const { data: document } = useQuery<TeamDocumentSigning>(
    ["Team-sign-document"],
    () => getTeamDocumentToSign(signDocumentId!),
    {
      initialData: undefined,
    }
  );

  const pdfUrl = document?.document?.file;
  return (
    <div
      onClick={() => setDesiplaySignCanvas(true)}
      className="sign-document-wrapper"
    >
      <div className="sign-document">
        <Document file={pdfUrl}>
          <Page
            pageNumber={1}
            renderTextLayer={false}
            renderAnnotationLayer={false}
          />
        </Document>
      </div>
      <div className="signature-canvas pop-up">
        {displaySignCanvas && (
          <TeamSignatureCanvas signatureId={signDocumentId || ""} />
        )}
      </div>
    </div>
  );
};

export default TeamDocumentSignPage;
