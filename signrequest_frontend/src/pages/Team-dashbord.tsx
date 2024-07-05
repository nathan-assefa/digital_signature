import LeftSideBar from "../components/LeftSideBar";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, Link } from "react-router-dom";
import { inviteUser, updateTeam } from "../utils/teams";
import InviteUserForm from "../forms/InvitationForm";
import TeamForm from "../forms/TeamForm";
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { Clock3, UsersRound, XCircle } from "lucide-react";
import { useTeamList } from "../contexts/TeamContext";
import { Team } from "../utils/types";
import SignDocument from "../components/SignDocument";
import { useOnClickOutside } from "../hooks/useOnClickOutside";
import { useTeamDocumentList } from "../contexts/TeamDocumentsContext";
import DocumentList from "../components/TeamDocumentList";
import axios from "axios";
import { Toaster, toast } from "sonner";

const TeamDashbord = () => {
  // const queryClient = useQueryClient();
  const { id: team_id } = useParams();
  const { document } = useTeamDocumentList();
  const { team: teams, isLoading: teamsLoading } = useTeamList();
  const [single_team, setSingleTeam] = useState<Team | null>(null);
  const [invitedEmails, setInvitedEmails] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const navRef = useRef<HTMLDivElement | null>(null);
  useOnClickOutside(navRef, () => setIsOpen(false));

  const SERVER_ROOT_URL = import.meta.env.VITE_SERVER_ROOT_URL;
  const SERVER_URL = import.meta.env.VITE_SERVER_URL;
  const SEND_SIGN_DOCUMENT_FOR_TEAM = `${SERVER_URL}/team/${team_id}/send-signing-request/`;

  useEffect(() => {
    window.scrollTo(0, 0);

    // Check if teams are available and not loading
    if (!teamsLoading && teams) {
      const foundTeam = teams.find((team) => team.id == team_id);

      // Check if foundTeam is not undefined before updating state
      if (foundTeam) {
        setSingleTeam(foundTeam);
      }
    }
  }, [teams, team_id, teamsLoading]);

  /*This is for updating the team content*/
  const navigate = useNavigate();

  interface TeamAttr {
    name: string;
    website: string;
    phoneNumber: string;
    team_logo: File | null;
  }

  const UpdateTeamMutation = useMutation(
    async (TeamParms: TeamAttr) => {
      const { name, website, phoneNumber, team_logo } = TeamParms;

      try {
        const response = await updateTeam({
          name,
          team_id,
          website,
          phoneNumber,
          team_logo,
        });
        navigate(`/team-dashbord/${response.id}`);
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["all-teams"]);
        console.log("Team is created");
      },
    }
  );

  const onTeamUpdate = async (formData: {
    name: string;
    website: string;
    phoneNumber: string;
    team_logo: File | null;
  }): Promise<void> => {
    try {
      const updatedData: any = {
        name: formData.name,
        website: formData.website,
        phoneNumber: formData.phoneNumber,
        team_logo: formData.team_logo,
      };

      await UpdateTeamMutation.mutateAsync(updatedData);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const responseError = error.response?.data;

        if (responseError) {
          if (responseError.name) {
            setError(responseError.name);
          } else if (responseError.website) {
            setError(
              `${responseError.website}, start with http:// or https://`
            );
          } else if (responseError.phoneNumber) {
            setError(responseError.phoneNumber);
          } else if (responseError.detail) {
            setError(responseError.detail);
          } else {
            setError("An error occurred");
          }
        }
      }

      throw error;
    }
  };

  /* This for inviting user */
  interface InvitationAttr {
    email: string;
  }
  const inviteUserMutation = useMutation(
    async ({ email }: InvitationAttr) => {
      try {
        // Make the POST request to invite the user
        await inviteUser({ email, team_id });
        setInvitedEmails((prevEmails) => [...prevEmails, email]);
      } catch (error) {
        toast.error("Error sending invitation.");
      }
    },
    {
      onSuccess: () => {
        toast.success("Invitation sent successfully.");
      },
    }
  );

  const onHandleInvite = async (formData: { email: string }): Promise<void> => {
    try {
      // Trigger the mutation when the form is submitted
      await inviteUserMutation.mutateAsync(formData);
    } catch (error) {
      // Handle error
      console.error("Error inviting user:", error);
    }
  };

  if (teamsLoading) {
    return <div className="team-dashbord-loading">Loading...</div>;
  }

  if (!single_team) {
    return (
      <div className="no-account-for-this-route">
        There is no team account for this route
      </div>
    );
  }

  return (
    <>
      <div className="teams-wrapper">
        <div className="dashbord-wrapper">
          <LeftSideBar />
        </div>
        <div className="teams-right-col">
          <Toaster richColors />
          <div className="teams-header">Team dashbord</div>
          <div className="document-btn">
            {single_team.team_logo && (
              <div
                className="team-logo-img"
                style={{
                  backgroundImage: `url(${SERVER_ROOT_URL}${single_team.team_logo})`,
                }}
              ></div>
            )}
            <div>
              <div className="dashbord-team-content">
                <p className="dashbord-team-name">{single_team.name}</p>
                <div className="dashbord-team-status">
                  <Clock3 className="dashbord-team-st-icon" />
                  <p className="dashbord-team-count">Members Count: </p>
                  <p className="dashbord-team-count-value">
                    {single_team.members_count}
                  </p>
                </div>
              </div>
            </div>

            <div className="document-icon"></div>
            <button
              onClick={() => setIsOpen(true)}
              className="create-document-in-team"
            >
              Add document to sign
            </button>
          </div>

          <p className="create-new-team">Your team zone</p>
          <p className="team-related-info">
            Team content is private. Only owners or those with specific
            privileges can modify team information.
          </p>
          <div className="user-account-from">
            <TeamForm
              isLoading={UpdateTeamMutation.isLoading}
              isError={UpdateTeamMutation.isError}
              autoFocus={true}
              initialValue={{
                team_name: single_team?.name ?? "",
                website: single_team?.website ?? "",
                phoneNumber: single_team?.phoneNumber ?? "",
                team_logo: null,
              }}
              formMode="update"
              imgBtnStatus={single_team.team_logo ? true : false}
              onSubmit={onTeamUpdate}
            />
          </div>
          <div className="create-team-footer">
            <div className="team-footer">
              <div className="team-members">
                <UsersRound className="members-icon" />
                <h3 className="members">Members</h3>
              </div>
              <Link to={`/team/users/${team_id}`} className="link">
                <p className="team-activate-info">
                  {/* You have not activated a team. */}
                  Visit user page for members.
                </p>
              </Link>
            </div>
            <div className="user-account-from">
              <InviteUserForm
                isLoading={inviteUserMutation.isLoading}
                isError={inviteUserMutation.isError}
                autoFocus={false}
                onSubmit={onHandleInvite}
              />
              {/* Render the invited emails sequentially */}
              <div className="invited-emails">
                {invitedEmails.map((email, index) => (
                  <div key={index}>{email}</div>
                ))}
              </div>
            </div>

            <DocumentList document={document} team_id={team_id!} />
            {error && (
              <p className="error-while-resign-team-doc-poppupgistration">
                <div style={{ color: "red" }}>{error}</div>
              </p>
            )}
          </div>
        </div>

        {isOpen && (
          <div className="sign-team-doc-poppup">
            <XCircle
              onClick={() => setIsOpen(false)}
              className="modal-btn close-modal-btn"
            />
            <div className="home-left-col sign-pop-up">
              <SignDocument url={SEND_SIGN_DOCUMENT_FOR_TEAM} />
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default TeamDashbord;
