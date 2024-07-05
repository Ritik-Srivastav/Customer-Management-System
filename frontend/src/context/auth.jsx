import { useState, useEffect, useContext, createContext } from "react";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    user: null,
    token: "",
  });

  useEffect(() => {
    const data = localStorage.getItem("auth");
    if (data) {
      const parsedData = JSON.parse(data);
      // Only update state if it's different from the current state
      if (parsedData.user !== auth.user || parsedData.token !== auth.token) {
        setAuth({
          ...auth,
          user: parsedData.user,
          token: parsedData.token,
        });
      }
    }
  }, []); // Empty dependency array to run this effect only once on mount

  return (
    <AuthContext.Provider value={[auth, setAuth]}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
const useAuth = () => useContext(AuthContext);

export { useAuth, AuthProvider };
