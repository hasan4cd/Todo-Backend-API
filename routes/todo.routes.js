import express from 'express';
import { createTodo, getTodos, getTodoById, updateTodo, toggleTodo, deleteTodo } from '../controllers/todo.controller.js';

const route = express.Router();

// Create Todo Post API
route.post('/add', createTodo);

// Get all Todos Get API
route.get('/', getTodos);

// Get single Todo by ID Get API
route.get('/:id', getTodoById);

// Update Todo by ID Put API
route.put('/:id', updateTodo);

// Toggle Todo by ID Patch API
route.patch('/:id/toggle', toggleTodo);

// Delete Todo by ID Delete API
route.delete('/:id', deleteTodo);

export default route;