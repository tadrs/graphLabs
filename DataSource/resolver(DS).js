export const resolvers = {
  Query: {
    todos: (_, __, { dataSources }) => dataSources.todoAPI.getTodos(),
    todo: (_, { id }, { dataSources }) => dataSources.todoAPI.getTodoById(id),
  },
  
  Mutation: {
    createTodo: (_, { title, userId }, { dataSources }) =>
      dataSources.todoAPI.createTodo(title, userId),
    updateTodo: (_, { id, ...data }, { dataSources }) =>
      dataSources.todoAPI.updateTodo(id, data),
    deleteTodo: (_, { id }, { dataSources }) =>
      dataSources.todoAPI.deleteTodo(id),
  },
};