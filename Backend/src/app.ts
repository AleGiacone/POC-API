import 'reflect-metadata';
import express from 'express';
import bodyParser from "body-parser";
import mysql from "mysql2/promise";
// import { taskRouter } from './task/task.routes.js';
import path from 'path'
import fs from 'fs'
import {ormPromise} from './shared/db/orm.js';
import resolversTasks, { getTasks } from './task/task.resolvers.js';
import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import typeDefs from './task/task.defs.js';
import resolversTask from './task/task.resolvers.js';
import { BaseContext } from '@apollo/server';
import { request } from 'http';

const server = new ApolloServer({
  typeDefs,
  resolvers: resolversTasks
});

const {url} = await startStandaloneServer(server, {
  listen: { port: 4000 }
});

const app = express();
app.use(express.json());
app.use('/', (req, res) => {
  console.log(req.query);
});

app.use(bodyParser.json());
// app.use('/tasks', taskRouter);


app.listen(3000, () => {
  console.log("Graphql server running on http://localhost:3000");
});

