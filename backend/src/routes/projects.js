import express from "express";
import Project from "../models/project.js";
import { authenticateToken } from "../middlewares/auth.js";
import mongoose from "mongoose";

const router = express.Router();

router.post("/", authenticateToken, async (req, res) => {
  try {
    const projectData = req.body;
    if (Array.isArray(req.user.roles) && req.user.roles.includes("client")) {
      projectData.clientEmail = req.user.email;
      projectData.clientName = projectData.clientName || "Client";
    }
    const project = new Project(projectData);
    await project.save();
    // populate user refs before returning
    const populated = await Project.findById(project._id)
      .populate("assignees", "name email")
      .populate("leadAssignee", "name email");
    res.status(201).json({ success: true, project: populated });
  } catch (err) {
    res.status(400).json({ error: "Failed to create project" });
  }
});

router.get("/", authenticateToken, async (req, res) => {
  try {
    const { roles, userId, email } = req.user;
    let filter = {};

    // Approval system removed

    if (Array.isArray(roles) && roles.includes("admin")) {
      // Admins see all projects
      filter = {};
    } else if (Array.isArray(roles) && roles.includes("client")) {
      filter = { clientEmail: email };
    } else if (Array.isArray(roles) && roles.includes("employee")) {
      // Only show projects where this employee is assigned
      let uid = userId;
      // Convert to string for comparison
      if (typeof uid !== "string") uid = String(uid);
      filter = {
        $or: [
          { assignees: uid },
          { leadAssignee: uid }
        ]
      };
    }

    const projects = await Project.find(filter)
      .populate("assignees", "name email")
      .populate("leadAssignee", "name email");

    res.json({ projects });

  } catch (err) {
    console.error("Error fetching projects:", err);
    res.status(500).json({ error: "Failed to fetch projects" });
  }
});

// Get projects by employee ID (admin only)
router.get("/employee/:employeeId", authenticateToken, async (req, res) => {
  try {
    if (!Array.isArray(req.user.roles) || !req.user.roles.includes("admin")) {
      return res.status(403).json({ error: "Forbidden" });
    }
    
    const { employeeId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(employeeId)) {
      return res.status(400).json({ error: "Invalid employee ID" });
    }

    const projects = await Project.find({
      $or: [
        { assignees: employeeId },
        { leadAssignee: employeeId }
      ]
    })
      .populate("assignees", "name email")
      .populate("leadAssignee", "name email")
      .sort({ createdAt: -1 });

    res.json({ projects });
  } catch (err) {
    console.error("Error fetching employee projects:", err);
    res.status(500).json({ error: "Failed to fetch employee projects" });
  }
});

// Update a project (admin only)
router.put("/:id", authenticateToken, async (req, res) => {
  try {
    if (!Array.isArray(req.user.roles) || !req.user.roles.includes("admin")) return res.status(403).json({ error: "Forbidden" });
    const proj = await Project.findById(req.params.id);
    if (!proj) return res.status(404).json({ error: "Project not found" });

    // Update allowed fields from request body
    const allowed = [
      "status",
      "clientType",
      "priority",
      "projectType",
      "estimatedHoursRequired",
      "estimatedHoursTaken",
      "completionPercentage",
      "startDate",
      "endDate",
      "assignees",
      "leadAssignee",
      "vaIncharge",
      "freelancer",
      "updateIncharge",
      "codersRecommendation",
      "leadership",
      "githubLinks",
      "loomLink",
      "whatsappGroupLink"
    ];

    allowed.forEach((key) => {
      if (req.body[key] !== undefined) {
        if (key === "assignees") {
          let newAssignees = req.body.assignees;
          // Accept single string, array, or empty
          if (!newAssignees) {
            proj.assignees = [];
          } else if (Array.isArray(newAssignees)) {
            proj.assignees = newAssignees.filter(Boolean).map(id => {
              try {
                return new mongoose.Types.ObjectId(id);
              } catch {
                return null;
              }
            }).filter(Boolean);
          } else {
            // Single string
            try {
              proj.assignees = [new mongoose.Types.ObjectId(newAssignees)];
            } catch {
              proj.assignees = [];
            }
          }
        } else if (key === "completionPercentage") {
          const percentage = Math.max(0, Math.min(100, Number(req.body[key])));
          proj[key] = percentage;
          // Auto-set status based on percentage
          if (percentage === 100) {
            proj.status = "Completed";
          } else if (percentage > 0) {
            // If percentage is between 1-99%, set to "Active" if it was "Completed"
            if (proj.status === "Completed") {
              proj.status = "Active";
            }
          } else {
            // If percentage is 0%, set to "New"
            proj.status = "New";
          }
        } else {
          proj[key] = req.body[key];
        }
      }
    });

    await proj.save();
    const populated = await Project.findById(proj._id)
      .populate("assignees", "name email")
      .populate("leadAssignee", "name email");
    res.json({ success: true, project: populated });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: "Failed to update project" });
  }
});

export default router;
