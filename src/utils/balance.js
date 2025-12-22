import axiosInstance from "./axiosConfig";


const getBalance = async () => {
  try {
    const response = await axiosInstance.get("/api/profiles/balance");
    localStorage.setItem("gems_balance", response.data.balance);
    return response.data.balance;
  } catch (error) {
    console.error("Error fetching balance:", error);
    return null;
  }
};




export default getBalance;
