import API from "../api/api";

export const getDashboardSummary = async () => {
  const res = await API.get("/dashboard/summary");
  return res.data;
};

export const getOrders = async () => {
  const res = await API.get("/dashboard/orders");
  return res.data;
};

export const getSLA = async () => {
  const res = await API.get("/dashboard/sla");
  return res.data;
};

export const getAtRisk = async () => {
  const res = await API.get("/dashboard/at-risk");
  return res.data;
};