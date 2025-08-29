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
    updateTask: (_parent: any, args: {id: string, input: {title: string, description: string, status: string, dueDate: string}}) => updateTask(args),
    deleteTask: (_parent: any, args: {id: string}) => deleteTask(args),
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

export async function getTaskById(args: {id: number}) {
    const { id } = args;

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

export async function updateTask(args: {id: string, input: {title: string, description: string, status: string, dueDate: string}}) {
  const { id, input } = args;

  const orm = await ormPromise;
  const em = orm.em.fork();

  try {
    const taskToUpdate = await em.findOneOrFail(Task, parseInt(id));
    if (input.title) taskToUpdate.title = input.title;
    if (input.description) taskToUpdate.description = input.description;
    if (input.status) taskToUpdate.status = input.status;
    if (input.dueDate) taskToUpdate.dueDate = new Date(input.dueDate);

    await em.persistAndFlush(taskToUpdate);
    return taskToUpdate;
  } catch (error: any) {
    throw new Error(`Error updating task: ${error.message}`);
  }
}

export async function deleteTask(args: {id: string}) {
  const { id } = args;

  const orm = await ormPromise;
  const em = orm.em.fork();

  try {
    const task = await em.findOneOrFail(Task, parseInt(id));
    await em.removeAndFlush(task);
    return true; // Retornar Boolean según el schema
  } catch (error: any) {
    throw new Error(`Error deleting task: ${error.message}`);
  }
}
export default resolversTasks;
