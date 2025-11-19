import express from "express";
import Progress from "../models/progress.js";
import Project from "../models/project.js";
import { authenticateToken } from "../middlewares/auth.js";
import mongoose from "mongoose";

const router = express.Router();

// Get all progress reports by employee ID (admin only)
router.get("/employee/:employeeId", authenticateToken, async (req, res) => {
  try {
    if (!Array.isArray(req.user.roles) || !req.user.roles.includes("admin")) {
      return res.status(403).json({ error: "Forbidden" });
    }

    const { employeeId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(employeeId)) {
      return res.status(400).json({ error: "Invalid employee ID" });
    }

    const progress = await Progress.find({ employee: employeeId })
      .populate("project", "projectName clientName status")
      .populate("employee", "name email")
      .sort({ date: -1 });

    res.json({ progress });
  } catch (err) {
    console.error("Error fetching employee progress:", err);
    res.status(500).json({ error: "Failed to fetch employee progress" });
  }
});

// Get all progress reports for a project
router.get("/:projectId", authenticateToken, async (req, res) => {
  const { projectId } = req.params;

  // Validate projectId is a valid ObjectId
  if (!mongoose.Types.ObjectId.isValid(projectId)) {
    return res.status(400).json({ error: "Invalid projectId" });
  }

  try {
    console.log(`GET /api/progress/${projectId} by user=${req.user?.email || "anonymous"}`);
    const progress = await Progress.find({ project: projectId })
      .populate("employee", "name email")
      .sort({ date: -1 });
    res.json({ progress });
  } catch (err) {
    console.error("Error fetching progress:", err);
    res.status(500).json({ error: "Failed to fetch progress" });
  }
});

// Add a progress report to a project
router.post("/:projectId", authenticateToken, async (req, res) => {
  const { projectId } = req.params;
  const { text, completionPercentage } = req.body;

  if (!mongoose.Types.ObjectId.isValid(projectId)) {
    return res.status(400).json({ error: "Invalid projectId" });
  }

  if (!text || typeof text !== "string" || !text.trim()) {
    return res.status(400).json({ error: "Report 'text' is required and must be a non-empty string" });
  }

  if (!req.user || !req.user.userId) {
    return res.status(401).json({ error: "Unauthorized: User ID missing in token" });
  }

  try {
    console.log(`POST /api/progress/${projectId} by user=${req.user.email}`);

    const report = new Progress({
      project: projectId,
      employee: req.user.userId,
      text: text.trim(),
      date: new Date(),
    });

    await report.save();

    // Update project completion percentage if provided
    if (completionPercentage !== undefined && completionPercentage !== null) {
      const percentage = Math.max(0, Math.min(100, Number(completionPercentage)));
      const updateData = { completionPercentage: percentage };
      
      // Auto-set status based on percentage
      if (percentage === 100) {
        updateData.status = "Completed";
      } else if (percentage > 0) {
        // If percentage is between 1-99%, set to "Active" (or keep current if already active)
        // Only change if it was "Completed" before
        const currentProject = await Project.findById(projectId);
        if (currentProject && currentProject.status === "Completed") {
          updateData.status = "Active";
        }
      } else {
        // If percentage is 0%, set to "New"
        updateData.status = "New";
      }
      
      await Project.findByIdAndUpdate(projectId, updateData);
    }

    res.json({ success: true, progress: report });
  } catch (err) {
    console.error("Error saving progress report:", err);
    res.status(500).json({ error: "Failed to save progress report" });
  }
});

export default router;
