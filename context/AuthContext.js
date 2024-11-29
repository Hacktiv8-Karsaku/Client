import * as React from "react";

export const AuthContext = React.createContext();

export function useIsSignedIn() {
  const { isSignedIn } = React.useContext(AuthContext);
  return isSignedIn;
}

export function useIsSignedOut() {
  const { isSignedIn } = React.useContext(AuthContext);
  return !isSignedIn;
}
