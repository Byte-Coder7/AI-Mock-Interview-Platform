import api from "./api";

export const startInterview = async (role) => {
  const response = await api.post("/interview/start", { role });
  return response.data;
};

export const submitInterview = async (interviewId, answers) => {
  const response = await api.post("/interview/submit", { interviewId, answers });
  return response.data;
};

export const getInterviewHistory = async () => {
  const response = await api.get("/interview/history");
  return response.data;
};

