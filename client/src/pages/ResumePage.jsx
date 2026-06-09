import React, { useEffect, useState } from "react";
import { FileText, UploadCloud, Inbox } from "lucide-react";

import DashboardLayout from "../Layouts/DashboardLayout";
import { getResumeHistory, uploadResume } from "../services/resumeService";

const ResumePage = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadedResumes, setUploadedResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const refreshHistory = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await getResumeHistory();
      setUploadedResumes(Array.isArray(res) ? res : []);
    } catch (e) {
      setError("Failed to load resume history.");
      setUploadedResumes([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleUpload = async () => {
    if (!selectedFile || uploading) return;

    setUploading(true);
    setError("");
    try {
      await uploadResume({
        fileName: selectedFile.name,
        resumeText: "Resume uploaded from frontend",
      });

      setSelectedFile(null);
      await refreshHistory();
    } catch (e) {
      setError("Failed to upload resume.");
    } finally {
      setUploading(false);
    }
  };

  const formatDate = (value) => {
    if (!value) return "-";
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return String(value);
    return d.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "2-digit",
    });
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold text-gray-900">Resume Management</h1>
          <p className="text-gray-600">Upload, review, and manage your resumes for mock interviews.</p>
        </div>

        {/* Upload Resume */}
        <section className="bg-white rounded-xl shadow-md p-5">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
            <h2 className="text-sm font-semibold text-gray-600">Upload Resume</h2>
            <span className="text-sm text-gray-500">PDF / DOC / DOCX</span>
          </div>

          <div className="rounded-2xl border-2 border-dashed border-gray-200 bg-white p-6 transition-shadow hover:shadow-lg">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center border border-blue-100">
                  <UploadCloud className="w-7 h-7 text-blue-600" />
                </div>

                <div className="pt-1">
                  <p className="text-gray-900 font-semibold">
                    Drag and drop your resume here
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    PDF, DOC, DOCX supported
                  </p>
                </div>
              </div>

              <div className="flex-1 flex flex-col items-stretch gap-3">
                <label
                  className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-4 py-3 text-white font-semibold hover:bg-blue-700 transition cursor-pointer shadow-sm"
                >
                  <Inbox className="w-4 h-4 mr-2" />
                  Choose Resume
                  <input
                    type="file"
                    className="hidden"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                  />
                </label>

                {selectedFile ? (
                  <p className="text-sm text-gray-600 break-all">
                    Selected: <span className="font-medium text-gray-900">{selectedFile.name}</span>
                  </p>
                ) : null}

                <div className="w-full flex justify-center">
                  <button
                    type="button"
                    onClick={handleUpload}
                    disabled={!selectedFile || uploading}
                    className={`w-full max-w-xs rounded-xl px-4 py-3 text-sm font-semibold transition shadow-sm ${
                      !selectedFile || uploading
                        ? "bg-blue-200 text-white cursor-not-allowed"
                        : "bg-blue-600 text-white hover:bg-blue-700"
                    }`}
                  >
                    {uploading ? "Uploading..." : "Upload"}
                  </button>
                </div>

                {error ? <p className="text-sm text-red-600">{error}</p> : null}
              </div>
            </div>
          </div>
        </section>

        {/* Uploaded Resumes */}
        <section className="bg-white rounded-xl shadow-md p-5">
          <div className="flex items-center justify-between gap-3 mb-4">
            <h2 className="text-sm font-semibold text-gray-600">Uploaded Resumes</h2>
            <span className="text-sm text-gray-500">
              {loading ? "Loading..." : "Backend data"}
            </span>
          </div>

          <div className="overflow-x-auto">
            {loading ? (
              <div className="py-6 text-center text-sm text-gray-500">
                Loading resume history...
              </div>
            ) : uploadedResumes.length === 0 ? (
              <div className="py-10">
                <div className="flex flex-col items-center text-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center">
                    <FileText className="w-6 h-6 text-gray-600" />
                  </div>
                  <div className="font-semibold text-gray-900">No resumes uploaded yet</div>
                  <div className="text-sm text-gray-500">
                    Upload your first resume to get started.
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3">
                {uploadedResumes.map((resume, idx) => {
                  const fileName =
                    resume.fileName ||
                    resume.filename ||
                    resume.name ||
                    `Resume ${idx + 1}`;
                  const status = resume.status || "Uploaded";
                  const createdAt =
                    resume.createdAt ||
                    resume.uploadedAt ||
                    resume.date ||
                    resume.created ||
                    "";

                  const badgeText = status || "Uploaded";
                  const badgeLower = String(badgeText).toLowerCase();

                  const badgeClass =
                    badgeLower.includes("processed") || badgeLower.includes("success")
                      ? "bg-green-50 text-green-700 ring-green-200"
                      : badgeLower.includes("failed")
                        ? "bg-red-50 text-red-700 ring-red-200"
                        : badgeLower.includes("upload")
                          ? "bg-indigo-50 text-indigo-700 ring-indigo-200"
                          : "bg-gray-50 text-gray-700 ring-gray-200";

                  return (
                    <div
                      key={resume._id || resume.id || fileName || idx}
                      className="rounded-2xl border border-gray-100 bg-white hover:shadow-md transition p-4 flex items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-11 h-11 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center">
                          <FileText className="w-5 h-5 text-gray-500" />
                        </div>

                        <div className="min-w-0">
                          <p className="font-semibold text-gray-900 truncate">
                            {fileName}
                          </p>
                          <p className="text-sm text-gray-500">
                            Uploaded: {formatDate(createdAt)}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div
                          className={[
                            "inline-flex items-center rounded-lg px-3 py-1 text-xs font-semibold ring-1",
                            badgeClass,
                          ].join(" ")}
                        >
                          {badgeText}
                        </div>

                        <button
                          type="button"
                          className="shrink-0 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-700 hover:bg-red-100 transition"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
};

export default ResumePage;

