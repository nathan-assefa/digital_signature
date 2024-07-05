import fetchData from "./makeRequest";
import AuthToken from "./AuthToken";
import { TeamMembership } from "./types";

const url: string = import.meta.env.VITE_SERVER_URL;
const accessToken: string = AuthToken();

export async function getMembershipForUser(
  user_id: string
): Promise<TeamMembership> {
  try {
    const response = await fetchData<TeamMembership>(
      `${url}/team-memberships/${user_id}/`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + String(accessToken),
        },
      }
    );
    console.log(response);
    return response;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
