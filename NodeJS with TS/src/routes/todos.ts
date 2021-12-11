import { Router } from "express";
import { Todo } from "../models/todo";

const router = Router();

let todos: Todo[] = [];

router.get("/", (req, res, next) => {
  res.status(200).json({ todos: todos });
});

router.post("/todo", (req, res, next) => {
const body = req.body as {text: string}
  const newTodo: Todo = {
    id: new Date().toISOString(),
    text: body.text,
  };
  todos.push(newTodo);
  res.status(201).json({ message: "Added Todo", todo: newTodo, todos: todos });
});

router.put("/todo/:todoId", (req, res, next) => {
  const tid: string = req.params.todoId;
  const todoIndex:string | number = todos.findIndex((todoItem) => todoItem.id === tid);
  if (todoIndex >= 0) {
    todos[todoIndex] = { ...todos[todoIndex], text: req.body.text };
    return res.status(200).json({ messag: "Updated todo", todo: todos });
  }
  res.status(404).json({ message: "Could not find todo for this id." });
});

router.delete('/todo/:todoId', (req, res, next) => {
    const toDoId: string = req.params.todoId;
    todos = todos.filter(todoId => todoId.id !== toDoId)
    res.status(200).json({message: 'Deleted todo', todos: todos})
})

export default router;
