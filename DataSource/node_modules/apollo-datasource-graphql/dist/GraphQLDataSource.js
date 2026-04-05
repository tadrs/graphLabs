"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const apollo_link_1 = require("apollo-link");
const apollo_link_context_1 = require("apollo-link-context");
const apollo_link_error_1 = require("apollo-link-error");
const apollo_link_http_1 = require("apollo-link-http");
const apollo_server_errors_1 = require("apollo-server-errors");
const await_to_js_1 = __importDefault(require("await-to-js"));
const isomorphic_fetch_1 = __importDefault(require("isomorphic-fetch"));
class GraphQLDataSource {
    initialize(config) {
        this.context = config.context;
    }
    async mutation(mutation, options) {
        // GraphQL request requires the DocumentNode property to be named query
        return this.executeSingleOperation({ ...options, query: mutation });
    }
    async query(query, options) {
        return this.executeSingleOperation({ ...options, query });
    }
    composeLinks() {
        const uri = this.resolveUri();
        return apollo_link_1.ApolloLink.from([
            this.onErrorLink(),
            this.onRequestLink(),
            apollo_link_http_1.createHttpLink({ fetch: isomorphic_fetch_1.default, uri }),
        ]);
    }
    didEncounterError(error) {
        const status = error.statusCode ? error.statusCode : null;
        const message = error.bodyText ? error.bodyText : null;
        let apolloError;
        switch (status) {
            case 401:
                apolloError = new apollo_server_errors_1.AuthenticationError(message);
                break;
            case 403:
                apolloError = new apollo_server_errors_1.ForbiddenError(message);
                break;
            case 502:
                apolloError = new apollo_server_errors_1.ApolloError('Bad Gateway', status);
                break;
            default:
                apolloError = new apollo_server_errors_1.ApolloError(message, status);
        }
        throw apolloError;
    }
    async executeSingleOperation(operation) {
        const link = this.composeLinks();
        const [error, response] = await await_to_js_1.default(apollo_link_1.makePromise(apollo_link_1.execute(link, operation)));
        if (error) {
            this.didEncounterError(error);
        }
        return response;
    }
    resolveUri() {
        const baseURL = this.baseURL;
        if (!baseURL) {
            throw new apollo_server_errors_1.ApolloError('Cannot make request to GraphQL API, missing baseURL');
        }
        return baseURL;
    }
    onRequestLink() {
        return apollo_link_context_1.setContext((_, request) => {
            if (this.willSendRequest) {
                this.willSendRequest(request);
            }
            return request;
        });
    }
    onErrorLink() {
        return apollo_link_error_1.onError(({ graphQLErrors, networkError }) => {
            if (graphQLErrors) {
                graphQLErrors.map(graphqlError => console.error(`[GraphQL error]: ${graphqlError.message}`));
            }
            if (networkError) {
                console.log(`[Network Error]: ${networkError}`);
            }
        });
    }
}
exports.GraphQLDataSource = GraphQLDataSource;
