import { Suspense, useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import router from "./router/router";
import Loading from "./components/ui/Loading";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "./features/auth/authSlice";
import { AUTH_COOKIE } from "./utils/authCookie";

// Watches for cookie expiry every 30 seconds and auto-logs out
function SessionWatcher() {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  useEffect(() => {
    if (!isAuthenticated) return;

    const interval = setInterval(() => {
      const tokenStillExists = AUTH_COOKIE.getToken();
      if (!tokenStillExists) {
        dispatch(logout());
        sessionStorage.setItem("sessionExpired", "true");
        toast.warning("Session expired. Please log in again.");
        setTimeout(() => {
          window.location.href = "/auth/login";
        }, 1500);
      }
    }, 30_000); // check every 30 seconds

    return () => clearInterval(interval);
  }, [isAuthenticated, dispatch]);

  return null;
}

function App() {
  return (
    <Suspense fallback={<Loading />}>
      <SessionWatcher />
      <RouterProvider router={router} />
      <ToastContainer />
    </Suspense>
  );
}

export default App;
