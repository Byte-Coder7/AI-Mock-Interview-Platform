import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Award,
  FileText,
  Calendar,
  PlayCircle,
  Sparkles,
  Zap,
} from "lucide-react";

import DashboardLayout from "../Layouts/DashboardLayout";
import StatCard from "../Components/StatCard";
import { getResumeHistory } from "../services/resumeService";
import { getInterviewHistory } from "../services/interviewService";

const Dashboard = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [resumes, setResumes] = useState([]);
  const [interviews, setInterviews] = useState([]);
  const [error, setError] = useState("");

  const [recentResumes, setRecentResumes] = useState([]);
  const [recentInterviews, setRecentInterviews] = useState([]);

  const totalInterviews = interviews.length;
  const uploadedResumes = resumes.length;

  const averageScorePercent = useMemo(() => {
    const scores = interviews
      .map((i) => i?.score ?? i?.data?.score)
      .filter((s) => s !== null && s !== undefined && s !== "");

    if (!scores.length) return 0;

    const sum = scores.reduce((acc, s) => acc + Number(s), 0);
    const avg = sum / scores.length;

    if (!Number.isFinite(avg)) return 0;
    return Math.round(avg * 100) / 100; // keep numeric; displayed with % below
  }, [interviews]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const [resumeData, interviewData] = await Promise.all([
          getResumeHistory(),
          getInterviewHistory(),
        ]);

        const allResumes = Array.isArray(resumeData)
          ? resumeData
          : resumeData?.resumes ?? [];
        const allInterviews = Array.isArray(interviewData)
          ? interviewData
          : interviewData?.interviews ?? [];

        setResumes(allResumes);
        setInterviews(allInterviews);

        setRecentResumes((allResumes || []).slice(0, 3));
        setRecentInterviews((allInterviews || []).slice(0, 3));
      } catch (e) {
        setError("Failed to load dashboard data.");
        setResumes([]);
        setInterviews([]);
        setRecentResumes([]);
        setRecentInterviews([]);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const avgScoreValue = `${Math.round(averageScorePercent)}%`;

  const scoreStr = loading
    ? "—"
    : interviews.length
      ? avgScoreValue
      : "0%";

  return (
    <DashboardLayout>
      {/* Hero banner */}
      <section className="mt-1 rounded-2xl bg-gradient-to-r from-indigo-600 via-blue-600 to-sky-500 p-6 sm:p-7 text-white shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-sm font-semibold text-white/90">
              <Sparkles className="w-4 h-4" />
              Welcome Back
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold mt-2">
              Ready for your next interview?
            </h1>
            <p className="text-white/85 mt-2 max-w-2xl">
              Track your resume uploads, review recent interviews, and start your next mock session in seconds.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate("/interview")}
              className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2 text-sm font-semibold border border-white/20 hover:bg-white/15 transition"
            >
              <PlayCircle className="w-4 h-4" />
              Start Interview
            </button>
          </div>
        </div>
      </section>

      {/* Stat cards */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        {loading ? (
          <>
            <StatCard title="Total Interviews" value="—" icon={Calendar} color="blue" />
            <StatCard title="Average Score" value="—" icon={Award} color="purple" />
            <StatCard title="Uploaded Resumes" value="—" icon={FileText} color="green" />
          </>
        ) : (
          <>
            <StatCard
              title="Total Interviews"
              value={String(totalInterviews)}
              icon={Calendar}
              color="blue"
            />
            <StatCard
              title="Average Score"
              value={scoreStr}
              icon={Award}
              color="purple"
            />
            <StatCard
              title="Uploaded Resumes"
              value={String(uploadedResumes)}
              icon={FileText}
              color="green"
            />
          </>
        )}
      </div>

      {error ? (
        <div className="mt-3 text-sm text-red-600 font-medium">{error}</div>
      ) : null}

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Quick Actions */}
        <div className="lg:col-span-1 bg-white/80 backdrop-blur rounded-2xl shadow-sm border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-gray-700">Quick Actions</h2>
            <Zap className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="flex flex-col gap-3">
            <button
              type="button"
              onClick={() => navigate("/interview")}
              className="w-full rounded-xl bg-blue-600 px-4 py-2 text-white font-semibold hover:bg-blue-700 transition transform hover:-translate-y-0.5"
            >
              Start Interview
            </button>
            <button
              type="button"
              onClick={() => navigate("/resume")}
              className="w-full rounded-xl bg-gray-50 px-4 py-2 text-gray-800 font-semibold hover:bg-gray-100 border border-gray-100 transition transform hover:-translate-y-0.5"
            >
              Upload Resume
            </button>
          </div>
        </div>

        {/* Recent Interviews */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-gray-700">Recent Interviews</h2>
            <div className="text-xs text-gray-500">
              Latest {recentInterviews.length ? Math.min(3, recentInterviews.length) : 0}
            </div>
          </div>

          <div className="overflow-x-auto">
            <ul className="divide-y divide-gray-100">
              {recentInterviews.length === 0 ? (
                <li className="py-8">
                  <div className="flex flex-col items-center text-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                      <Calendar className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">
                        No interviews found
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        Start a mock interview to see scores here.
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => navigate("/interview")}
                      className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 text-white px-4 py-2 text-sm font-semibold hover:bg-indigo-700 transition transform hover:-translate-y-0.5"
                    >
                      <PlayCircle className="w-4 h-4" />
                      Start Interview
                    </button>
                  </div>
                </li>
              ) : (
                recentInterviews.map((item, idx) => {
                  const role = item.role ?? item?.data?.role ?? "-";
                  const status = item.status ?? item?.data?.status ?? "-";
                  const score = item.score ?? item?.data?.score ?? "-";
                  const createdAt = item.createdAt ?? item?.data?.createdAt ?? item?.date ?? "-";

                  return (
                    <li
                      key={item._id || item.id || idx}
                      className="py-4 flex items-center justify-between"
                    >
                      <div className="flex items-start gap-3 min-w-0">
                        <div className="mt-0.5 w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                          <Award className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <div className="font-semibold text-gray-900 truncate">
                            {role}
                          </div>
                          <div className="text-sm text-gray-500 mt-1">
                            {status !== "-" ? status : "—"} • {createdAt !== "-" ? createdAt : "—"}
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-1">
                        <span className="text-sm text-gray-500">Score</span>
                        <span className="font-bold text-gray-900">
                          {score !== "-" && score !== null && score !== undefined
                            ? `${score}%`
                            : "-"}
                        </span>
                      </div>
                    </li>
                  );
                })
              )}
            </ul>
          </div>
        </div>
      </div>

      {/* Recent Resumes */}
      <div className="mt-4 bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-gray-700">
            Recent Resumes
          </h2>
          <div className="text-xs text-gray-500">
            {recentResumes.length ? `Latest ${Math.min(3, recentResumes.length)}` : "—"}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          {recentResumes.length === 0 ? (
            <div className="py-6 text-center text-sm text-gray-600">
              No resumes uploaded yet
            </div>
          ) : (
            recentResumes.map((item, idx) => {
              const fileName =
                item.fileName ??
                item?.data?.fileName ??
                item?.filename ??
                item?.name ??
                `Resume ${idx + 1}`;
              const status = item.status ?? item?.data?.status ?? "-";
              const createdAt =
                item.createdAt ?? item?.data?.createdAt ?? item?.date ?? "-";

              const statusLabel =
                status !== "-" && status !== null && status !== undefined
                  ? status
                  : "Uploaded";

              const badgeClass =
                statusLabel.toLowerCase().includes("processed")
                  ? "bg-green-50 text-green-700 ring-green-200"
                  : statusLabel.toLowerCase().includes("upload")
                    ? "bg-indigo-50 text-indigo-700 ring-indigo-200"
                    : statusLabel.toLowerCase().includes("failed")
                      ? "bg-red-50 text-red-700 ring-red-200"
                      : "bg-gray-50 text-gray-700 ring-gray-200";

              return (
                <div
                  key={item._id || item.id || fileName || idx}
                  className="flex items-center justify-between rounded-xl bg-gray-50 hover:bg-white transition border border-gray-100 px-4 py-3"
                >
                  <div className="min-w-0 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="font-medium text-gray-900 truncate">
                        {fileName}
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        {createdAt !== "-" ? createdAt : "—"}
                      </div>
                    </div>
                  </div>

                  <div
                    className={[
                      "inline-flex items-center rounded-lg px-3 py-1 text-xs font-semibold ring-1",
                      badgeClass,
                    ].join(" ")}
                  >
                    {statusLabel}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;



