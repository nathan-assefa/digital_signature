import React, { useState } from "react";
import { SigningDocument, TeamDocumentSigning } from "../utils/types";
import TimeAgo from "../utils/timeFormat";
import { Link } from "react-router-dom";
import { Files, Clock3 } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { removeSelectedDocuments } from "../utils/documents";

interface DocumentType {
  document: (SigningDocument | TeamDocumentSigning)[];
  doc_status_url: string;
}

const DocumentList: React.FC<DocumentType> = ({ document, doc_status_url }) => {
  // State to keep track of selected document IDs
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([]);

  // State to keep track of the "Select All" checkbox
  const [selectAll, setSelectAll] = useState<boolean>(false);

  const queryClient = useQueryClient();

  const removeDocumentsMutation = useMutation(
    async (signed_ids: string[]) => {
      try {
        const response = await removeSelectedDocuments(signed_ids);
        console.log(response);
      } catch (err) {
        console.log(err);
        throw err;
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["sign-documents"]);
        setSelectedDocuments([]);
        setSelectAll(false);
      },
    }
  );

  // Function to toggle individual document selection
  const toggleDocumentSelection = (documentId: string) => {
    console.log(documentId);
    setSelectedDocuments((prevSelected) => {
      if (prevSelected.includes(documentId)) {
        // Document is already selected, remove it
        return prevSelected.filter((id) => id !== documentId);
      } else {
        // Document is not selected, add it
        return [...prevSelected, documentId];
      }
    });
    setSelectAll(false);
  };

  // Function to toggle "Select All" checkbox
  const toggleSelectAll = () => {
    setSelectAll((prevSelectAll) => !prevSelectAll);
    if (!selectAll) {
      // If "Select All" was unchecked, set the selected documents to all document IDs
      const allDocumentIds = document.map((d) => String(d.id));
      setSelectedDocuments(allDocumentIds);
    } else {
      /*
    This line clears the selectedDocuments array. When the "Select All"
    checkbox is clicked, it means the user intends to either select or
    deselect all documents. Therefore, we clear the selectedDocuments
    array to start fresh.
    */
      setSelectedDocuments([]);
    }
  };

  const handleDeleteSelected = () => {
    removeDocumentsMutation.mutate(selectedDocuments);
  };

  return (
    <div>
      <div className="delete-selected-documents">
        <button onClick={handleDeleteSelected} className="delete-selected">
          Delete selected
        </button>
        <div className="check-all-box">
          <label>
            <input
              type="checkbox"
              checked={selectAll}
              onChange={toggleSelectAll}
            />
            Select all
          </label>
        </div>
      </div>
      <div className="document-container">
        {document.map((d) => (
          <div key={d.id} className="document-list-item">
            <div className="check-single-box">
              <input
                type="checkbox"
                checked={selectAll || selectedDocuments.includes(String(d.id))}
                onChange={() => toggleDocumentSelection(String(d.id))}
              />
            </div>
            <Link to={`/${doc_status_url}/${d.id}`} className="documents link">
              <div className="documents-list">
                <div className="div-file-check">
                  <Files className="file-check" />
                </div>
                <div className="document-name-status">
                  <p className="document-name">{d?.document?.name}</p>
                  <div className="doc-status">
                    <Clock3 className="doc-st-icon" />
                    <p className="document-status">
                      {d?.is_signed ? "signed" : "unsigned"}
                    </p>
                  </div>
                </div>
              </div>
              <div className="recipient-info">
                <div className="user-email-date">
                  <p className="user-email">{d?.recipient.email}</p>
                  <p className="inviting-date">
                    {<TimeAgo date={new Date(d?.date_requested)} />}
                  </p>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DocumentList;
