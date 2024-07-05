import { useReducer } from "react";
import { Link } from "react-router-dom";

type UserRegistrationFormProps = {
  isLoading: boolean;
  isError: boolean;
  onSubmit: (formData: {
    first_name: string;
    last_name: string;
    username: string;
    password: string;
    confirm_password: string;
    email: string;
  }) => Promise<void>;
  autoFocus: boolean;
  destination?: string | undefined;
  team_id?: string | undefined;
  token?: string | undefined;
};

const RegistrationForm: React.FC<UserRegistrationFormProps> = ({
  isLoading,
  isError,
  onSubmit,
  autoFocus = false,
  destination,
  team_id,
  token,
}) => {
  type PostState = {
    first_name: string;
    last_name: string;
    username: string;
    password: string;
    confirm_password: string;
    email: string;
  };

  type PostAction =
    | { type: "setUsername"; payload: string }
    | { type: "setPassword"; payload: string }
    | { type: "setConfirmPassword"; payload: string }
    | { type: "setFirstName"; payload: string }
    | { type: "setLastName"; payload: string }
    | { type: "setEmail"; payload: string };

  const reducer = (state: PostState, action: PostAction) => {
    switch (action.type) {
      case "setUsername":
        return { ...state, username: action.payload };
      case "setPassword":
        return { ...state, password: action.payload };
      case "setConfirmPassword":
        return { ...state, confirm_password: action.payload };
      case "setFirstName":
        return { ...state, first_name: action.payload };
      case "setLastName":
        return { ...state, last_name: action.payload };
      case "setEmail":
        return { ...state, email: action.payload };
    }
  };

  const [
    { username, password, confirm_password, first_name, last_name, email },
    dispatch,
  ] = useReducer(reducer, {
    username: "",
    password: "",
    confirm_password: "",
    first_name: "",
    last_name: "",
    email: "",
  });

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    onSubmit({
      username,
      password,
      confirm_password,
      first_name,
      last_name,
      email,
    });
  }

  return (
    <div className="register-wrapper">
      <div className="register-form">
        <form onSubmit={handleSubmit}>
          <div className="register-form-row">
            <div>
              <label
                className="register-label register-username"
                htmlFor="username"
              >
                Username:
              </label>
              <input
                id="username"
                className="username-input reg-input"
                autoFocus={autoFocus}
                value={username}
                onChange={(e) =>
                  dispatch({ type: "setUsername", payload: e.target.value })
                }
              />
            </div>

            <div>
              <label className="register-label register-email" htmlFor="email">
                Email:
              </label>
              <input
                id="email"
                className="email-input reg-input"
                value={email}
                onChange={(e) =>
                  dispatch({ type: "setEmail", payload: e.target.value })
                }
              />
            </div>
            <div>
              <label
                className="register-label register-firstName"
                htmlFor="firstName"
              >
                First Name:
              </label>
              <input
                id="firstName"
                className="first-name-input reg-input"
                value={first_name}
                onChange={(e) =>
                  dispatch({ type: "setFirstName", payload: e.target.value })
                }
              />
            </div>
            <div>
              <label
                className="register-label register-lastName"
                htmlFor="last_name"
              >
                Last Name:
              </label>
              <input
                id="last_name"
                className="last-name-input reg-input"
                value={last_name}
                onChange={(e) =>
                  dispatch({ type: "setLastName", payload: e.target.value })
                }
              />
            </div>
            <div>
              <label
                className="register-label register-password"
                htmlFor="password"
              >
                Password:
              </label>
              <input
                type="password"
                id="password"
                className="password-input reg-input"
                value={password}
                onChange={(e) =>
                  dispatch({ type: "setPassword", payload: e.target.value })
                }
              />
            </div>
            <div>
              <label
                className="register-label register-confirm-password"
                htmlFor="confirm_password"
              >
                Confirm Password:
              </label>
              <input
                type="password"
                id="confirm_password"
                className="confirm-password-input reg-input"
                value={confirm_password}
                onChange={(e) =>
                  dispatch({
                    type: "setConfirmPassword",
                    payload: e.target.value,
                  })
                }
              />
            </div>

            <button
              className="register-submit"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? "cancel" : "Register"}
            </button>
            <Link
              className="user-login"
              to={`/login${destination ? `?destination=${destination}` : ""}${
                team_id ? `&team_id=${team_id}` : ""
              }${token ? `&token=${token}` : ""}`}
            >
              Login
            </Link>
          </div>
          <div className="error" style={{ color: "red" }}>
            {isError}
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegistrationForm;
