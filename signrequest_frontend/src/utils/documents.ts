import fetchData from "./makeRequest";
import AuthToken from "./AuthToken";
import { SigningDocument } from "./types";

const url: string = import.meta.env.VITE_SERVER_URL;

const accessToken: string = AuthToken();

export async function getDocuments(): Promise<SigningDocument[]> {
  try {
    const response: SigningDocument[] = await fetchData(
      `${url}/sign-documents/`,
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

export async function getDocument(
  signing_id: string
): Promise<SigningDocument> {
  try {
    const response: SigningDocument = await fetchData(
      `${url}/signings/${signing_id}`
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
    const response: MyResponse = await fetchData(`${url}/remove_documents/`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + String(accessToken),
      },
      data: { signed_ids },
    });
    console.log(response);
    return response;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
