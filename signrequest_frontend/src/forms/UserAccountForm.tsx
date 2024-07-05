import { useReducer } from "react";

type UserAccouontFormProps = {
  isLoading: boolean;
  isError: boolean;
  onSubmit: (formData: {
    first_name: string;
    last_name: string;
    email: string;
  }) => Promise<void>;
  initialValue: {
    first_name: string;
    last_name: string;
    email: string;
  };
  autoFocus: boolean;
};

const UserAccount: React.FC<UserAccouontFormProps> = ({
  isLoading,
  isError,
  onSubmit,
  initialValue = {
    first_name: "",
    last_name: "",
    email: "",
  },
  autoFocus = false,
}) => {
  type PostState = {
    first_name: string;
    last_name: string;
    email: string;
  };

  type PostAction =
    | { type: "setFirstName"; payload: string }
    | { type: "setLastName"; payload: string }
    | { type: "setEmail"; payload: string };

  const reducer = (state: PostState, action: PostAction) => {
    switch (action.type) {
      case "setFirstName":
        return { ...state, first_name: action.payload };
      case "setLastName":
        return { ...state, last_name: action.payload };
      case "setEmail":
        return { ...state, email: action.payload };
    }
  };

  const [{ first_name, last_name, email }, dispatch] = useReducer(reducer, {
    first_name: initialValue.first_name,
    last_name: initialValue.last_name,
    email: initialValue.email,
  });

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    onSubmit({
      first_name,
      last_name,
      email,
    });
  }

  return (
    <div className="account-wrapper">
      <div className="account-form">
        <form onSubmit={handleSubmit}>
          <div className="account-form-row">
            <div>
              <label className="account-label account-email" htmlFor="email">
                Email:
              </label>
              <input
                id="email"
                className="email-input account-input"
                autoFocus={autoFocus}
                value={email}
                onChange={(e) =>
                  dispatch({ type: "setEmail", payload: e.target.value })
                }
              />
            </div>
            <div>
              <label
                className="account-label account-firstName"
                htmlFor="firstName"
              >
                First Name:
              </label>
              <input
                id="firstName"
                className="first-name-input account-input"
                // autoFocus={autoFocus}
                value={first_name}
                onChange={(e) =>
                  dispatch({ type: "setFirstName", payload: e.target.value })
                }
              />
            </div>
            <div>
              <label
                className="account-label account-lastName"
                htmlFor="last_name"
              >
                Last Name:
              </label>
              <input
                id="last_name"
                className="last-name-input account-input"
                // autoFocus={autoFocus}
                value={last_name}
                onChange={(e) =>
                  dispatch({ type: "setLastName", payload: e.target.value })
                }
              />
            </div>
            <button className="account-save" type="submit" disabled={isLoading}>
              {isLoading ? "cancel" : "Save"}
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

export default UserAccount;
