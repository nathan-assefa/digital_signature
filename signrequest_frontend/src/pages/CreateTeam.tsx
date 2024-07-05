import LeftSideBar from "../components/LeftSideBar";
import TeamForm from "../forms/TeamForm";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { createTeam } from "../utils/teams";
import { useEffect, useState } from "react";
import axios from "axios";
import UserTeams from "../components/UserTeams";

const CreateTeam = () => {
  // const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  interface TeamAttr {
    name: string;
    website: string;
    phoneNumber: string;
    team_logo: File | null;
  }

  const CreateTeamMutation = useMutation(
    async (TeamParms: TeamAttr) => {
      const { name, website, phoneNumber, team_logo } = TeamParms;

      try {
        const response = await createTeam({
          name,
          website,
          phoneNumber,
          team_logo,
        });
        navigate(`/team-dashbord/${response.id}`);
      } catch (error) {
        throw error;
      }
    },
    {
      onSuccess: () => {
        // queryClient.invalidateQueries(["profile"]);
        console.log("Team is created");
      },
    }
  );

  const onTeamCreate = async (formData: {
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
      };

      if (formData.team_logo) {
        updatedData.team_logo = formData.team_logo;
      }

      await CreateTeamMutation.mutateAsync(updatedData);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const responseError = error.response?.data;

        if (responseError) {
          if (responseError.name) {
            setError(responseError.name);
          } else if (responseError.website) {
            setError(
              `${responseError.website} Start with http:// or https://, or leave it blank`
            );
          } else if (responseError.phoneNumber) {
            setError(responseError.phoneNumber);
          } else {
            setError("An error occurred");
          }
        }
      }

      throw error;
    }
  };
  return (
    <>
      <div className="teams-wrapper">
        <div className="dashbord-wrapper">
          <LeftSideBar />
        </div>
        <div className="teams-right-col">
          <div className="teams-header">Teams</div>
          <UserTeams />
          <p className="create-new-team">Create a new team</p>
          <p className="team-related-info">
            Your team is private. Invite others with precise permissions for
            seamless, secure collaboration
          </p>
          <div className="user-account-from">
            <TeamForm
              isLoading={CreateTeamMutation.isLoading}
              isError={CreateTeamMutation.isError}
              autoFocus={true}
              initialValue={{
                team_name: "",
                website: "",
                phoneNumber: "",
                team_logo: null,
              }}
              formMode="create"
              onSubmit={onTeamCreate}
            />
          </div>
          <div className="create-team-footer">
            <div className="team-footer">
              <h3 className="members">Members</h3>
              <p className="team-activate-info">
                You have not activated a team.
              </p>
            </div>
          </div>
          {error && (
            <p className="error-while-registration">
              <div style={{ color: "red" }}>{error}</div>
            </p>
          )}
        </div>
      </div>
    </>
  );
};

export default CreateTeam;
