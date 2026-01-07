import {
  createContext,
  useContext,
  useEffect,
  useReducer
} from "react";
import { loginApi } from "../api/auth.api";

/* ============================
   CONTEXT
============================ */
export const AuthContext = createContext(null);

/* ============================
   INITIAL STATE
============================ */
const initialState = {
  user: null,
  isAuthenticated: false,
  loading: true
};

/* ============================
   REDUCER
============================ */
function authReducer(state, action) {
  switch (action.type) {
    case "LOGIN_SUCCESS":
      return {
        user: action.payload,
        isAuthenticated: true,
        loading: false
      };

    case "LOGOUT":
      return {
        user: null,
        isAuthenticated: false,
        loading: false
      };

    case "RESTORE_SESSION":
      return {
        user: action.payload,
        isAuthenticated: true,
        loading: false
      };

    case "AUTH_READY":
      return {
        ...state,
        loading: false
      };

    default:
      return state;
  }
}

/* ============================
   PROVIDER
============================ */
export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(
    authReducer,
    initialState
  );

  /* 🔄 Restore session on reload */
  useEffect(() => {
    try {
      const token = localStorage.getItem("admin_token");
      const userRaw = localStorage.getItem("admin_user");
      const user = userRaw && userRaw !== "undefined" ? JSON.parse(userRaw) : null;

      if (token && user) {
        dispatch({
          type: "RESTORE_SESSION",
          payload: user
        });
      } else {
        dispatch({ type: "AUTH_READY" });
      }
    } catch (err) {
      console.error("Auth restore failed", err);
      localStorage.clear();
      dispatch({ type: "AUTH_READY" });
    }
  }, []);

  /* 🔐 Login */
  const login = async (email, password) => {
    const data = await loginApi(email, password);

    localStorage.setItem("admin_token", data.token);
    localStorage.setItem(
      "admin_user",
      JSON.stringify(data.user)
    );

    dispatch({
      type: "LOGIN_SUCCESS",
      payload: data.user
    });
  };

  /* 🚪 Logout */
  const logout = () => {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_user");

    dispatch({ type: "LOGOUT" });
  };

  return (
    <AuthContext.Provider
      value={{
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        loading: state.loading,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

/* ============================
   HOOK
============================ */
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
};