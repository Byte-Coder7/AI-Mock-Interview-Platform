import React, { useEffect, useMemo, useState } from "react";
import { Award, FileText, Sparkles, ClipboardCheck, CalendarDays } from "lucide-react";

import DashboardLayout from "../Layouts/DashboardLayout";
import { getInterviewHistory } from "../services/interviewService";

function formatDate(value) {
  if (!value) return "-";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return String(value);
  return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "2-digit" });
}

const getNumericScore = (item) => {
  const raw = item?.score ?? item?.data?.score;
  if (raw === null || raw === undefined || raw === "") return null;
  const n = Number(raw);
  return Number.isFinite(n) ? n : null;
};

const ReportPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [interviews, setInterviews] = useState([]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await getInterviewHistory();
        setInterviews(Array.isArray(res) ? res : []);
      } catch (e) {
        setError("Failed to load interview reports.");
        setInterviews([]);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const computed = useMemo(() => {
    const total = interviews.length;

    const scoreValues = interviews
      .map((i) => getNumericScore(i))
      .filter((s) => s !== null);

    const avg =
      scoreValues.length > 0
        ? scoreValues.reduce((a, b) => a + b, 0) / scoreValues.length
        : 0;

    const averageScore = `${Math.round(avg * 100) / 100}%`;

    const completedCount = interviews.filter((i) => {
      const status = (i?.status ?? i?.data?.status ?? "").toString().toLowerCase();
      return status.includes("completed") || status.includes("done") || status.includes("finished");
    }).length;

    return {
      total,
      averageScore,
      completedCount,
    };
  }, [interviews]);

  const scoreBadgeClass = (score) => {
    const n = typeof score === "number" ? score : Number(score);
    if (!Number.isFinite(n)) return "bg-gray-50 text-gray-700 ring-gray-200";

    if (n >= 80) return "bg-green-50 text-green-700 ring-green-200";
    if (n >= 60) return "bg-indigo-50 text-indigo-700 ring-indigo-200";
    return "bg-orange-50 text-orange-700 ring-orange-200";
  };

  const statusBadgeClass = (status) => {
    const s = String(status || "").toLowerCase();
    if (s.includes("completed") || s.includes("done") || s.includes("finished"))
      return "bg-green-50 text-green-700 ring-green-200";
    if (s.includes("failed") || s.includes("error"))
      return "bg-red-50 text-red-700 ring-red-200";
    if (s.includes("pending") || s.includes("in progress"))
      return "bg-indigo-50 text-indigo-700 ring-indigo-200";
    return "bg-gray-50 text-gray-700 ring-gray-200";
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        {/* Hero */}
        <section className="mt-1 rounded-2xl bg-gradient-to-r from-indigo-600 via-blue-600 to-sky-500 p-6 sm:p-7 text-white shadow-sm">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
            <div>
              <div className="inline-flex items-center gap-2 text-sm font-semibold text-white/90">
                <Sparkles className="w-4 h-4" />
                Interview Reports
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold mt-2">Interview Reports</h1>
              <p className="text-white/85 mt-2 max-w-2xl">
                Track your interview performance and progress
              </p>
            </div>
          </div>
        </section>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/90 backdrop-blur rounded-2xl shadow-sm border border-gray-100 p-5 hover:-translate-y-0.5 transition-transform">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-indigo-50 text-indigo-700 flex items-center justify-center ring-1 ring-indigo-100">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Interviews</p>
                <p className="text-2xl font-bold text-gray-900">{loading ? "—" : computed.total}</p>
              </div>
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur rounded-2xl shadow-sm border border-gray-100 p-5 hover:-translate-y-0.5 transition-transform">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center ring-1 ring-purple-100">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Average Score</p>
                <p className="text-2xl font-bold text-gray-900">{loading ? "—" : computed.averageScore}</p>
              </div>
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur rounded-2xl shadow-sm border border-gray-100 p-5 hover:-translate-y-0.5 transition-transform">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-green-50 text-green-700 flex items-center justify-center ring-1 ring-green-100">
                <ClipboardCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Completed Interviews</p>
                <p className="text-2xl font-bold text-gray-900">{loading ? "—" : computed.completedCount}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Report Cards */}
        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          {loading ? (
            <div className="py-10 text-center text-sm text-gray-500">Loading reports...</div>
          ) : error ? (
            <div className="py-4 text-sm text-red-600">{error}</div>
          ) : interviews.length === 0 ? (
            <div className="py-14 text-center">
              <div className="mx-auto w-14 h-14 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center">
                <CalendarDays className="w-7 h-7 text-gray-500" />
              </div>
              <p className="mt-4 text-sm font-semibold text-gray-900">
                No interview reports found
              </p>
              <p className="mt-2 text-sm text-gray-500">
                Upload and complete a mock interview to generate your progress report.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {interviews.map((item, idx) => {
                const role = item.role ?? item?.data?.role ?? "-";
                const status = item.status ?? item?.data?.status ?? "-";
                const score = item.score ?? item?.data?.score ?? "-";
                const feedback =
                  item.feedback ?? item?.data?.feedback ?? item?.result?.feedback ?? "-";
                const date = formatDate(
                  item.createdAt ?? item?.data?.createdAt ?? item?.date ?? item?.uploadedAt
                );

                const scoreBadge = typeof score === "number" || Number(score) !== NaN
                  ? score
                  : score;

                return (
                  <article
                    key={item._id || item.id || idx}
                    className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-gray-500">Role</p>
                        <h3 className="text-sm font-semibold text-gray-900 truncate mt-1">
                          {role}
                        </h3>
                      </div>

                      <div className="shrink-0 flex flex-col items-end gap-2">
                        <div
                          className={[
                            "inline-flex items-center rounded-lg px-3 py-1 text-xs font-semibold ring-1",
                            statusBadgeClass(status),
                          ].join(" ")}
                        >
                          {status}
                        </div>

                        <div
                          className={[
                            "inline-flex items-center rounded-lg px-3 py-1 text-xs font-semibold ring-1",
                            scoreBadgeClass(score),
                          ].join(" ")}
                        >
                          {score !== "-" && score !== null && score !== undefined
                            ? `${score}%`
                            : "-"}
                        </div>
                      </div>
                    </div>

                    <div className="mt-4">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="text-xs font-semibold text-gray-500">Interview date</p>
                          <p className="text-sm font-semibold text-gray-900 mt-1">{date}</p>
                        </div>
                      </div>

                      <div className="mt-4">
                        <p className="text-xs font-semibold text-gray-500">Feedback</p>
                        <div className="mt-2 text-sm text-gray-700 whitespace-pre-wrap break-words leading-relaxed">
                          {feedback}
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 h-px bg-gray-100" />

                    <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
                      <span>Report</span>
                      <span className="font-medium text-gray-600">#{idx + 1}</span>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </DashboardLayout>
  );
};

export default ReportPage;
