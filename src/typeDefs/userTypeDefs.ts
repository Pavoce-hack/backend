import { gql } from "apollo-server-express";

const userTypeDefs = gql`
  type User {
    id: ID!
    walletId: String!
    fullName: String!
    businessName: String!
    profilePic: String
    businessLogo: String
  }

  input UserInput {
    id: ID!
    walletId: String!
    fullName: String!
    businessName: String!
    profilePic: String
    businessLogo: String
  }

  type Query {
    users: [User!]!
    user(id: ID!): User!
  }

  type Mutation {
    createUser(input: UserInput!): User!
    loginUser(walletId: String!): User!
    updateUser(_id: ID!, input: UserInput!): User!
    deleteUser(_id: ID!): User!
  }
`;

export default userTypeDefs;
