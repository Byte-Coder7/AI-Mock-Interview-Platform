import React, { useEffect, useMemo, useState } from "react";
import { Award, Sparkles, Clock3, PlayCircle, ClipboardCheck, User, SendHorizontal } from "lucide-react";

import DashboardLayout from "../Layouts/DashboardLayout";
import { startInterview, submitInterview } from "../services/interviewService";

const InterviewPage = () => {
  const [role, setRole] = useState("Frontend Developer");

  const [interview, setInterview] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [answers, setAnswers] = useState([]);

  const [starting, setStarting] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [submittedResult, setSubmittedResult] = useState(null);
  const [error, setError] = useState("");

  const totalCount = questions.length;
  const completedCount = useMemo(() => {
    if (!totalCount) return 0;
    return Math.max(0, activeIndex); // 0..activeIndex-1 are completed
  }, [activeIndex, totalCount]);

  useEffect(() => {
    // Keep answers array aligned with question count
    setAnswers((prev) => {
      if (questions.length === 0) return [];
      const next = Array.from({ length: questions.length }, (_, idx) => prev?.[idx] ?? "");
      return next;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questions.length]);

  const handleStartInterview = async () => {
    if (starting || !role.trim()) return;

    setStarting(true);
    setError("");
    setSubmittedResult(null);
    setInterview(null);
    setQuestions([]);
    setActiveIndex(0);
    setAnswers([]);

    try {
      const res = await startInterview(role);

      // Expected from backend: interview object includes _id and generated questions (field name may vary)
      setInterview(res || null);

      const backendQuestions =
        res?.questions ||
        res?.generatedQuestions ||
        res?.questionList ||
        res?.data?.questions ||
        [];

      setQuestions(Array.isArray(backendQuestions) ? backendQuestions : []);
      setActiveIndex(0);
    } catch (e) {
      setError("Failed to start interview.");
    } finally {
      setStarting(false);
    }
  };

  const setCurrentAnswer = (value) => {
    setAnswers((prev) => {
      const next = [...prev];
      next[activeIndex] = value;
      return next;
    });
  };

  const handleSubmitInterview = async () => {
    if (submitting || !interview?._id) return;

    setSubmitting(true);
    setError("");

    try {
      const res = await submitInterview(interview._id, answers);
      setSubmittedResult(res || {});
    } catch (e) {
      setError("Failed to submit interview.");
    } finally {
      setSubmitting(false);
    }
  };

  const canNavigatePrev = activeIndex > 0;
  const canNavigateNext = activeIndex < totalCount - 1;

  const progressPct = totalCount ? Math.round(((activeIndex + 1) / totalCount) * 100) : 0;

  const answerValue = answers?.[activeIndex] ?? "";

  const scoreValue =
    submittedResult?.score ??
    submittedResult?.data?.score ??
    submittedResult?.result?.score ??
    "-";

  const feedbackValue =
    submittedResult?.feedback ??
    submittedResult?.data?.feedback ??
    submittedResult?.result?.feedback ??
    "-";

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        {/* Hero */}
        <section className="mt-1 rounded-2xl bg-gradient-to-r from-indigo-600 via-blue-600 to-sky-500 p-6 sm:p-7 text-white shadow-sm">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
            <div>
              <div className="inline-flex items-center gap-2 text-sm font-semibold text-white/90">
                <Sparkles className="w-4 h-4" />
                AI Mock Interview
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold mt-2">AI Mock Interview</h1>
              <p className="text-white/85 mt-2 max-w-2xl">
                Practice role-specific interview questions
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2 border border-white/15">
                <Clock3 className="w-4 h-4" />
                <span className="text-sm font-semibold">{totalCount ? "In session" : "Ready"}</span>
              </div>
              <div className="hidden sm:flex inline-flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2 border border-white/15">
                <PlayCircle className="w-4 h-4" />
                <span className="text-sm font-semibold">
                  {totalCount ? `Q ${activeIndex + 1}/${totalCount}` : "Start when ready"}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Start Interview card */}
        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-indigo-600" />
                <h2 className="text-sm font-semibold text-gray-700">Role</h2>
              </div>

              <input
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full md:w-96 rounded-xl border border-gray-200 px-4 py-2.5 text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="e.g., Frontend Developer"
              />
            </div>

            <button
              type="button"
              onClick={handleStartInterview}
              disabled={starting}
              className={`rounded-xl px-5 py-2.5 text-sm font-semibold transition shadow-sm border ${
                starting
                  ? "bg-indigo-200 text-white cursor-not-allowed border-indigo-200"
                  : "bg-gradient-to-r from-indigo-600 to-blue-600 text-white hover:from-indigo-700 hover:to-blue-700 border-indigo-600"
              }`}
            >
              {starting ? "Starting interview..." : "Start Interview"}
            </button>
          </div>

          {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}
        </section>

        {/* Main layout */}
        {questions.length ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* LEFT */}
            <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              {!submittedResult ? (
                <>
                  {/* Question card */}
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center rounded-lg bg-indigo-50 text-indigo-700 ring-1 ring-indigo-100 px-3 py-1 text-xs font-semibold">
                          Question {activeIndex + 1}
                        </span>
                        <span className="text-xs font-semibold text-gray-500">
                          {totalCount} total
                        </span>
                      </div>

                      <p className="text-lg font-semibold text-gray-900 mt-3">
                        {questions[activeIndex] || ""}
                      </p>
                    </div>

                    {/* Progress indicator */}
                    <div className="hidden sm:block w-28">
                      <div className="text-right text-xs font-semibold text-gray-500">
                        {progressPct}%
                      </div>
                      <div className="mt-2 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-indigo-600 to-blue-600 rounded-full transition-all duration-300"
                          style={{ width: `${progressPct}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Answer section */}
                  <textarea
                    value={answerValue}
                    onChange={(e) => setCurrentAnswer(e.target.value)}
                    className="w-full min-h-56 resize-none rounded-2xl border border-gray-200 bg-white px-4 py-4 text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 leading-relaxed tracking-wide"
                    placeholder="Type your answer here..."
                  />

                  {/* Navigation */}
                  <div className="mt-4 flex flex-col sm:flex-row gap-3">
                    <button
                      type="button"
                      onClick={() => canNavigatePrev && setActiveIndex((i) => i - 1)}
                      disabled={!canNavigatePrev}
                      className={`rounded-xl px-4 py-2.5 font-semibold transition border ${
                        canNavigatePrev
                          ? "border-gray-200 bg-white text-gray-800 hover:bg-gray-50"
                          : "border-gray-100 bg-gray-50 text-gray-400 cursor-not-allowed"
                      }`}
                    >
                      Previous
                    </button>

                    <button
                      type="button"
                      onClick={() => canNavigateNext && setActiveIndex((i) => i + 1)}
                      disabled={!canNavigateNext}
                      className={`rounded-xl px-4 py-2.5 font-semibold transition border ${
                        canNavigateNext
                          ? "border-gray-200 bg-white text-gray-800 hover:bg-gray-50"
                          : "border-gray-100 bg-gray-50 text-gray-400 cursor-not-allowed"
                      }`}
                    >
                      Next
                    </button>

                    <button
                      type="button"
                      onClick={handleSubmitInterview}
                      disabled={submitting}
                      className={`rounded-xl px-4 py-2.5 font-semibold text-white transition shadow-sm border ${
                        submitting
                          ? "bg-indigo-200 cursor-not-allowed border-indigo-200"
                          : "bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 border-indigo-600"
                      }`}
                    >
                      {submitting ? "Submitting interview..." : "Submit Interview"}
                    </button>
                  </div>
                </>
              ) : (
                <>
                  {/* Result card */}
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div>
                      <h2 className="text-sm font-semibold text-gray-700">Interview Result</h2>
                      <p className="mt-1 text-sm text-gray-500">
                        Your AI-generated feedback and score
                      </p>
                    </div>

                    <div className="inline-flex items-center gap-2 rounded-xl bg-green-50 text-green-700 ring-1 ring-green-200 px-3 py-2">
                      <Award className="w-4 h-4" />
                      <span className="text-sm font-semibold">
                        Score: {scoreValue}
                      </span>
                    </div>
                  </div>

                  <div className="bg-green-50 border border-green-200 rounded-2xl p-5 shadow-sm">
                    <div className="flex items-start gap-3">
                      <ClipboardCheck className="w-5 h-5 text-green-700 mt-0.5" />
                      <div className="min-w-0">
                        <div className="text-xs font-semibold text-green-800">Feedback</div>
                        <div className="mt-2 text-sm text-green-900 whitespace-pre-wrap break-words leading-relaxed">
                          {feedbackValue}
                        </div>
                      </div>
                    </div>

                    {error ? <div className="mt-4 text-sm text-red-600">{error}</div> : null}
                  </div>
                </>
              )}
            </div>

            {/* RIGHT */}
            <div className="lg:col-span-1 flex flex-col gap-4">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Interview Progress</h3>

                <div className="flex items-center justify-between text-sm mb-3">
                  <span className="text-gray-500">Completed</span>
                  <span className="font-semibold text-gray-900">
                    {completedCount} / {totalCount}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm mb-4">
                  <span className="text-gray-500">Active</span>
                  <span className="font-semibold text-gray-900">
                    Question {activeIndex + 1}
                  </span>
                </div>

                <ul className="grid grid-cols-2 gap-2">
                  {questions.map((_, idx) => {
                    const isCompleted = idx < activeIndex;
                    const isActive = idx === activeIndex;

                    return (
                      <li key={idx}>
                        <div
                          className={
                            "h-10 rounded-xl border flex items-center justify-center text-sm font-semibold transition " +
                            (isActive
                              ? "bg-indigo-600 border-indigo-600 text-white shadow-sm"
                              : isCompleted
                                ? "bg-green-50 border-green-200 text-green-700"
                                : "bg-gray-50 border-gray-100 text-gray-600")
                          }
                        >
                          {idx + 1}
                        </div>
                      </li>
                    );
                  })}
                </ul>

                <div className="mt-4 text-sm text-gray-500">
                  Remaining pending: {Math.max(0, totalCount - (completedCount + 1))}
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Tips</h3>
                <p className="text-gray-700">
                  Give detailed examples and explain your reasoning.
                </p>
              </div>
            </div>
          </div>
        ) : (
          // Empty state
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center ring-1 ring-indigo-100">
                  <SendHorizontal className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    Get ready for your first question
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">
                    Start by choosing a role, then press “Start Interview”.
                  </p>
                </div>
              </div>

              <div className="text-sm text-gray-500">
                Your AI mock interview will appear here.
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default InterviewPage;

