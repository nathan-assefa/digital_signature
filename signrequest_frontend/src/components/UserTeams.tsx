import { useQuery } from "@tanstack/react-query";
import { Team } from "../utils/types";
import { getAllTeams } from "../utils/teams";
import { Link } from "react-router-dom";
import { useState, useRef } from "react";
import { useOnClickOutside } from "../hooks/useOnClickOutside";
import { UserCheck, Users } from "lucide-react";

const UserTeams = () => {
  const [showUserTeams, setShowUserTeams] = useState(false);
  const navRef = useRef<HTMLDivElement | null>(null);
  const UseTeamList = (): {
    team: Team[];
    isLoading: boolean;
    isError: boolean;
  } => {
    const {
      data: team,
      isLoading,
      isError,
    } = useQuery<Team[]>(["all-teams"], () => getAllTeams(), {
      initialData: [],
    });

    return {
      team,
      isLoading,
      isError,
    };
  };

  const { team: userTeams } = UseTeamList();
  useOnClickOutside(navRef, () => setShowUserTeams(false));

  return (
    <div className="user-teams-wrapper">
      <h3
        className="find-teams"
        onClick={() => setShowUserTeams((prev) => !prev)}
      >
        Find Teams You're Associated
      </h3>
      {showUserTeams && (
        <div ref={navRef} className="user-teams">
          {userTeams &&
            userTeams.map((team) => (
              <Link
                key={team.id}
                to={`/team-dashbord/${team.id}`}
                className="link"
              >
                <div className="user-team-info">
                  <div className="owner-info-container">
                    <UserCheck className="team-owner" />
                    <div className="owner-info">
                      <p className="owner-title">Team owner</p>
                      <p className="owner-name">{team.owner.first_name}</p>
                    </div>
                  </div>
                  <div className="name-of-team">
                    <Users className="user-team-icon" />
                    <p className="user-team-name">{team.name}</p>
                  </div>
                </div>
              </Link>
            ))}
        </div>
      )}
    </div>
  );
};

export default UserTeams;
