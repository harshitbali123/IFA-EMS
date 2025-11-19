import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Calendar, LinkIcon } from "lucide-react";
import PageBackground from "../components/ui/PageBackground";

const statusOptions = [
  "Completed",
  "Cancelled",
  "Active",
  "Recontacted",
  "Training",
  "Requirements Sent",
  "Stalled",
  "Awaiting Testimonial",
  "Contact Made",
  "Client Meeting Done",
  "Waiting for Requirement",
  "New",
];

export default function AdminProjectEdit() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [form, setForm] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`/api/projects`, { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        const proj = (data.projects || []).find((x) => x._id === id);
        if (proj) {
          setProject(proj);
          setForm({
            status: proj.status || "",
            clientType: proj.clientType || "",
            priority: proj.priority || "",
            projectType: proj.projectType || "",
            estimatedHoursRequired: proj.estimatedHoursRequired || "",
            estimatedHoursTaken: proj.estimatedHoursTaken || "",
            completionPercentage: proj.completionPercentage || 0,
            startDate: proj.startDate?.slice(0, 10) || "",
            endDate: proj.endDate?.slice(0, 10) || "",
            assignees: proj.assignees?.map((a) => a._id) || [],
            leadAssignee: proj.leadAssignee?._id || "",
            vaIncharge: proj.vaIncharge || "",
            freelancer: proj.freelancer || "",
            updateIncharge: proj.updateIncharge || "",
            codersRecommendation: proj.codersRecommendation || "",
            leadership: proj.leadership || "",
            githubLinks: proj.githubLinks || "",
            loomLink: proj.loomLink || "",
            whatsappGroupLink: proj.whatsappGroupLink || "",
          });
        }
      });
    fetch("/api/users/employees", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => setEmployees(data.employees || []));
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ 
      ...form, 
      [name]: name === "completionPercentage" ? Number(value) : value 
    });
  };
  const handleMultiChange = (e) =>
    setForm({
      ...form,
      assignees: Array.from(e.target.selectedOptions).map((o) => o.value),
    });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const resp = await fetch(`/api/projects/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(form),
    });
    if (resp.ok) {
      navigate("/admin");
    } else {
      alert("Update failed");
    }
  };

  if (!project)
    return (
      <PageBackground variant="violet">
        <div className="flex min-h-screen items-center justify-center text-white">
          Loading project...
        </div>
      </PageBackground>
    );

  return (
    <PageBackground variant="violet">
      <div className="mx-auto w-full max-w-5xl px-6 pb-16 pt-10">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-300 hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </button>
        <header className="glass-panel rounded-[32px] px-8 py-10 text-white">
          <p className="text-xs uppercase tracking-[0.5em] text-slate-300">
            Edit project
          </p>
          <h1 className="mt-2 text-4xl font-bold">{project.projectName}</h1>
          <div className="mt-3 flex flex-wrap gap-4 text-sm text-slate-300">
            <span>{project.clientName}</span>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2">
              <Calendar className="h-4 w-4" />
              {form.startDate || "Start date"}
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2">
              <Calendar className="h-4 w-4" />
              {form.endDate || "End date"}
            </span>
          </div>
          <p className="mt-3 text-sm text-slate-300">{project.description}</p>
        </header>

        <form
          onSubmit={handleSubmit}
          className="glass-panel mt-10 rounded-[32px] px-8 py-10 text-white"
        >
          <div className="grid gap-6 md:grid-cols-2">
            <Field label="Status">
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="input-field bg-white/10"
              >
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Client type">
              <select
                name="clientType"
                value={form.clientType}
                onChange={handleChange}
                className="input-field bg-white/10"
              >
                <option value="New">New</option>
                <option value="Existing">Existing</option>
              </select>
            </Field>
            <Field label="Priority">
              <select
                name="priority"
                value={form.priority}
                onChange={handleChange}
                className="input-field bg-white/10"
              >
                <option value="High">High</option>
                <option value="Normal">Normal</option>
                <option value="Low">Low</option>
              </select>
            </Field>
            <Field label="Project type">
              <select
                name="projectType"
                value={form.projectType}
                onChange={handleChange}
                className="input-field bg-white/10"
              >
                <option value="Client">Client</option>
                <option value="Research">Research</option>
                <option value="Management">Management</option>
                <option value="Training">Training</option>
              </select>
            </Field>
            <Field label="VA Incharge">
              <input
                name="vaIncharge"
                value={form.vaIncharge}
                onChange={handleChange}
                className="input-field"
              />
            </Field>
            <Field label="Freelancer">
              <input
                name="freelancer"
                value={form.freelancer}
                onChange={handleChange}
                className="input-field"
              />
            </Field>
            <Field label="Update Incharge">
              <input
                name="updateIncharge"
                value={form.updateIncharge}
                onChange={handleChange}
                className="input-field"
              />
            </Field>
            <Field label="Estimated hours required">
              <input
                type="number"
                name="estimatedHoursRequired"
                value={form.estimatedHoursRequired}
                onChange={handleChange}
                className="input-field"
              />
            </Field>
            <Field label="Estimated hours taken">
              <input
                type="number"
                name="estimatedHoursTaken"
                value={form.estimatedHoursTaken}
                onChange={handleChange}
                className="input-field"
              />
            </Field>
            <Field label="Completion Percentage">
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm text-slate-300">Progress</span>
                  <span className="text-lg font-bold text-indigo-300">
                    {form.completionPercentage || 0}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="1"
                  name="completionPercentage"
                  value={form.completionPercentage || 0}
                  onChange={handleChange}
                  className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-white/10 accent-indigo-500"
                  style={{
                    background: `linear-gradient(to right, rgb(99, 102, 241) 0%, rgb(99, 102, 241) ${form.completionPercentage || 0}%, rgba(255, 255, 255, 0.1) ${form.completionPercentage || 0}%, rgba(255, 255, 255, 0.1) 100%)`
                  }}
                />
                <div className="mt-2 flex justify-between text-xs text-slate-400">
                  <span>0%</span>
                  <span>25%</span>
                  <span>50%</span>
                  <span>75%</span>
                  <span>100%</span>
                </div>
                <input
                  type="number"
                  min="0"
                  max="100"
                  name="completionPercentage"
                  value={form.completionPercentage || 0}
                  onChange={handleChange}
                  className="input-field mt-3"
                  placeholder="Or enter percentage directly"
                />
              </div>
            </Field>
            <Field label="Start Date">
              <input
                type="date"
                name="startDate"
                value={form.startDate}
                onChange={handleChange}
                className="input-field"
              />
            </Field>
            <Field label="End Date">
              <input
                type="date"
                name="endDate"
                value={form.endDate}
                onChange={handleChange}
                className="input-field"
              />
            </Field>
            <Field label="Coders Recommendation">
              <input
                name="codersRecommendation"
                value={form.codersRecommendation}
                onChange={handleChange}
                className="input-field"
              />
            </Field>
            <Field label="Leadership Notes">
              <input
                name="leadership"
                value={form.leadership}
                onChange={handleChange}
                className="input-field"
              />
            </Field>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-[1.6fr,1fr]">
            <Field label="Assignees">
              <select
                name="assignees"
                multiple
                value={form.assignees || []}
                onChange={handleMultiChange}
                className="input-field min-h-[160px]"
              >
                {employees.map((employee) => (
                  <option key={employee._id} value={employee._id}>
                    {employee.name} ({employee.email})
                  </option>
                ))}
              </select>
              <p className="mt-2 text-xs text-slate-400">
                Tip: Hold Ctrl/Cmd to select multiple teammates.
              </p>
            </Field>
            <Field label="Lead Assignee">
              <select
                name="leadAssignee"
                value={form.leadAssignee}
                onChange={handleChange}
                className="input-field"
              >
                <option value="">Select</option>
                {employees.map((employee) => (
                  <option key={employee._id} value={employee._id}>
                    {employee.name} ({employee.email})
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            <Field label="GitHub links">
              <div className="flex items-center gap-2">
                <LinkIcon className="h-4 w-4 text-slate-400" />
                <input
                  name="githubLinks"
                  value={form.githubLinks}
                  onChange={handleChange}
                  className="input-field"
                />
              </div>
            </Field>
            <Field label="Loom link">
              <input
                name="loomLink"
                value={form.loomLink}
                onChange={handleChange}
                className="input-field"
              />
            </Field>
            <Field label="WhatsApp group link">
              <input
                name="whatsappGroupLink"
                value={form.whatsappGroupLink}
                onChange={handleChange}
                className="input-field"
              />
            </Field>
          </div>

          <div className="mt-12 flex justify-center">
            <button type="submit" className="btn-primary w-full justify-center md:w-auto">
              Save changes
            </button>
          </div>
        </form>
      </div>
    </PageBackground>
  );
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="text-sm font-semibold uppercase tracking-[0.4em] text-slate-400">
        {label}
      </span>
      <div className="mt-3">{children}</div>
    </label>
  );
}
