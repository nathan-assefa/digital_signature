import React, { createContext, useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import { useReducer, useCallback, useMemo } from "react";
import { TeamDocumentSigning } from "../utils/types";
import { useParams } from "react-router-dom";
import { getTeamDocuments } from "../utils/team-documents";

const UseTeamDocumentSource = (): {
  document: TeamDocumentSigning[];
  search: string;
  setSearch: (search: string) => void;
  isLoading: boolean;
} => {
  const { id: team_id } = useParams();
  const { data: document, isLoading } = useQuery<TeamDocumentSigning[]>(
    ["team-sign-documents"],
    () => getTeamDocuments(team_id!),
    {
      initialData: [],
    }
  );

  type DocumentState = {
    search: string;
  };

  type TeamDocumentAction = { type: "setSearch"; payload: string };

  const reducer = (state: DocumentState, action: TeamDocumentAction) => {
    switch (action.type) {
      case "setSearch":
        return { ...state, search: action.payload };
    }
  };

  const setSearch = useCallback((search: string) => {
    dispatch({
      type: "setSearch",
      payload: search,
    });
  }, []);

  const [{ search }, dispatch] = useReducer(reducer, {
    search: "",
  });

  const filteredDocument = useMemo(
    () =>
      document
        ?.filter((d) =>
          d?.document?.name.toLowerCase().includes(search.toLowerCase())
        )
        .slice(0, 20),
    [document, search]
  );

  return {
    document: filteredDocument,
    search,
    setSearch,
    isLoading,
  };
};

const TeamDocumentContext = createContext<
  ReturnType<typeof UseTeamDocumentSource>
>({} as ReturnType<typeof UseTeamDocumentSource>);

export const useTeamDocumentList = () => {
  return useContext(TeamDocumentContext);
};

export const TeamDocumentListProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <TeamDocumentContext.Provider value={UseTeamDocumentSource()}>
      {children}
    </TeamDocumentContext.Provider>
  );
};
