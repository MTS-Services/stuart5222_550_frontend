import Cookies from "js-cookie";

const oneMinute = new Date(new Date().getTime() + 1 * 60 * 1000);

export const AUTH_COOKIE = {
  // -----------------
  // User Methods
  // -----------------
  setUser: (user) => {
    Cookies.set("__app_user", JSON.stringify(user), {
      expires: oneMinute, // 1 minute
      secure: true,
      sameSite: "strict",
    });
  },
  getUser: () => {
    const user = Cookies.get("__app_user");
    return user ? JSON.parse(user) : null;
  },
  removeUser: () => Cookies.remove("__app_user"),

  // -----------------
  // Token Methods
  // -----------------
  setToken: (token) => {
    Cookies.set("__app_token", token, {
      expires: oneMinute, // 1 minute
      secure: true,
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
