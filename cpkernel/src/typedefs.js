import { gql } from "apollo-server";

export const typeDefs = gql`
  type AuthData {
    token: String
  }

  type User {
    id: ID!
    username: String!
    email: String!
    password: String!
    name: String
  }

  type Repo {
    id: ID!
    name: String!
    pods: [Pod]
  }

  type Pod {
    id: ID!
    type: String
    content: String
    githead: String
    staged: String
    column: Int
    lang: String
    parent: Pod
    index: Int
    children: [Pod]
    result: String
    stdout: String
    error: String
    imports: String
    exports: String
    midports: String
    fold: Boolean
    thundar: Boolean
    utility: Boolean
    name: String
  }

  input PodInput {
    id: ID!
    type: String
    content: String
    column: Int
    lang: String
    result: String
    stdout: String
    error: String
    imports: String
    exports: String
    midports: String
    fold: Boolean
    thundar: Boolean
    utility: Boolean
    name: String
  }

  type Query {
    hello: String
    users: [User]
    me: User
    repos: [Repo]
    repo(name: String!, username: String!): Repo
    pods(username: String, reponame: String): [Pod]
    pod(id: ID!): Pod
    myRepos: [Repo]
    activeSessions: [String]
    gitGetHead(username: String, reponame: String): String
    gitDiff(username: String, reponame: String): String
    gitGetPods(username: String, reponame: String, version: String): [Pod]
  }

  type Mutation {
    login(username: String, password: String): AuthData
    signup(
      username: String
      email: String
      password: String
      invitation: String
    ): AuthData
    updateUser(username: String, email: String, name: String): Boolean
    createRepo(name: String): Repo
    deleteRepo(name: String): Boolean
    addPod(
      reponame: String
      username: String
      parent: String
      index: Int
      input: PodInput
    ): Pod
    deletePod(id: String, toDelete: [String]): Boolean
    pastePod(id: String, parentId: String, index: Int, column: Int): Boolean
    pastePods(ids: [String], parentId: String, index: Int, column: Int): Boolean
    updatePod(
      id: String
      content: String
      column: Int
      type: String
      lang: String
      result: String
      stdout: String
      error: String
      imports: String
      exports: String
      midports: String
      fold: Boolean
      thundar: Boolean
      utility: Boolean
      name: String
    ): Pod
    clearUser: Boolean
    clearRepo: Boolean
    clearPod: Boolean
    killSession(sessionId: String): Boolean
    gitExport(username: String, reponame: String): Boolean
    gitStage(username: String, reponame: String, podId: ID): Boolean
    gitStageMulti(username: String, reponame: String, podIds: [ID]): Boolean
    gitUnstage(username: String, reponame: String, podId: ID): Boolean
    gitUnstageMulti(username: String, reponame: String, podIds: [ID]): Boolean
    gitCommit(username: String, reponame: String, msg: String): Boolean
  }
`;