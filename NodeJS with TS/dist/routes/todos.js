"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = express_1.Router();
let todos = [];
router.get("/", (req, res, next) => {
    res.status(200).json({ todos: todos });
});
router.post("/todo", (req, res, next) => {
    const body = req.body;
    const newTodo = {
        id: new Date().toISOString(),
        text: body.text,
    };
    todos.push(newTodo);
    res.status(201).json({ message: "Added Todo", todo: newTodo, todos: todos });
});
router.put("/todo/:todoId", (req, res, next) => {
    const tid = req.params.todoId;
    const todoIndex = todos.findIndex((todoItem) => todoItem.id === tid);
    if (todoIndex >= 0) {
        todos[todoIndex] = Object.assign(Object.assign({}, todos[todoIndex]), { text: req.body.text });
        return res.status(200).json({ messag: "Updated todo", todo: todos });
    }
    res.status(404).json({ message: "Could not find todo for this id." });
});
router.delete('/todo/:todoId', (req, res, next) => {
    const toDoId = req.params.todoId;
    todos = todos.filter(todoId => todoId.id !== toDoId);
    res.status(200).json({ message: 'Deleted todo', todos: todos });
});
exports.default = router;
