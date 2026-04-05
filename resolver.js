import { GraphQLError } from "graphql/error/GraphQLError.js"
import userModel from "./model/user.js"
import jwt from 'jsonwebtoken'
import bcrypt from "bcryptjs"
import todoModel from "./model/todo.js"
import { loadEnvFile } from 'node:process'


loadEnvFile()

export const resolvers = {
    Query: {
        greeting: () => {
            return "Hello GraphQL";
        },

        users: async () => {
            return await userModel.find()
        },
        user: async (_,{ id }) => {
            return await userModel.findById(id)
        },
        todos: async () => {
            return await todoModel.find()
        },
        todo: async (_, { id }) => {
            return await todoModel.findById(id)
        },
        todosByUser: async (_, { userId }) => {
            return await todoModel.find({ userId })
        }
    },

    User: {
        todos: async (parent) => {
            return await todoModel.find({ userId: parent._id })
        }
    },

    Todo: {
        user: async (parent) => {
            return await userModel.findById(parent.userId)
        }
    },

    Mutation: {
        register:async (_,{user}) => {
            try {
                console.log(user);
                const usr = await userModel.create(user)
                console.log(usr);
                return usr
            } catch (err) {
                console.log("REGISTER ERROR:", err.message)
                throw new GraphQLError(err.message)
            }
        },
        login: async (_,{user}) => {
            let {email,password} = user
            if (!email || !password) {
                throw new GraphQLError('You must provide email and password', {
                    extensions: { code: 'BAD_USER_INPUT' }
                })
            }

            let usr = await userModel.findOne({email})
            if (!usr) {
                throw new GraphQLError('Invalid email or password', {
                    extensions: { code: 'BAD_USER_INPUT' }
                })
            }

            let isMatch = await bcrypt.compare(password, usr.password)
            if (!isMatch) {
                throw new GraphQLError('Invalid email or password', {
                    extensions: { code: 'BAD_USER_INPUT' }
                })
            }

            let token = jwt.sign({id: usr._id, role: usr.role}, process.env.SECRET)
            return {message: "Login successful", token}
        },
        createTodo: async (_, { title, userId }) => {
            let todo = await todoModel.create({ title, userId })
            return todo
        },
        updateTodo: async (_,args,context) => {
            if (context.id && context.role) {
                try{
                    const todo = await todoModel.findOne({ userId: context.id })
                    if (todo) {
                        let updatedTodo = await todoModel.findByIdAndUpdate(args.id, {...args}, {new: true})
                        return updatedTodo
                    } else {
                        throw new GraphQLError('You are not authorized to update this todo')
                    }

                    
                }catch(err){
                    throw new GraphQLError(err.message, {
                        extensions: {
                            code: 'INTERNAL_SERVER_ERROR'
                        }
                    })
                }
            }   
        },
        deleteTodo: async (_,args,context) => {
            if (context.id && context.role) {
                try{
                    const todo = await todoModel.findOne({ userId: context.id })
                    if (todo) {
                        await todoModel.findByIdAndDelete(args.id)
                        return "Todo deleted successfully"
                    } else {
                        throw new GraphQLError('You are not authorized to delete this todo')
                    }

                    
                }catch(err){
                    throw new GraphQLError(err.message, {
                        extensions: {
                            code: 'INTERNAL_SERVER_ERROR'
                        }
                    })
                }
            }
            
        },
        updateUser: async (_, { id, data }, context) => {
            if (!context.id) {
                throw new GraphQLError("Not authenticated", {
                    extensions: { code: "UNAUTHENTICATED" },
                });
            }

            if (context.role !== "admin") {
                throw new GraphQLError("Not authorized", {
                    extensions: { code: "FORBIDDEN" },
                });
            }

            try {
                const user = await userModel.findById(id);
                    if (!user) {
                        throw new GraphQLError("User not found", {
                            extensions: { code: "NOT_FOUND" },
                        });
                    }

                    

                    const updatedUser = await userModel.findByIdAndUpdate(id,{...data},{
                        new: true,
                        runValidators: true,
                    }
                );

                return updatedUser;

            } catch (err) {
                throw new GraphQLError(err.message, {
                    extensions: {
                        code: "INTERNAL_SERVER_ERROR",
                    },
                });
            }


        },

        deleteUser: async (_, { id }, context) => {
            if (!context.id) {
                throw new GraphQLError("Not authenticated", {
                    extensions: { code: "UNAUTHENTICATED" },
                });
            }
                
            if (context.role !== "admin") {
                throw new GraphQLError("Not authorized", {
                    extensions: { code: "FORBIDDEN" },
                });
            }

            try {
                const user = await userModel.findById(id);
                if (!user) {
                    throw new GraphQLError("User not found", {
                        extensions: { code: "NOT_FOUND" },
                    });
                }

                await userModel.findByIdAndDelete(id);
                return "User deleted successfully";

            } catch (err) {
                throw new GraphQLError(err.message, {
                    extensions: {
                        code: "INTERNAL_SERVER_ERROR",
                    },
                });
            }   

        }
    }



}