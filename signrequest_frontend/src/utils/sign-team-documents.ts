import fetchData from "./makeRequest";
import AuthToken from "./AuthToken";
import { TeamDocumentSigning } from "./types";

const url: string = import.meta.env.VITE_SERVER_URL;
const accessToken: string = AuthToken();

export async function getTeamDocumentToSign(
  id: string
): Promise<TeamDocumentSigning> {
  try {
    const response = await fetchData<TeamDocumentSigning>(
      `${url}/team/team-sign-documents/${id}`
    );
    return response;
  } catch (error) {
    throw error;
  }
}

export async function updateTeamDocumentStatus(
  signingId: string,
  is_signed?: boolean,
  signature?: string | undefined
): Promise<TeamDocumentSigning> {
  try {
    const response = await fetchData<TeamDocumentSigning>(
      `${url}/team/team-sign-documents/${signingId}/`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + String(accessToken),
        },
        data: { is_signed, signature },
      }
    );
    return response;
  } catch (error) {
    throw error;
  }
}
