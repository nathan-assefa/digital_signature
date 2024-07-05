import fetchData from "./makeRequest";
import AuthToken from "./AuthToken";
import { SigningDocument } from "./types";

const url: string = import.meta.env.VITE_SERVER_URL;
const accessToken: string = AuthToken();

export function getDocumentToSign(id: string): Promise<SigningDocument> {
  return fetchData(`${url}/sign-documents/${id}`);
}

export async function updateDocumentStatus(
  signingId: string,
  is_signed?: boolean,
  signature?: string | undefined
): Promise<SigningDocument> {
  try {
    const response = await fetchData<SigningDocument>(
      `${url}/sign-documents/${signingId}/`,
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
