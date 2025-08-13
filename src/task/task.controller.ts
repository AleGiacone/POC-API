import {Task} from './task.entity.js';
import { Request, Response, NextFunction } from 'express';
import {ormPromise} from '../shared/db/orm.js';
import { EntityManager } from '@mikro-orm/mysql';

export async function getTasks(em: EntityManager, params?: any) {
  // em debe venir como em.fork() desde el server para cada llamada
  const tasks = await em.find(Task, {}); // podés filtrar con params si querés
  // devolver objetos planos (evitamos enviar internals)
  return tasks.map(t => ({ id: t.id, title: t.title, status: t.status }));
}
export interface CreateUserParams {
  title: string;
  description: string;
  status?: string;
  dueDate?: Date;
}

 async function createTask(this: any, params: CreateUserParams) {
    const orm = await ormPromise;
    const em = orm.em.fork();
    
    try {
      const task = new Task();
      task.title = params.title;
      task.description = params.description;
      task.status = params.status ?? 'pending';
      if (params.dueDate) task.dueDate = new Date(params.dueDate);
      await em.persistAndFlush(task);

      return {
        success: true,
        data: {
          id: task.id,
          title: task.title,
          description: task.description,
          status: task.status,
          dueDate: task.dueDate
        }
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }





export async function taskRpcHandler(req: Request, res: Response) {
  const { jsonrpc, method, params, id } = req.body;

  if (jsonrpc !== '2.0') {
    return res.json({
      jsonrpc: '2.0',
      error: { code: -32600, message: 'Invalid Request' },
      id,
    });
  }

  try {
    const orm = await ormPromise;
    const em = orm.em.fork();

    switch (method) {
      case 'getTasks': {
        const tasks = await em.find(Task, {});
        return res.json({ jsonrpc: '2.0', result: tasks, id });
      }

      case 'createTask': {
        const { title, description, status, dueDate } = params;
        const task = new Task();
        task.title = title;
        task.description = description;
        task.status = status ?? 'pending';
        if (dueDate) task.dueDate = new Date(dueDate);
        await em.persistAndFlush(task);
        return res.json({ jsonrpc: '2.0', result: task, id });
      }

      case 'updateTask': {
        const { id: taskId, ...updates } = params;
        const task = await em.findOne(Task, { id: taskId });
        if (!task) {
          return res.json({
            jsonrpc: '2.0',
            error: { code: -32000, message: 'Task not found' },
            id,
          });
        }
        em.assign(task, updates);
        await em.flush();
        return res.json({ jsonrpc: '2.0', result: task, id });
      }

      case 'deleteTask': {
        const { id: taskId } = params;
        const task = await em.findOne(Task, { id: taskId });
        if (!task) {
          return res.json({
            jsonrpc: '2.0',
            error: { code: -32000, message: 'Task not found' },
            id,
          });
        }
        await em.removeAndFlush(task);
        return res.json({ jsonrpc: '2.0', result: true, id });
      }

      default:
        return res.json({
          jsonrpc: '2.0',
          error: { code: -32601, message: 'Method not found' },
          id,
        });
    }
  } catch (err) {
    if (err instanceof Error) {
      return res.json({
        jsonrpc: '2.0',
        error: { code: -32603, message: err.message },
        id,
      });
    }
    return res.json({
      jsonrpc: '2.0',
      error: { code: -32603, message: 'Unknown error' },
      id,
    });
  }

}

