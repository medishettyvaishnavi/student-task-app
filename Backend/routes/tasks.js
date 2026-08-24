import express from "express";
import Task from "../models/Task.js";

const router = express.Router();

// Get all tasks for a user
router.get("/:userId", async (req, res) => {
  try {
    const tasks = await Task.find({
      user: req.params.userId,
    }).sort({ dueDate: 1 });

    res.json(tasks);
  } catch (error) {
    console.error("Get tasks error:", error);
    res.status(500).json({
      message: "Failed to fetch tasks",
    });
  }
});

// Create a task
router.post("/", async (req, res) => {
  try {
    const { title, description, dueDate, priority, userId } = req.body;

    if (!title || !dueDate || !userId) {
      return res.status(400).json({
        message: "Title, due date and user are required",
      });
    }

    const task = await Task.create({
      title,
      description,
      dueDate,
      priority,
      user: userId,
    });

    res.status(201).json(task);
  } catch (error) {
    console.error("Create task error:", error);
    res.status(500).json({
      message: "Failed to create task",
    });
  }
});

// Update a task
router.put("/:id", async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    res.json(task);
  } catch (error) {
    console.error("Update task error:", error);
    res.status(500).json({
      message: "Failed to update task",
    });
  }
});

// Delete a task
router.delete("/:id", async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    res.json({
      message: "Task deleted successfully",
    });
  } catch (error) {
    console.error("Delete task error:", error);
    res.status(500).json({
      message: "Failed to delete task",
    });
  }
});

export default router;