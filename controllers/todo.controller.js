import Todo from "../models/todo.model.js";
import mongoose from "mongoose";
import { asyncHandler } from "../middlewares/asyncHandler.js";

// Create Todo Post API
export const createTodo = asyncHandler(async (req, res) => {
        const { title, description } = req.body;

        // Validation
        if ( !title || title.trim() === "" ) {
            return res.status(400).json({
                success: false,
                message: "Title is required",
            });
        }

        const todo = await Todo.create({
            title,
            description,
        })

        return res.status(201).json({
            success: true,
            message: "Todo created successfully",
            todo,
        });
});

// Get all Todo Get API
export const getTodos = asyncHandler(async (req, res) => {
        // Query Param
        const {search, sort, page=1, limit=10} = req.query;

        // Base Query
        let query = {};

        // Search by title
        if (search) {
            query.title = { $regex: search, $options: "i" };
        }

        // Sorting
        let sortOption = {};
        if (sort === "asc") sortOption.createdAt = 1;
        else sortOption.createdAt = -1;

        // Pagination
        const skip = (page - 1) * limit;

        const todos = await Todo.find(query)
            .sort(sortOption)
            .skip(skip)
            .limit(parseInt(limit));

        const totalTodos = await Todo.countDocuments(query);

        return res.status(200).json({
            success: true,
            message: "Todos fetched successfully",
            total: totalTodos,
            page: Number(page),
            limit: Number(limit),
            data: todos,
        });    
});

// Get Todo by ID Get API
export const getTodoById = asyncHandler(async (req, res) => {
        const { id } = req.params;

        // Validate ID based on mongoose
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid Todo ID",
            });
        }

        const todo = await Todo.findById(id);

        // If todo not found
        if (!todo) {
            return res.status(404).json({
                success: false,
                message: "Todo not found",
            });
        }

        // If todo found
        return res.status(200).json({
            success: true,
            message: "Todo fetched successfully",
            data: todo,
        });
});

// Update Todo by ID Put API
export const updateTodo = asyncHandler(async (req, res) => {
    const { id } = req.params;
        const { title, description } = req.body;

        // Validate ID based on mongoose
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid Todo ID",
            });
        }

        // Valid Input
        if ( !title && title.trim() === "" ) {
            return res.status(400).json({
                success: false,
                message: "Title is required",
            });
        }

        // Update todo
        const todo = await Todo.findByIdAndUpdate(
            id,
            { title, description }, 
            { new: true, runValidators: true }
        );

        // If todo not found
        if (!todo) {
            return res.status(404).json({
                success: false,
                message: "Todo not found",
            });
        }

        // If todo found and updated
        return res.status(200).json({
            success: true,
            message: "Todo updated successfully",
            data: todo,
        });
});

// Toggle Todo by ID Patch API
export const toggleTodo = asyncHandler(async (req, res) => {
        const { id } = req.params;

        // Validate ID based on mongoose
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid Todo ID",
            });
        }

        // Get current todo
        const todo = await Todo.findById(id);

        // If todo not found
        if (!todo) {
            return res.status(404).json({
                success: false,
                message: "Todo not found",
            });
        }

        // Flip isCompleted field
        todo.isCompleted = !todo.isCompleted;
        await todo.save();

        // If todo found and updated
        return res.status(200).json({
            success: true,
            message: "Todo toggled successfully",
            data: todo,
        });
});

// Delete Todo by ID Delete API
export const deleteTodo = asyncHandler(async (req, res) => {
    const { id } = req.params;

        // Validate ID based on mongoose
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid Todo ID",
            });
        }

        // Find and delete todo
        const todo = await Todo.findByIdAndDelete(id);

        // If todo not found
        if (!todo) {
            return res.status(404).json({
                success: false,
                message: "Todo not found",
            });
        }

        // If todo found and deleted
        return res.status(200).json({
            success: true,
            message: "Todo deleted successfully",
            data: todo,
        });
});