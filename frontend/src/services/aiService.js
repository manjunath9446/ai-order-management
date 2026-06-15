import API from "../api/api";

export const getAISummary = async () => {
  const res = await API.get("/ai/summary");
  return res.data;
};

export const getPredictions = async () => {
  const res = await API.get("/ai/predictions");
  return res.data;
};

export const getRecommendations = async () => {
  const res = await API.get("/ai/recommendations");
  return res.data;
};

export const getDelayDashboard = async () => {
  const res = await API.get("/ai/delay-dashboard");
  return res.data;
};

export const askCopilot = async (question) => {
  const res = await API.get(`/ai/copilot?q=${question}`);
  return res.data;
};