import fetchData from "./makeRequest";
import AuthToken from "./AuthToken";
import { TeamDocumentSigning } from "./types";

const url: string = import.meta.env.VITE_SERVER_URL;

const accessToken: string = AuthToken();

export async function getTeamDocuments(
  team_id: string
): Promise<TeamDocumentSigning[]> {
  try {
    const response: TeamDocumentSigning[] = await fetchData(
      `${url}/list-team-documents/${team_id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + String(accessToken),
        },
      }
    );
    return response;
  } catch (error) {
    throw error;
  }
}

export async function getTeamDocument(
  document_signing_id: string
): Promise<TeamDocumentSigning> {
  try {
    const response: TeamDocumentSigning = await fetchData(
      `${url}/team-document-signing/${document_signing_id}`
    );
    return response;
  } catch (error) {
    throw error;
  }
}

interface ErrorResponse {
  detail: string;
}

interface SuccessResponse {
  status: number;
}

type MyResponse = ErrorResponse | SuccessResponse;

export async function removeSelectedDocuments(
  signed_ids: string[]
): Promise<MyResponse> {
  try {
    const response: MyResponse = await fetchData(
      `${url}/remove-team-documents/`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + String(accessToken),
        },
        data: { signed_ids },
      }
    );
    return response;
  } catch (error) {
    throw error;
  }
}
