import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  LayoutGrid,
  Users,
  Search,
  Filter,
  MoreVertical,
  Calendar,
  BarChart3,
  FolderOpen,
  UserCircle2,
  LogOut,
  MessageCircle,
  Inbox,
} from "lucide-react";
import PageBackground from "../components/ui/PageBackground";

export default function AdminDashboard() {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("/api/projects", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        const projs = data.projects || [];
        setProjects(projs);
        setFilteredProjects(projs);
      });
  }, []);

  useEffect(() => {
    let filtered = [...projects];

    // Apply status filter
    if (filterStatus !== "all") {
      filtered = filtered.filter((p) => {
        if (filterStatus === "pending") return p.status === "New" || !p.status;
        if (filterStatus === "active") return p.status === "Active";
        if (filterStatus === "completed") return p.status === "Completed";
        return true;
      });
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.projectName?.toLowerCase().includes(query) ||
          p.clientName?.toLowerCase().includes(query) ||
          p.description?.toLowerCase().includes(query)
      );
    }

    setFilteredProjects(filtered);
  }, [projects, filterStatus, searchQuery]);

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (e) {
      /* ignore */
    }
    navigate("/");
  };

  const stats = [
    {
      label: "Total Projects",
      value: projects.length,
    },
    {
      label: "Team Members",
      value: new Set(
        projects.flatMap((p) =>
          (p.assignees || []).map((a) => a._id || a)
        )
      ).size,
    },
    {
      label: "Completed",
      value: projects.filter((p) => p.status === "Completed").length,
    },
    {
      label: "In Progress",
      value: projects.filter((p) => p.status === "Active").length,
    },
  ];

  return (
    <PageBackground variant="violet">
      <div className="mx-auto min-h-screen w-full max-w-7xl px-6 pb-20 pt-10 text-white">
        {/* Top Navigation */}
        <header className="mb-8 flex flex-col gap-6 border-b border-white/10 pb-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.6em] text-slate-300">
              Admin dashboard
            </p>
            <h1 className="mt-2 text-4xl font-bold">Welcome back, Admin</h1>
            <p className="text-sm text-slate-300">Here's what's happening with your projects today</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search projects..."
                className="input-field w-64 pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button
              className="btn-ghost rounded-lg p-2"
              onClick={() => navigate("/admin/employees")}
            >
              <Users className="h-5 w-5" />
            </button>
            <button
              className="btn-ghost rounded-lg p-2"
              onClick={() => navigate("/admin/messages")}
            >
              <MessageCircle className="h-5 w-5" />
            </button>
            <button
              className="btn-ghost rounded-lg p-2"
              onClick={() => navigate("/admin/requests")}
            >
              <Inbox className="h-5 w-5" />
            </button>
            <button className="btn-ghost rounded-lg p-2">
              <UserCircle2 className="h-6 w-6" />
            </button>
            <button className="btn-ghost rounded-lg p-2" onClick={logout}>
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className="glass-card p-6 transition-shadow hover:border-white/20"
            >
              <div className="mb-4">
                <span className="text-sm font-medium text-slate-300">{stat.label}</span>
              </div>
              <div className="text-3xl font-bold text-white">{stat.value}</div>
            </div>
          ))}
        </div>

        {/* Projects Section */}
        <div className="rounded-[32px] border border-white/10 bg-white/5">
          <div className="border-b border-white/10 p-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.6em] text-slate-300">
                  Project portfolio
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-white">Active Projects</h2>
                <p className="mt-1 text-sm text-slate-300">Manage and track your ongoing work</p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 p-1">
                  <button
                    className={`px-3 py-1 text-sm transition-colors ${
                      filterStatus === "all"
                        ? "rounded bg-indigo-500/20 text-white"
                        : "text-slate-300 hover:text-white"
                    }`}
                    onClick={() => setFilterStatus("all")}
                  >
                    All
                  </button>
                  <button
                    className={`px-3 py-1 text-sm transition-colors ${
                      filterStatus === "pending"
                        ? "rounded bg-indigo-500/20 text-white"
                        : "text-slate-300 hover:text-white"
                    }`}
                    onClick={() => setFilterStatus("pending")}
                  >
                    Pending
                  </button>
                  <button
                    className={`px-3 py-1 text-sm transition-colors ${
                      filterStatus === "active"
                        ? "rounded bg-indigo-500/20 text-white"
                        : "text-slate-300 hover:text-white"
                    }`}
                    onClick={() => setFilterStatus("active")}
                  >
                    Active
                  </button>
                  <button
                    className={`px-3 py-1 text-sm transition-colors ${
                      filterStatus === "completed"
                        ? "rounded bg-indigo-500/20 text-white"
                        : "text-slate-300 hover:text-white"
                    }`}
                    onClick={() => setFilterStatus("completed")}
                  >
                    Completed
                  </button>
                </div>
                <button className="btn-primary flex items-center gap-2 px-4 py-2 text-sm">
                  + New Project
                </button>
              </div>
            </div>
          </div>

          {/* Project List */}
          <div className="divide-y divide-white/10">
            {filteredProjects.length === 0 && (
              <div className="p-10 text-center text-slate-300">
                {projects.length === 0
                  ? "No projects yet. Create your first project to get started."
                  : "No projects match your filters."}
              </div>
            )}
            {filteredProjects.map((project) => (
              <div
                key={project._id}
                className="p-6 transition-colors hover:bg-white/5"
              >
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-500/20">
                      <FolderOpen className="h-6 w-6 text-indigo-300" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">{project.projectName}</h3>
                      <p className="text-sm text-slate-300">{project.clientName}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      className="btn-ghost rounded-lg px-3 py-1 text-sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedProject(project);
                        setShowDetailsModal(true);
                      }}
                    >
                      View Details
                    </button>
                    <button
                      className="rounded-lg p-2 hover:bg-white/10"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/admin/project/${project._id}`);
                      }}
                    >
                      <MoreVertical className="h-5 w-5 text-slate-400" />
                    </button>
                  </div>
                </div>

                <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-4">
                  <div className="flex items-center gap-2">
                    <span
                      className={`h-2 w-2 rounded-full ${
                        project.status === "Active"
                          ? "bg-blue-400"
                          : project.status === "Completed"
                            ? "bg-emerald-400"
                            : "bg-slate-400"
                      }`}
                    ></span>
                    <span className="text-sm text-slate-300">{project.status}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-slate-400" />
                    <span className="text-sm text-slate-300">
                      {project.assignees?.length || 0} members
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-slate-400" />
                    <span className="text-sm text-slate-300">
                      {project.startDate
                        ? new Date(project.startDate).toLocaleDateString()
                        : "No date"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BarChart3 className="h-4 w-4 text-slate-400" />
                    <span className="text-sm text-slate-300">
                      {project.estimatedHoursTaken || 0}h logged
                    </span>
                  </div>
                </div>

                <div className="text-sm text-slate-300">
                  {project.description || "No description"}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Project Details Modal */}
      {showDetailsModal && selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-8 backdrop-blur-md">
          <div className="glass-panel relative w-full max-w-3xl rounded-[32px] px-8 py-8">
            <button
              onClick={() => {
                setShowDetailsModal(false);
                setSelectedProject(null);
              }}
              className="absolute right-6 top-6 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10"
            >
              Close
            </button>
            <div className="space-y-6">
              <div>
                <p className="text-xs uppercase tracking-[0.6em] text-slate-300">Project Details</p>
                <h2 className="mt-2 text-3xl font-bold text-white">{selectedProject.projectName}</h2>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <p className="text-sm text-slate-300">Client Name</p>
                  <p className="mt-1 text-white">{selectedProject.clientName || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-300">Client Email</p>
                  <p className="mt-1 text-white">{selectedProject.clientEmail || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-300">Status</p>
                  <p className="mt-1 text-white">{selectedProject.status || "New"}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-300">Priority</p>
                  <p className="mt-1 text-white">{selectedProject.priority || "Normal"}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-300">Start Date</p>
                  <p className="mt-1 text-white">
                    {selectedProject.startDate
                      ? new Date(selectedProject.startDate).toLocaleDateString()
                      : "Not set"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-300">End Date</p>
                  <p className="mt-1 text-white">
                    {selectedProject.endDate
                      ? new Date(selectedProject.endDate).toLocaleDateString()
                      : "Not set"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-300">Estimated Hours</p>
                  <p className="mt-1 text-white">
                    {selectedProject.estimatedHoursRequired || 0}h
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-300">Hours Logged</p>
                  <p className="mt-1 text-white">
                    {selectedProject.estimatedHoursTaken || 0}h
                  </p>
                </div>
              </div>

              <div>
                <p className="text-sm text-slate-300">Description</p>
                <p className="mt-2 text-white">{selectedProject.description || "No description"}</p>
              </div>

              <div>
                <p className="text-sm text-slate-300 mb-2">Assigned Employees</p>
                <div className="flex flex-wrap gap-2">
                  {selectedProject.assignees && selectedProject.assignees.length > 0 ? (
                    selectedProject.assignees.map((assignee, idx) => (
                      <span
                        key={idx}
                        className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-white"
                      >
                        {assignee.name || assignee.email}
                      </span>
                    ))
                  ) : (
                    <span className="text-slate-400">No employees assigned</span>
                  )}
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  className="btn-primary flex-1"
                  onClick={() => {
                    setShowDetailsModal(false);
                    navigate(`/admin/project/${selectedProject._id}`);
                  }}
                >
                  Edit Project
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </PageBackground>
  );
}