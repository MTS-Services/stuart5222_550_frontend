import Cookies from "js-cookie";
const SESSION_MINUTES = 30;
// Calculated per-call so each login gets a fresh 30-min window
const getExpiry = () => new Date(new Date().getTime() + SESSION_MINUTES * 60 * 1000);
// secure:true silently blocks cookies on HTTP (localhost). Only use on HTTPS.
const isSecure = window.location.protocol === "https:";

export const SESSION_MS = SESSION_MINUTES * 60 * 1000;

export const AUTH_COOKIE = {
  // -----------------
  // ✅ User Methods
  // -----------------
  setUser: (user) => {
    Cookies.set("__app_user", JSON.stringify(user), {
      expires: getExpiry(),
      secure: isSecure,
      sameSite: "strict",
    });
  },
  getUser: () => {
    const user = Cookies.get("__app_user");
    return user ? JSON.parse(user) : null;
  },
  removeUser: () => Cookies.remove("__app_user"),

  // -----------------
  // ✅ Token Methods
  // -----------------
  setToken: (token) => {
    Cookies.set("__app_token", token, {
      expires: getExpiry(),
      secure: isSecure,
      sameSite: "strict",
    });
  },

  getToken: () => Cookies.get("__app_token"),
  removeToken: () => Cookies.remove("__app_token"),

  remove: () => {
    Cookies.remove("__app_token");
    Cookies.remove("__app_user");
  },
};
