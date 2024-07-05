import React, { useState, createContext, useContext } from "react";
import jwt_decode from "jwt-decode";
import { useNavigate } from "react-router-dom";

type AuthContextType = {
  loginUser: (
    e: React.FormEvent<HTMLFormElement>,
    destination?: string | undefined,
    team_id?: string | undefined,
    token?: string | undefined
  ) => Promise<void>;
  logOutUser: () => void;
  username: string | null;
  authToken: string | null;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth(): AuthContextType {
  return useContext(AuthContext)!;
}

type AuthProviderProps = {
  children: React.ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const navigate = useNavigate();

  const authRelatedData = localStorage.getItem("authTokens");
  const initialAuthToken = authRelatedData ? JSON.parse(authRelatedData) : null;
  const initialUser = initialAuthToken
    ? jwt_decode<{ username: string }>(initialAuthToken.access).username
    : null;

  const [authToken, setAuthToken] = useState<string | null>(initialAuthToken);
  const [user, setUser] = useState<string | null>(initialUser);

  const loginUser = async (
    e: React.FormEvent<HTMLFormElement>,
    destination?: string | undefined,
    team_id?: string | undefined,
    token?: string | undefined
  ): Promise<void> => {
    e.preventDefault();

    const form = e.target as HTMLFormElement;
    const url: string = import.meta.env.VITE_SERVER_URL;

    const response = await fetch(`${url}/token/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: form.username.value,
        password: form.password.value,
      }),
    });

    const data = await response.json();
    if (response.status === 200) {
      const accessToken = data.access;
      setAuthToken(accessToken);
      setUser(jwt_decode<{ username: string }>(accessToken).username);
      localStorage.setItem("authTokens", JSON.stringify(data));

      // Check if destination is provided, otherwise navigate to "/"
      if (destination) {
        navigate(
          `${destination}${team_id ? `?team_id=${team_id}` : ""}${
            token ? `&token=${token}` : ""
          }`
        );
      } else {
        navigate("/");
      }

      window.location.reload();
    } else {
      alert("Something went wrong");
    }
  };

  const logOutUser = () => {
    setAuthToken(null);
    setUser(null);
    localStorage.removeItem("authTokens");
    navigate("/");
  };

  const contextData = {
    loginUser,
    logOutUser,
    username: user,
    authToken,
  };

  return (
    <AuthContext.Provider value={contextData}>{children}</AuthContext.Provider>
  );
}
