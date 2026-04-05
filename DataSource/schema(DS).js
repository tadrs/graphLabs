import { gql } from "apollo-server";

export const typeDefs = gql`
  type Todo {
    id: ID!
    title: String!
    status: String!
    userId: String!
  }

  type Query {
    todos: [Todo]
    todo(id: ID!): Todo
  }

  type Mutation {
    createTodo(title: String!, userId: String!): Todo
    updateTodo(id: ID!, title: String, status: String): Todo
    deleteTodo(id: ID!): String
  }
`;