import Cookies from "js-cookie";

export const AUTH_COOKIE = {
  set: (token) => {
    // const oneMinute = new Date(new Date().getTime() + 1 * 60 * 1000);

    Cookies.set("__app_token", token, {
      expires: 7, // 7 days
      secure: true,
      sameSite: "strict",
    });
  },
  get: () => Cookies.get("__app_token"),
  remove: () => Cookies.remove("__app_token"),
};
