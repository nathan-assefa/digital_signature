import { Profile } from "./types";
import fetchData from "./makeRequest";
import AuthToken from "./AuthToken";

const url: string = import.meta.env.VITE_SERVER_URL;
const accessToken: string = AuthToken();

export function getUserProfile(): Promise<Profile | undefined> {
  return fetchData(`${url}/profile/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + String(accessToken),
    },
  });
}
