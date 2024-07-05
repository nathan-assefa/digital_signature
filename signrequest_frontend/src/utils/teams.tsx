import fetchData from "./makeRequest";
import AuthToken from "./AuthToken";
import { Team, Invitation } from "./types";

const url: string = import.meta.env.VITE_SERVER_URL;
const accessToken: string = AuthToken();

interface TeamAttr {
  name: string;
  website?: string;
  phoneNumber?: string;
  team_logo?: File | null;
}

export async function createTeam({
  name,
  website,
  phoneNumber,
  team_logo,
}: TeamAttr): Promise<Team> {
  try {
    const response = await fetchData<Team>(`${url}/teams/`, {
      method: "POST",
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: "Bearer " + String(accessToken),
      },
      data: { name, website, phoneNumber, team_logo },
    });
    return response;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

interface UpdateTeamAttr {
  name: string;
  team_id: string | undefined;
  website?: string;
  phoneNumber?: string;
  team_logo?: File | null;
}

export async function updateTeam({
  name,
  team_id,
  website,
  phoneNumber,
  team_logo,
}: UpdateTeamAttr): Promise<Team> {
  try {
    const response = await fetchData<Team>(`${url}/teams/${team_id}/`, {
      method: "PATCH",
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: "Bearer " + String(accessToken),
      },
      data: { name, website, phoneNumber, team_logo },
    });
    return response;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

interface InviteUserParms {
  email: string;
  team_id: string | undefined;
}

export async function inviteUser({
  email,
  team_id,
}: InviteUserParms): Promise<Invitation> {
  try {
    const response = await fetchData<Invitation>(`${url}/invite-user/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + String(accessToken),
      },
      data: { email, team_id },
    });
    return response;
  } catch (error) {
    throw error;
  }
}

interface AcceptInvitationResponse {
  error?: string;
  message?: string;
}

export async function acceptInvitation(
  token: string
): Promise<AcceptInvitationResponse> {
  try {
    const response = await fetchData<AcceptInvitationResponse>(
      `${url}/accept-invitation/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + String(accessToken),
        },
        data: { token },
      }
    );
    return response;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getAllTeams(): Promise<Team[]> {
  try {
    const response = await fetchData<Team[]>(`${url}/teams/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + String(accessToken),
      },
    });
    return response;
  } catch (error) {
    throw error;
  }
}

interface RemoveUserResponse {
  detail: string;
}

export async function removeSelectedUsers(
  user_ids: string[],
  team_id: string
): Promise<RemoveUserResponse> {
  try {
    const response: RemoveUserResponse = await fetchData(
      `${url}/remove_team_members/${team_id}/`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + String(accessToken),
        },
        data: { user_ids },
      }
    );
    return response;
  } catch (error) {
    throw error;
  }
}
