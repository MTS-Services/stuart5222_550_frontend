import { postData } from "../../utils/axiosInstance";

// ===================================================
// LOGIN USER (Admin or normal user)
// ===================================================
export const LOGIN_API = async ({ email, password }) => {
  try {
    const res = await postData("auth/admin/login", { email, password });

    // Expecting backend returns { success, message, token, user }
    if (res?.token) {
      // Save user info in localStorage
      localStorage.setItem(
        "userInfo",
        JSON.stringify({ ...res, token: res.token })
      );
    }

    return res;
  } catch (error) {
    console.error("LOGIN_API Error:", error);
    return {
      success: false,
      message: error?.response?.data?.message || "Login failed",
    };
  }
};
