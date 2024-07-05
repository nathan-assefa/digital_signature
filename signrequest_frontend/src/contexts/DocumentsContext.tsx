import React, { createContext, useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import { useReducer, useCallback, useMemo } from "react";
import { SigningDocument } from "../utils/types";

import { getDocuments } from "../utils/documents";

const UseDocumentSource = (): {
  document: SigningDocument[];
  search: string;
  setSearch: (search: string) => void;
} => {
  const { data: document } = useQuery<SigningDocument[]>(
    ["sign-documents"],
    () => getDocuments(),
    {
      initialData: [],
    }
  );

  type DocumentState = {
    search: string;
  };

  type PostAction = { type: "setSearch"; payload: string };

  const reducer = (state: DocumentState, action: PostAction) => {
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
  };
};

const PostContext = createContext<ReturnType<typeof UseDocumentSource>>(
  {} as ReturnType<typeof UseDocumentSource>
);

export const useDocumentList = () => {
  return useContext(PostContext);
};

export const DocumentListProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <PostContext.Provider value={UseDocumentSource()}>
      {children}
    </PostContext.Provider>
  );
};
