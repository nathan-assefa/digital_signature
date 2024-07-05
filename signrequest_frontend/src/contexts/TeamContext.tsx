import React, { createContext, useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import { Team } from "../utils/types";

import { getAllTeams } from "../utils/teams";

const UseTeamSource = (): {
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

const TeamContext = createContext<ReturnType<typeof UseTeamSource>>(
  {} as ReturnType<typeof UseTeamSource>
);

export const useTeamList = () => {
  return useContext(TeamContext);
};

export const TeamListProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <TeamContext.Provider value={UseTeamSource()}>
      {children}
    </TeamContext.Provider>
  );
};
