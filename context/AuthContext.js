import { createContext, useContext } from "react";

export const AuthContext = createContext({
  isSignedIn: false,
  setIsSignedIn: () => {},
});

export const useIsSignedIn = () => {
  const { isSignedIn } = useContext(AuthContext);
  return isSignedIn;
};

export const useIsSignedOut = () => {
  const { isSignedIn } = useContext(AuthContext);
  return !isSignedIn;
};
