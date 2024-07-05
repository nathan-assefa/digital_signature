import { useReducer } from "react";

type UserBillingFormProps = {
  isLoading: boolean;
  isError: boolean;
  onSubmit: (formData: {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    email: string;
    companyName?: string;
    vatNumber?: string;
    address?: string;
    postalCode?: string | number;
    city?: string;
    country?: string;
  }) => Promise<void>;
  autoFocus?: boolean;
};

const BillingForm: React.FC<UserBillingFormProps> = ({
  // isLoading,
  isError,
  onSubmit,
  autoFocus,
}) => {
  type BillState = {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    email: string;
    companyName?: string;
    vatNumber?: string;
    address?: string;
    postalCode?: string | number;
    city?: string;
    country?: string;
  };

  type BillAction =
    | { type: "setFirstName"; payload: string }
    | { type: "setLastName"; payload: string }
    | { type: "setPhoneNumber"; payload: string }
    | { type: "setEmail"; payload: string }
    | { type: "setCompanyName"; payload: string }
    | { type: "setVatNumber"; payload: string }
    | { type: "setAddress"; payload: string }
    | { type: "setPostalCode"; payload: string | number }
    | { type: "setCity"; payload: string }
    | { type: "setCountry"; payload: string };

  const reducer = (state: BillState, action: BillAction) => {
    switch (action.type) {
      case "setFirstName":
        return { ...state, firstName: action.payload };
      case "setLastName":
        return { ...state, lastName: action.payload };
      case "setPhoneNumber":
        return { ...state, phoneNumber: action.payload };
      case "setEmail":
        return { ...state, email: action.payload };
      case "setCompanyName":
        return { ...state, companyName: action.payload };
      case "setVatNumber":
        return { ...state, vatNumber: action.payload };
      case "setAddress":
        return { ...state, address: action.payload };
      case "setPostalCode":
        return { ...state, postalCode: action.payload };
      case "setCity":
        return { ...state, city: action.payload };
      case "setCountry":
        return { ...state, country: action.payload };
    }
  };

  const [
    {
      firstName,
      lastName,
      phoneNumber,
      email,
      companyName,
      vatNumber,
      address,
      postalCode,
      city,
      country,
    },
    dispatch,
  ] = useReducer(reducer, {
    firstName: "",
    lastName: "",
    phoneNumber: "",
    email: "",
    companyName: "",
    vatNumber: "",
    address: "",
    postalCode: "",
    city: "",
    country: "",
  });

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    onSubmit({
      firstName,
      lastName,
      phoneNumber,
      email,
      companyName,
      vatNumber,
      address,
      postalCode,
      city,
      country,
    });
  }

  return (
    <div className="bill-form-wrapper">
      <div className="bill-form">
        <form onSubmit={handleSubmit}>
          <div className="bill-form-row">
            <div className="firt-and-last-name">
              <div className="label-input">
                <label
                  className="bill-label bill-firstName"
                  htmlFor="firstName"
                >
                  First Name
                </label>
                <input
                  id="firstName"
                  className="first-name-input bill-input"
                  autoFocus={autoFocus}
                  value={firstName}
                  onChange={(e) =>
                    dispatch({ type: "setFirstName", payload: e.target.value })
                  }
                />
              </div>
              <div className="label-input">
                <label className="bill-label bill-lastName" htmlFor="last_name">
                  Last Name
                </label>
                <input
                  id="last_name"
                  className="last-name-input bill-input"
                  // autoFocus={autoFocus}
                  value={lastName}
                  onChange={(e) =>
                    dispatch({ type: "setLastName", payload: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="label-input">
              <label
                className="bill-label bill-phoneNumber"
                htmlFor="phoneNumber"
              >
                Phone Number
              </label>
              <input
                id="phoneNumber"
                className="phoneNumber-input bill-input"
                value={phoneNumber}
                onChange={(e) =>
                  dispatch({ type: "setPhoneNumber", payload: e.target.value })
                }
              />
            </div>
            <div className="label-input">
              <label className="bill-label bill-email" htmlFor="email">
                Invoice email address
              </label>
              <input
                id="email"
                className="email-input bill-input"
                value={email}
                onChange={(e) =>
                  dispatch({ type: "setEmail", payload: e.target.value })
                }
              />
            </div>
            <div className="label-input">
              <label
                className="bill-label bill-companyName"
                htmlFor="companyName"
              >
                Company Name
              </label>
              <input
                id="companyName"
                className="companyName-input bill-input"
                placeholder="Optional"
                value={companyName}
                onChange={(e) =>
                  dispatch({ type: "setCompanyName", payload: e.target.value })
                }
              />
            </div>
            <div className="label-input">
              <label className="bill-label bill-vatNumber" htmlFor="vatNumber">
                VAT number
              </label>
              <input
                id="vatNumber"
                className="vatNumber-input bill-input"
                placeholder="Optional"
                value={vatNumber}
                onChange={(e) =>
                  dispatch({ type: "setVatNumber", payload: e.target.value })
                }
              />
            </div>
            <div className="label-input">
              <label className="bill-label bill-address" htmlFor="address">
                Address
              </label>
              <input
                id="address"
                className="address-input bill-input"
                placeholder="Optional"
                value={address}
                onChange={(e) =>
                  dispatch({ type: "setAddress", payload: e.target.value })
                }
              />
            </div>
            <div className="label-input">
              <label
                className="bill-label bill-postalCode"
                htmlFor="postalCode"
              >
                Postal Code
              </label>
              <input
                id="postalCode"
                className="postalCode-input bill-input"
                placeholder="Optional"
                value={postalCode}
                onChange={(e) =>
                  dispatch({ type: "setPostalCode", payload: e.target.value })
                }
              />
            </div>
            <div className="label-input">
              <label className="bill-label bill-city" htmlFor="city">
                City
              </label>
              <input
                id="city"
                className="city-input bill-input"
                placeholder="Optional"
                value={city}
                onChange={(e) =>
                  dispatch({ type: "setCity", payload: e.target.value })
                }
              />
            </div>
            <div className="label-input">
              <label className="bill-label bill-country" htmlFor="country">
                Country
              </label>
              <input
                id="country"
                className="country-input bill-input"
                placeholder="Optional"
                value={country}
                onChange={(e) =>
                  dispatch({ type: "setCountry", payload: e.target.value })
                }
              />
            </div>
            {/* <button className="bill-save" type="submit" disabled={isLoading}>
              {isLoading ? "cancel" : "Save"}
            </button> */}
          </div>
          <div className="error" style={{ color: "red" }}>
            {isError}
          </div>
        </form>
      </div>
    </div>
  );
};

export default BillingForm;
