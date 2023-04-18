import { json } from 'body-parser';
import cors from 'cors';
import express, { Request } from 'express';
import { JSONFile, Low } from 'lowdb';
import { randomUUID } from 'node:crypto';
import { join } from 'node:path';

// * ------------------------------------------------ DB

interface DS {
  todolist: TodoItem[];
}

interface TodoItem {
  id: string;
  text: string;
  done: boolean;
}

const file = join(__dirname, 'db.json');
const adapter = new JSONFile<DS>(file);
const db = new Low(adapter);
(async () => {
  await db.read();
})();

// * ------------------------------------------------ Express

const app = express();

app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'],
  }),
);

app.use(json());

const port = 5501;

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

// * ------------------------------------------------ API

const waiting = (req: Request) => {
  const isApp1 = req.headers.origin?.includes('3301');
  const random = (a: number, b: number) => Math.random() * (b - a) + a;
  const delay = isApp1 ? 0 : random(200, 500);

  return new Promise((res) => setTimeout(res, delay));
};

// * ---------------- get all

app.get('/todolist', async (req, res) => {
  await waiting(req);
  res.send(db.data.todolist);
});

// * ---------------- post todo

app.post('/todolist', async (req, res) => {
  const newTodo = req.body as TodoItem;
  newTodo.id = randomUUID();
  db.data.todolist.push(newTodo);

  await db.write();
  await waiting(req);
  res.send(newTodo);
});

// * ---------------- patch todos

app.patch('/todolist', async (req, res) => {
  const todos = req.body as TodoItem[];

  const updateAndResult = todos
    .filter((e) => e.id)
    .map((todo) => {
      const { id } = todo;
      const targetTodo = db.data.todolist.find((e) => e.id === id);
      Object.assign(targetTodo, todo);
      return targetTodo;
    });

  await db.write();
  await waiting(req);
  res.send(updateAndResult);
});

// * ---------------- delete ids

app.delete('/todolist/:ids', async (req, res) => {
  const ids = req.params.ids.split(',');

  db.data.todolist = db.data.todolist.filter((e) => !ids.includes(e.id));

  await db.write();
  await waiting(req);
  res.send({});
});
