import { useEffect, useState } from "react";
import LeftSideBar from "../components/LeftSideBar";
import { Link, useParams } from "react-router-dom";
import { useTeamList } from "../contexts/TeamContext";
import { Team } from "../utils/types";
import { Clock3, UsersRound } from "lucide-react";
import TimeAgo from "../utils/timeFormat";
import { removeSelectedUsers } from "../utils/teams";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const Users = () => {
  const [single_team, setSingleTeam] = useState<Team | null>(null);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const { id: team_id } = useParams();
  const { team: teams, isLoading: teamsLoading } = useTeamList();

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

  const queryClient = useQueryClient();

  const removeDocumentsMutation = useMutation(
    async (user_ids: string[]) => {
      try {
        await removeSelectedUsers(user_ids, team_id!);
      } catch (err) {
        if (axios.isAxiosError(err)) {
          setError(err.response?.data?.detail || "An error occurred");
        }
        throw err;
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["all-teams"]);
        setSelectedUsers([]);
      },
    }
  );

  const handleUserCheckboxChange = (userId: string) => {
    setSelectedUsers((prevSelected) => {
      if (prevSelected.includes(userId)) {
        // User is already selected, remove from the list
        return prevSelected.filter((id) => id !== userId);
      } else {
        // User is not selected, add to the list
        return [...prevSelected, userId];
      }
    });
  };

  const handleDeleteSelected = () => {
    removeDocumentsMutation.mutate(selectedUsers);
  };

  if (teamsLoading) {
    return <div className="user-page-loading-state">Loading...</div>;
  }

  if (!single_team) {
    return (
      <div className="user-page-no-user">
        <div className="user-btn">
          <p className="add-users-to-team">
            You can add users on a team page.{" "}
            <span>
              <Link to="/create-teams" className="link">
                To make a team account have a look here.
              </Link>
            </span>
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="users-wrapper">
        <div className="dashbord-wrapper">
          <LeftSideBar />
        </div>
        <div className="users-right-col">
          <div className="users-header">Users</div>
          {single_team.members && single_team.members.length > 0 ? (
            <div>
              <div className="members-info">
                <div className="single-team-detail">
                  <UsersRound className="team-detail-icon" />
                  <div className="team-detail">
                    <p className="team-name">{single_team?.name}</p>
                    <p className="signed-date">
                      {single_team.created_at && (
                        <TimeAgo date={new Date(single_team.created_at)} />
                      )}
                    </p>
                    <p className="team-id">Team id: {single_team.id}</p>
                    <div className="team-status">
                      <Clock3 className="team-st-icon" />
                      <p className="team-count">Members Count: </p>
                      <p className="team-count-value">
                        {single_team.members_count}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="users-list-container">
                  <p className="members">Members</p>
                  <div className="team-members-list-header">
                    <p className="member-name-header">Name</p>
                    <p className="member-email-header">Email</p>
                    <p className="member-status-header">Status</p>
                    <button
                      onClick={handleDeleteSelected}
                      className="delete-selected-user"
                    >
                      Delete user
                    </button>
                  </div>
                  {single_team.members.map((member) => {
                    return (
                      <div key={member.id} className="team-members-list">
                        <p className="member-name">{member?.first_name}</p>
                        <p className="member-email">{member?.email}</p>
                        <p className="member-status">Member</p>
                        <div className="user-check-box">
                          <input
                            type="checkbox"
                            onChange={() => handleUserCheckboxChange(member.id)}
                            checked={selectedUsers.includes(member.id)}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <div className="user-btn">
              <p className="add-users-to-team">
                You can add users on a team page.{" "}
                <span>
                  <Link to="/create-teams" className="link">
                    To make a team account have a look here.
                  </Link>
                </span>
              </p>
            </div>
          )}
        </div>
        {error && (
          <p className="error-while-registration">
            <div style={{ color: "red" }}>{error}</div>
          </p>
        )}
      </div>
    </>
  );
};

export default Users;
