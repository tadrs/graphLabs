import mongoose from "mongoose";
import { ApolloServer } from "apollo-server";
import { typeDefs } from "./schema(DS).js";
import { resolvers } from "./resolver(DS).js";
import { TodoAPI } from "./TodoApi.js";


mongoose.connect("mongodb://127.0.0.1:27017/datasource").then(() => {
    console.log("connected to db");
}).catch((err) => {
    console.log(err);
})
  

const server = new ApolloServer({
  typeDefs,
  resolvers,
  dataSources: () => ({
    todoAPI: new TodoAPI(),
  }),
});

server.listen({ port: 4000 }).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});





