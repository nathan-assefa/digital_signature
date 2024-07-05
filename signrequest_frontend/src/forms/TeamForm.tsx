import { useReducer, useRef, useState, ChangeEvent } from "react";

type UserAccouontFormProps = {
  isLoading: boolean;
  isError: boolean;
  onSubmit: (formData: {
    name: string;
    website: string;
    phoneNumber: string;
    team_logo: File | null;
  }) => Promise<void>;
  initialValue: {
    team_name: string;
    website: string;
    phoneNumber: string;
    team_logo: File | null;
  };
  formMode: "create" | "update";
  imgBtnStatus?: boolean;
  autoFocus?: boolean;
};

const TeamForm: React.FC<UserAccouontFormProps> = ({
  isLoading,
  isError,
  onSubmit,
  initialValue = {
    team_name: "",
    website: "",
    phoneNumber: "",
    team_logo: null,
  },
  formMode,
  imgBtnStatus,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [team_logo, setTeamLogo] = useState<File | null>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setTeamLogo(e.target.files[0]);
    }
  };

  const handleButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    // Trigger the hidden file input
    fileInputRef.current?.click();
  };

  type PostState = {
    name: string;
    website: string;
    phoneNumber: string;
  };

  type PostAction =
    | { type: "setTeamName"; payload: string }
    | { type: "setWebsite"; payload: string }
    | { type: "setPhoneNumber"; payload: string };

  const reducer = (state: PostState, action: PostAction) => {
    switch (action.type) {
      case "setTeamName":
        return { ...state, name: action.payload };
      case "setWebsite":
        return { ...state, website: action.payload };
      case "setPhoneNumber":
        return { ...state, phoneNumber: action.payload };
    }
  };

  const [{ name, website, phoneNumber }, dispatch] = useReducer(reducer, {
    name: initialValue.team_name,
    website: initialValue.website,
    phoneNumber: initialValue.phoneNumber,
  });

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    onSubmit({
      name,
      website,
      phoneNumber,
      team_logo,
    });
  }

  return (
    <div className="team-wrapper">
      <div className="team-form">
        <form onSubmit={handleSubmit}>
          <div className="team-form-row">
            <div className="label-and-input">
              <label className="team-label team-name" htmlFor="name">
                Team name:
              </label>
              <input
                id="name"
                className="name-input team-input"
                value={name}
                onChange={(e) =>
                  dispatch({ type: "setTeamName", payload: e.target.value })
                }
              />
            </div>
            <div className="label-and-input">
              <label className="team-label team-website" htmlFor="website">
                Website:
              </label>
              <input
                id="website"
                className="website-input team-input"
                value={website}
                placeholder="Optional"
                onChange={(e) =>
                  dispatch({ type: "setWebsite", payload: e.target.value })
                }
              />
            </div>
            <div className="label-and-input">
              <label
                className="team-label team-phoneNumber"
                htmlFor="phoneNumber"
              >
                PhoneNumber:
              </label>
              <input
                id="phoneNumber"
                className="phoneNumber-input team-input"
                placeholder="Optional"
                value={phoneNumber}
                onChange={(e) =>
                  dispatch({ type: "setPhoneNumber", payload: e.target.value })
                }
              />
            </div>
            <p className="phone-num-info">
              The phone number, if not blank, will be shown to customers when
              they have questions about a document they need to sign.
            </p>
            <div className="file-input">
              {/* File input for uploading Logo */}
              {/* Hidden file input */}
              <label htmlFor="teamLogo" className="file-label team-label">
                Team Logo or Image:
              </label>
              <p className="log-description">
                Your logo will appear at the top of your team's page.
              </p>
              <input
                type="file"
                id="teamLogo"
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={handleFileChange}
              />

              {/* Custom-styled button */}
              <button
                className="add-logo select-file"
                onClick={handleButtonClick}
              >
                {team_logo
                  ? "Selected"
                  : imgBtnStatus
                  ? "Change team logo"
                  : "Insert team log"}
              </button>
            </div>

            <button
              className={`team-${formMode} team-create`}
              type="submit"
              disabled={isLoading}
            >
              {isLoading
                ? "Cancel"
                : formMode === "create"
                ? "Create"
                : "Update"}
            </button>
          </div>
          <div className="error" style={{ color: "red" }}>
            {isError}
          </div>
        </form>
      </div>
    </div>
  );
};

export default TeamForm;
