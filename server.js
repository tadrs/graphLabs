import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { schema } from "./schema.js";
import { resolvers } from "./resolver.js";
import mongoose from "mongoose";
import { loadEnvFile } from 'node:process'
import jwt from "jsonwebtoken";



loadEnvFile()

mongoose.connect('mongodb://127.0.0.1:27017/graph').then(() => {
    console.log('connected to db');
}).catch((err) => {
    console.log(err);

})

const server = new ApolloServer({
    typeDefs: schema,
    resolvers,
    formatError: (err) => {
        return {
            message: err.message,
            code: err.extensions.code
        }
    }
})

const port = 3200
const info = await startStandaloneServer(server, {
    listen: {
        port
    },
    context: ({ req }) => {
        let { authorization } = req.headers
        if (authorization) {
            let decoded = jwt.verify(authorization, process.env.SECRET)
            return decoded
        }else{
            return {}
        }
    }
})
console.log(info);

console.log(`server is ready on ${info.url}`);