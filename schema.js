export const schema = `#graphql

type Query {
  greeting: String
  users: [User]
  user(id: ID!): User
  todos: [Todo]
  todo(id: ID!): Todo
  todosByUser(userId: ID!): [Todo]
}

type Mutation {
  register(user: RegisteredUser!): User
  login(user: LoggedInUser!): LoginResponse
  createTodo(title: String!, userId: ID!): Todo
  updateTodo(id: ID!, title: String, status: S): Todo
  deleteTodo(id: ID!): String
  updateUser(id: ID!, data: UpdateUserInput!): User
  deleteUser(id: ID!): String
}

interface IUser {
  email: String
  username: String
}

enum S {
  done
  inprogress
  todo
}


type User implements IUser {
  _id: ID
  email: String
  username: String
  role: String
  todos: [Todo]
}

type Todo {
  _id: ID
  title: String
  status: S
  user: User
}

type LoginResponse {
  message: String
  token: String
}

input RegisteredUser {
  email: String!
  username: String!
  password: String!
  role: String
}

input LoggedInUser {
  email: String!
  password: String!
}

input UpdateUserInput {
  email: String
  username: String
  password: String
  role: String
}
`;