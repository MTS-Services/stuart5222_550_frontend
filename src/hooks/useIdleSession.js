import { useEffect, useRef, useCallback } from "react";
import { AUTH_COOKIE } from "../utils/authCookie";

/**
 * Custom hook for handling user idle session management
 * @param {number} timeout - Inactivity timeout in milliseconds (default: 60000ms = 1 minute)
 * @param {string} redirectUrl - URL to redirect on logout (default: "/auth/login")
 */
export const useIdleSession = (
  timeout = 600000, // 10 minutes
  redirectUrl = "/auth/login",
) => {
  const timerRef = useRef(null);
  const isActiveRef = useRef(true);

  // Throttle function to limit how often cookies are refreshed
  const throttleRef = useRef(null);

  const logout = useCallback(() => {
    console.log("🚪 Session timeout - logging out user");

    // Clear any existing timer
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    // Remove authentication data
    AUTH_COOKIE.remove();

    // Redirect to login page
    window.location.href = redirectUrl;
  }, [redirectUrl]);

  const refreshCookies = useCallback(() => {
    // Throttle cookie refresh to avoid excessive updates
    if (throttleRef.current) return;

    throttleRef.current = setTimeout(() => {
      throttleRef.current = null;
    }, 2000); // Throttle for 2 seconds

    // Only refresh if cookies exist
    const user = AUTH_COOKIE.getUser();
    const token = AUTH_COOKIE.getToken();

    if (user && token) {
      AUTH_COOKIE.refresh();
      console.log("🔄 Cookies refreshed due to user activity");
    }
  }, []);

  const resetTimer = useCallback(() => {
    // Clear existing timer
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    // Refresh cookies on activity
    refreshCookies();

    // Set new timeout for logout
    timerRef.current = setTimeout(() => {
      logout();
    }, timeout);
  }, [timeout, logout, refreshCookies]);

  const handleUserActivity = useCallback(() => {
    if (!isActiveRef.current) return;
    resetTimer();
  }, [resetTimer]);

  useEffect(() => {
    // Check if user is authenticated on mount
    const user = AUTH_COOKIE.getUser();
    const token = AUTH_COOKIE.getToken();

    if (!user || !token) {
      console.log("⚠️ No valid authentication found, redirecting to login");
      logout();
      return;
    }

    console.log("✅ Idle session monitoring started", {
      timeout: `${timeout / 1000}s`,
      redirectUrl,
    });

    // Activity events to monitor
    const events = [
      "mousedown",
      "mousemove",
      "keydown",
      "scroll",
      "touchstart",
      "click",
      "keypress",
      "focus",
      "blur",
    ];

    // Add event listeners with passive option for better performance
    events.forEach((event) => {
      window.addEventListener(event, handleUserActivity, {
        passive: true,
        capture: false,
      });
    });

    // Start the initial timer
    resetTimer();

    // Handle page visibility changes
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        console.log("👁️ Page became visible, resetting timer");
        resetTimer();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Cleanup function
    return () => {
      console.log("🧹 Cleaning up idle session monitoring");

      isActiveRef.current = false;

      // Clear timers
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      if (throttleRef.current) {
        clearTimeout(throttleRef.current);
      }

      // Remove event listeners
      events.forEach((event) => {
        window.removeEventListener(event, handleUserActivity);
      });

      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [timeout, logout, resetTimer, handleUserActivity, redirectUrl]);

  // Return utility functions for manual control if needed
  return {
    resetTimer,
    logout,
    refreshCookies,
  };
};
