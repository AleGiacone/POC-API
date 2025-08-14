import {Task} from './task.entity.js';
import { Request, Response, NextFunction } from 'express';
import {ormPromise} from '../shared/db/orm.js';
import { EntityManager } from '@mikro-orm/mysql';

const resolversTasks = {
  Query: {
    tasks: () => getTasks(), //resolver manejo de errores
   
  },
  Mutation: {
    createTask: (_parent: any, args: {input: {title: string, description: string, status: string, dueDate: string}}) => createTask(args.input),
    // updateTask: (parent, args) => updateTask(args),
    // deleteTask: (parent, args) => deleteTask(args),
  },

}   


export async function getTasks() {
  const orm = await ormPromise;
  const em = orm.em.fork();
  try {
    const tasks = await em.find(Task, {});
    if (!tasks || tasks.length === 0) {
      return console.log('No tasks found');
    }
    return tasks;
  } catch (error: any) {
    throw new Error(`Error retrieving tasks: ${error.message}`);
  }
}

export async function getTaskById() {
    // const id = args;

}

export async function createTask(args: {title: string, description: string, status: string, dueDate: string}) {
  const { title, description, status, dueDate } = args;

  const orm = await ormPromise;
  const em = orm.em.fork(); // Usar fork() en lugar del global

  try {
    const task = em.create(Task, { 
      title, 
      description, 
      status, 
      dueDate: new Date(dueDate) // Convertir string a Date
    });
    await em.persistAndFlush(task);
    return task; // IMPORTANTE: Retornar la tarea creada
  } catch (error: any) {
    throw new Error(`Error creating task: ${error.message}`);
  }
}

export async function updateTask(req: Request, res: Response, next: NextFunction) {
}

export async function deleteTask(req: Request, res: Response, next: NextFunction) {
}
export default resolversTasks;
