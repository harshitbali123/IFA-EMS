import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Users, ArrowLeft, Search, UserCircle2 } from "lucide-react";
import PageBackground from "../components/ui/PageBackground";

export default function AdminEmployeesPage() {
  const [employees, setEmployees] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetch("/api/users/employees", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => setEmployees(data.employees || []));
  }, []);

  const filteredEmployees = employees.filter((emp) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      emp.name?.toLowerCase().includes(query) ||
      emp.email?.toLowerCase().includes(query)
    );
  });

  return (
    <PageBackground variant="violet">
      <div className="mx-auto min-h-screen w-full max-w-6xl px-6 pb-20 pt-10 text-white">
        <header className="mb-8 flex flex-col gap-6 border-b border-white/10 pb-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <button
              onClick={() => navigate("/admin")}
              className="mb-4 flex items-center gap-2 text-sm text-slate-300 hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </button>
            <p className="text-xs uppercase tracking-[0.6em] text-slate-300">
              Team management
            </p>
            <h1 className="mt-2 text-4xl font-bold">Approved Employees</h1>
            <p className="text-sm text-slate-300">
              View and manage your team members
            </p>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search employees..."
              className="input-field w-64 pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </header>

        <div className="rounded-[32px] border border-white/10 bg-white/5">
          <div className="divide-y divide-white/10">
            {filteredEmployees.length === 0 ? (
              <div className="p-10 text-center text-slate-300">
                {employees.length === 0
                  ? "No approved employees yet."
                  : "No employees match your search."}
              </div>
            ) : (
              filteredEmployees.map((employee) => (
                <div
                  key={employee._id}
                  className="cursor-pointer p-6 transition-colors hover:bg-white/5"
                  onClick={() => navigate(`/admin/employee/${employee._id}`)}
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-500/20">
                      <UserCircle2 className="h-6 w-6 text-indigo-300" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-white">
                        {employee.name || "Unnamed Employee"}
                      </h3>
                      <p className="text-sm text-slate-300">{employee.email}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="rounded-full border border-emerald-500/30 bg-emerald-500/20 px-3 py-1 text-xs text-emerald-300">
                        Approved
                      </span>
                      <Users className="h-5 w-5 text-slate-400" />
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </PageBackground>
  );
}

