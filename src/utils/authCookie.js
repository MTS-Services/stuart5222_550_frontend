import Cookies from "js-cookie";

export const AUTH_COOKIE = {
  // -----------------
  // User Methods
  // -----------------
  setUser: (user) => {
    Cookies.set("__app_user", JSON.stringify(user), {
      expires: 7, // 7 days
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
    // const oneMinute = new Date(new Date().getTime() + 1 * 60 * 1000);
    Cookies.set("__app_token", token, {
      expires: 7, // 7 days
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
