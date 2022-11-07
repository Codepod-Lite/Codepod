import { useParams } from "react-router-dom";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

import { useEffect, useState, useRef, useContext } from "react";

import { useStore } from "zustand";

import { createRepoStore, RepoContext } from "../lib/store";

import useMe from "../lib/me";
import { Canvas } from "../components/Canvas";
import { Sidebar } from "../components/Sidebar";
import { useApolloClient } from "@apollo/client";

function RepoWrapper({ children }) {
  // this component is used to provide foldable sidebar
  const [show, setShow] = useState(true);
  let sidebar_width = 0.12;
  return (
    <Box m="auto" height="100%">
      <Box
        sx={{
          display: "inline-block",
          verticalAlign: "top",
          height: "100%",
          width: show ? sidebar_width : 0,
          overflow: "auto",
        }}
      >
        <Box sx={{ display: "flex" }}>
          {/* <Spacer /> */}
          <Button
            onClick={() => {
              setShow(!show);
            }}
            size="small"
            // variant="ghost"
          >
            {show ? "Hide" : "Show"}
          </Button>
        </Box>
        <Box sx={{ mx: 2, my: 1 }}>
          <Sidebar />
        </Box>
      </Box>

      <Box
        sx={{
          display: "inline-block",
          verticalAlign: "top",
          height: "100%",
          width: show ? 1 - sidebar_width : 1,
          overflow: "scroll",
        }}
      >
        <Box
          style={{
            position: "absolute",
            margin: "5px",
            top: "50px",
            left: "5px",
          }}
          zIndex={100}
          visibility={show ? "hidden" : "inherit"}
        >
          <Button
            onClick={() => {
              setShow(!show);
            }}
            size="small"
            // variant="ghost"
          >
            {show ? "Hide" : "Show"}
          </Button>
        </Box>
        {children}
      </Box>
    </Box>
  );
}

function RepoImpl() {
  let { id } = useParams();
  const store = useContext(RepoContext);
  if (!store) throw new Error("Missing BearContext.Provider in the tree");
  const resetState = useStore(store, (state) => state.resetState);
  const setRepo = useStore(store, (state) => state.setRepo);
  const client = useApolloClient();
  const loadRepo = useStore(store, (state) => state.loadRepo);
  const setSessionId = useStore(store, (state) => state.setSessionId);
  const repoLoaded = useStore(store, (state) => state.repoLoaded);

  const { loading, me } = useMe();
  useEffect(() => {
    if (me) {
      setSessionId(`${me.id}_${id}`);
    }
  }, [me, id, setSessionId]);
  useEffect(() => {
    resetState();
    setRepo(id!);
    // load the repo. It is actually not a queue, just an async thunk
    loadRepo(client, id!);
  }, [client, id, loadRepo, resetState, setRepo]);

  // FIXME Removing queueL. This will cause Repo to be re-rendered a lot of
  // times, particularly the delete pod action would cause syncstatus and repo
  // to be re-rendered in conflict, which is weird.

  if (loading) return <Box>Loading</Box>;

  return (
    <RepoWrapper>
      {!repoLoaded && <Box>Repo Loading ...</Box>}
      {repoLoaded && (
        <Box
          height="100%"
          border="solid 3px black"
          p={2}
          boxSizing={"border-box"}
          // m={2}
          overflow="auto"
        >
          <Canvas />
        </Box>
      )}
    </RepoWrapper>
  );
}

export default function Repo() {
  const store = useRef(createRepoStore()).current;
  return (
    <RepoContext.Provider value={store}>
      <RepoImpl />
    </RepoContext.Provider>
  );
}
