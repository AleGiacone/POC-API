import express from 'express'
import { taskRpcHandler } from './task.controller.js';

const taskRouter = express.Router();

taskRouter.post('/', taskRpcHandler);

export {taskRouter}