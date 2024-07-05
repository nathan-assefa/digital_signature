import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { getDocumentToSign } from "../utils/sign-document";
import { SigningDocument } from "../utils/types";
import { Document, Page } from "react-pdf";
import { useState } from "react";
import SignatureCanvas from "../components/SignatureCanvas";
import { useAuth } from "../contexts/AuthContext";

const DocumentSignPage = () => {
  const [displaySignCanvas, setDesiplaySignCanvas] = useState(false);

  const { id: signDocumentId } = useParams();
  const { username } = useAuth();
  const { data: document } = useQuery<SigningDocument>(
    ["signDocument"],
    () => getDocumentToSign(signDocumentId!),
    {
      initialData: undefined,
    }
  );

  const pdfUrl = document?.document?.file;
  console.log(pdfUrl);
  return (
    <div className="document-sign-page">
      <p className="click-on-canvas">
        Click on the PDF; the signing canvas will appear for completion.
      </p>
      {!username && (
        <p className="user-suggestioin">
          Authenticate your account. Log in, revisit the email link to proceed
          with signing.
        </p>
      )}
      <div
        onClick={() => setDesiplaySignCanvas(true)}
        className="sign-document-wrapper"
      >
        <div className="sign-pdf-document sign-document">
          <Document file={pdfUrl}>
            <Page
              pageNumber={1}
              renderTextLayer={false}
              renderAnnotationLayer={false}
              className="signing-pdf-doc"
            />
          </Document>
        </div>
        <div className="signature-canvas pop-up">
          {displaySignCanvas && (
            <SignatureCanvas signatureId={signDocumentId || ""} />
          )}
        </div>
      </div>
    </div>
  );
};

export default DocumentSignPage;
