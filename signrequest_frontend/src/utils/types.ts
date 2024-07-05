export interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
}

export interface Profile {
  id: number;
  created_at: string;
  updated_at: string;
  user: User;
}

export interface Document {
  id: string;
  file: string;
  name: string;
  owner: User | null;
  message: string;
  signings: SigningDocument[];
  date_uploaded: string | null;
}

export interface SigningDocument {
  id: string;
  document: Document;
  recipient: ExternalRecipient;
  is_signed: boolean;
  date_requested: string;
  document_log_file: string | undefined;
}

export interface ExternalRecipient {
  id: string;
  email: string;
}

export interface Team {
  id: number | string;
  name: string;
  owner: User;
  members: User[];
  website?: string;
  phoneNumber?: string;
  team_logo?: string;
  created_at: string;
  updated_at: string;
  members_count: number;
}

export interface TeamMembership {
  id: number;
  ROLE_ADMIN: "admin";
  ROLE_MEMBER: "member";
  team: Team;
  user: User;
  role: "admin" | "member";
  created_at: string;
}

export interface Invitation {
  id: number | string;
  team: Team;
  recipient_email: string;
  token: string;
  created_at: string;
  updated_at: string;
  accepted: boolean;
}

export interface TeamDocument {
  id: string | number;
  name: string;
  file?: string;
  team: Team;
  message: string;
  team_document_signings: TeamDocumentSigning[];
  date_uploaded: string;
}

export interface TeamDocumentSigning {
  id: string | number;
  document: TeamDocument;
  recipient: ExternalRecipient;
  is_signed: boolean;
  signature?: File | string;
  signature_image_url?: string;
  document_log_file?: string;
  date_requested: string;
}
