import React, { useState } from "react";
import SignatureCanvas from "react-signature-canvas";
import { updateDocumentStatus } from "../utils/sign-document";
import { useNavigate } from "react-router-dom";
import { Toaster, toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { HashLoader } from "react-spinners";
import { useAuth } from "../contexts/AuthContext";

interface SignatureId {
  signatureId: string;
}

const SignaturePad: React.FC<SignatureId> = ({ signatureId }) => {
  const [sign, setSign] = useState<SignatureCanvas | null>(null);
  const navigate = useNavigate();
  const { username } = useAuth();

  const queryClient = useQueryClient();

  const { mutate, isLoading } = useMutation(
    // Define the mutation function
    async () => {
      try {
        const signatureDataURL = sign
          ?.getTrimmedCanvas()
          .toDataURL("image/png");

        // since the user signs on the document, the is_signed
        // property become true
        const is_signed = true;

        // Send the signature image to the backend

        await updateDocumentStatus(signatureId!, is_signed, signatureDataURL);
      } catch (err) {
        toast.error("Document signing error.");
      }
    },
    {
      // Invalidate and refetch data when the mutation is successful
      onSuccess: () => {
        toast.success("Document has been signed successfully!");
        queryClient.invalidateQueries(["sign-documents"]);
        setTimeout(() => {
          navigate("/");
        }, 2800);
      },
    }
  );

  const handleGenerator = () => {
    if (!username) {
      navigate("/login");
    } else {
      mutate();
    }
  };

  const handleClear = () => {
    sign?.clear();
  };

  return (
    <div>
      <Toaster richColors />
      <div style={{ border: "2px solid black", width: 500, height: 200 }}>
        <SignatureCanvas
          canvasProps={{ width: 500, height: 200, className: "sigCanvas" }}
          ref={(data) => setSign(data)}
        />
      </div>
      {isLoading ? (
        <HashLoader className="loading-spinner" color="#36d7b7" />
      ) : (
        <div className="sign-canvas-footer">
          <button onClick={handleClear} className="handle-clear">
            Clear
          </button>
          <button onClick={handleGenerator} className="handle-generator">
            Save
          </button>
        </div>
      )}
    </div>
  );
};

export default SignaturePad;
