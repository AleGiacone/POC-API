import 'reflect-metadata';
import express from 'express';
import { Server, ServerOptions} from '@open-rpc/server-js';
import bodyParser from "body-parser";
import mysql from "mysql2/promise";
import { taskRouter } from './task/task.routes.js';
import path from 'path'
import fs from 'fs'
import {ormPromise} from './shared/db/orm.js';
import { getTasks } from './task/task.controller.js';

const app = express();
app.use(express.json());
const openrpcPath = path.join(__dirname, "./openrpc.json");
const openrpcDoc = JSON.parse(fs.readFileSync(openrpcPath, "utf-8"));

app.use(bodyParser.json());
app.use('/tasks', taskRouter);




app.get("/openrpc.json", (req, res) => {
  res.json(openrpcDoc);
});


app.listen(3000, () => {
  console.log("JSON-RPC server running on http://localhost:3000");
});
