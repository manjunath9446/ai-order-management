import API from "../api/api";

export const getAlerts = async () => {
  const res = await API.get("/alerts");
  return res.data;
};

export const getAlertSummary = async () => {
  const res = await API.get("/alerts/summary");
  return res.data;
};