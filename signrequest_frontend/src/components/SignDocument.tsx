import React, { useState, ChangeEvent, useRef } from "react";
import AuthToken from "../utils/AuthToken";
import { MessageCircleQuestion, UserX } from "lucide-react";
import { Toaster, toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PacmanLoader } from "react-spinners";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

/*
************ why useMutation and useQueryClient ***************
- useMutation:  The useMutation hook in React Query is primarily 
                designed to handle asynchronous mutations, including
                HTTP POST requests or any other side effects that involve
                sending data to a server and receiving a response.

- useQueryClient: The useQueryClient hook in React Query provides access
                  to the query client instance. The query client is a central
                  piece of React Query that manages the state and cache for
                  your queries. It allows you to interact with the query cache,
                  invalidate queries, refetch data, and more.
*/

interface EmailFormProps {
  url: string;
}

const EmailForm: React.FC<EmailFormProps> = ({ url }) => {
  const [emails, setEmails] = useState<string[]>([]);
  const [files, setFiles] = useState<FileList | null>(null);
  const [showHelp, setShowHelp] = useState(false);
  const [showHelpContact, setShowHelpContact] = useState(false);
  const [showHelpMessage, setShowHelpMessage] = useState(false);
  const queryClient = useQueryClient();

  const { username } = useAuth();
  const navigate = useNavigate();

  const accessToken = AuthToken();

  const [message, setMessage] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleEmailChange = (index: number, value: string) => {
    const newEmails = [...emails];
    newEmails[index] = value;
    setEmails(newEmails);
  };

  const handleAddEmail = () => {
    setEmails([...emails, ""]);
  };

  const handleRemoveEmail = (index: number) => {
    const newEmails = [...emails];
    newEmails.splice(index, 1);
    setEmails(newEmails);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(e.target.files);
    }
  };

  const handleButtonClick = () => {
    // Trigger the hidden file input
    fileInputRef.current?.click();
  };

  /*
  - mutate: Function provided by React Query for triggering the mutation.
  - isLoading: Boolean indicating whether the mutation is in progress.
  */
  const { mutate, isLoading } = useMutation(
    // Define the mutation function
    async () => {
      try {
        const formData = new FormData();
        formData.append("recipient_emails", JSON.stringify(emails));
        formData.append("message", JSON.stringify(message));

        if (files) {
          for (let i = 0; i < files.length; i++) {
            formData.append("files", files[i]);
          }
        }

        const response = await fetch(url, {
          method: "POST",
          headers: {
            Authorization: "Bearer " + String(accessToken),
          },
          body: formData,
        });

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        console.log(data);
        return data;
      } catch (error: any) {
        toast.error("Error Uploading Document");
        console.error("Error:", error.message);
        setFiles(null);
        setEmails([""]);
        setMessage("");
        throw error; // Rethrow the error to let React Query handle it
      }
    },
    {
      // Invalidate and refetch data when the mutation is successful
      onSuccess: () => {
        toast.success("Document has been sent");
        queryClient.invalidateQueries(["sign-documents"]);
        setFiles(null);
        setEmails([""]);
        setMessage("");
      },
    }
  );

  const handleSendRequest = () => {
    if (!username) {
      // If not authenticated, redirect to the login page
      navigate("/login");
      return;
    }
    mutate();
  };

  return (
    <div className="document-sign-wrapper">
      <Toaster richColors />

      <div className="signing-related-inputes">
        <div className="files-input">
          {/* File input for uploading files */}
          {/* Hidden file input */}
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleFileChange}
            multiple
          />

          {/* Custom-styled button */}
          <button className="add-file select-file" onClick={handleButtonClick}>
            {files ? `Selected: ${files.length} files` : "Add files to sign"}
          </button>
        </div>

        <div className="emailes-input-btn">
          <div className="email-input-btn">
            {emails.map((email, index) => (
              <div key={index} className="email-input-wrapper">
                <label>
                  <input
                    type="email"
                    value={email}
                    className="email-input"
                    placeholder="Write recipient's email"
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      handleEmailChange(index, e.target.value)
                    }
                  />
                </label>
                <button onClick={() => handleRemoveEmail(index)}>
                  <UserX className="user-x" />
                </button>
              </div>
            ))}
          </div>
          <div className="add-contact">
            <div onClick={handleAddEmail} className="add-con-btn">
              <span className="plus-sign">+</span> Add contact
            </div>
            {showHelp && (
              <MessageCircleQuestion
                onMouseOver={() => setShowHelpContact(true)}
                onMouseOut={() => setShowHelpContact(false)}
                onTouchStart={() => setShowHelpContact(true)}
                onTouchEnd={() => setShowHelpContact(false)}
                className="help-add-contact"
              />
            )}
            {showHelpContact && (
              <p className="help-add-cont-desc help-decription">
                Add the email address of each person that needs to sign or
                recieve a copy of the document
              </p>
            )}
          </div>
        </div>

        <div className="sender-message">
          {/* Message input */}
          <textarea
            className="message-input"
            placeholder="Message"
            value={message}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
              setMessage(e.target.value)
            }
          />
          {showHelp && (
            <MessageCircleQuestion
              onMouseOver={() => setShowHelpMessage(true)}
              onMouseOut={() => setShowHelpMessage(false)}
              onTouchStart={() => setShowHelpMessage(true)}
              onTouchEnd={() => setShowHelpMessage(false)}
              className="help-message"
            />
          )}
          {showHelpMessage && (
            <p className=" help-msg-desc help-decription">
              Optionally add message to include in the email to your contacts
            </p>
          )}
        </div>

        <div className="left-col-footer">
          <button
            onClick={() => setShowHelp((prev) => !prev)}
            className="btn help-btn"
          >
            Help
          </button>

          {isLoading ? (
            <PacmanLoader color="#36d7b7" />
          ) : (
            <button
              onClick={() => {
                handleSendRequest();
              }}
              disabled={
                !(
                  files &&
                  emails.every((email) => email.trim() !== "") &&
                  message.trim() !== ""
                )
              }
              className={`btn ${
                !(
                  files &&
                  emails.every((email) => email.trim() !== "") &&
                  message.trim() !== ""
                )
                  ? "disabled-btn"
                  : "active-btn"
              }`}
            >
              Sign
            </button>
          )}
          <button className="btn setting-btn">Setting</button>
        </div>
      </div>
    </div>
  );
};

export default EmailForm;
