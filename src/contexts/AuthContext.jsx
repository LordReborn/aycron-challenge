import { createContext, useState } from "react";
import PropTypes from "prop-types";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [authUser, setAuthUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );

  const handleUser = (user) => {
    if (!user) {
      localStorage.removeItem("user");
      return setAuthUser(null);
    }
    localStorage.setItem("user", JSON.stringify(user));
    setAuthUser(user);
  };

  const value = {
    handleUser,
    authUser,
    isManager: authUser?.role === "manager",
    isLoggedIn: !!authUser?.role,
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

AuthProvider.propTypes = {
  children: PropTypes.element,
};
