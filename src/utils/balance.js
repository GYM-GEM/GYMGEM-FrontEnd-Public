import axiosInstance from "./axiosConfig";


const getBalance = () => {
  try {
    const response = axiosInstance.get("/api/profiles/balance");
    localStorage.setItem("gems_balance", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching balance:", error);
    return null;
  }
};