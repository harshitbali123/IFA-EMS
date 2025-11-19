import React from "react";
import { useNavigate } from "react-router-dom";
import { Hourglass } from "lucide-react";
import PageBackground from "../components/ui/PageBackground";

export default function ApprovalPage() {
  const navigate = useNavigate();
  return (
    <PageBackground variant="violet">
      <div className="flex min-h-screen items-center justify-center px-6 py-20 text-white">
        <div className="glass-panel w-full max-w-xl rounded-[32px] px-10 py-12 text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-amber-300/40 bg-amber-400/10">
            <Hourglass className="h-10 w-10 text-amber-200" />
          </div>
          <p className="mt-6 text-xs uppercase tracking-[0.6em] text-slate-300">
            Request submitted
          </p>
          <h1 className="mt-3 text-3xl font-bold">Awaiting admin approval</h1>
          <p className="mt-3 text-base text-slate-200">
            Your employee access request is in review. You will be notified once the
            admin unlocks your dashboard.
          </p>
          <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200">
            Tip: You can close this tab—return once approved to access the workspace.
          </div>
          <button
            onClick={() => navigate("/")}
            className="btn-primary mt-8 inline-flex w-full justify-center"
          >
            Back to role selection
          </button>
        </div>
      </div>
    </PageBackground>
  );
}
