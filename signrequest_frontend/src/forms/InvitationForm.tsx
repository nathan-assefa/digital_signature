import { useReducer } from "react";
import { ClockLoader } from "react-spinners";

type UserInvitationtFormProps = {
  isLoading: boolean;
  isError: boolean;
  onSubmit: (formData: { email: string }) => Promise<void>;
  initialValue?: {
    email: string;
  };
  autoFocus: boolean;
};

const InvitationForm: React.FC<UserInvitationtFormProps> = ({
  isLoading,
  isError,
  onSubmit,
  // initialValue = {
  //   email: "",
  // },
  autoFocus = false,
}) => {
  type PostState = {
    email: string;
  };

  type PostAction = { type: "setEmail"; payload: string };

  const reducer = (state: PostState, action: PostAction) => {
    switch (action.type) {
      case "setEmail":
        return { ...state, email: action.payload };
    }
  };

  const [{ email }, dispatch] = useReducer(reducer, {
    email: "",
  });

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    onSubmit({
      email,
    });
  }

  const isEmailValid = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  return (
    <div className="invitation-wrapper">
      <div className="invitation-form">
        <form onSubmit={handleSubmit}>
          <div className="invitation-form-row">
            <div className="invitation-label-input">
              <label
                className="invitation-label invitation-email"
                htmlFor="email"
              >
                Email:
              </label>
              <input
                id="email"
                className="invite-email-input invitation-input"
                autoFocus={autoFocus}
                value={email}
                onChange={(e) =>
                  dispatch({ type: "setEmail", payload: e.target.value })
                }
              />
            </div>
            {isLoading ? (
              <ClockLoader
                className="invitation-waiting"
                color="#4b9cd7"
                size={25}
              />
            ) : (
              <button
                className={`invitation-save-btn ${
                  isEmailValid(email) ? "active" : "disabled"
                }`}
                type="submit"
                disabled={!isEmailValid(email) || isLoading}
              >
                {isLoading ? "cancel" : "Invite"}
              </button>
            )}
          </div>
          <div className="error" style={{ color: "red" }}>
            {isError}
          </div>
        </form>
      </div>
    </div>
  );
};

export default InvitationForm;
