import { useContext } from "react";
import { SnackbarContext } from ".";

export const useSnackbar = () => {
  const showSnackbar = useContext(SnackbarContext);
  if (!showSnackbar) {
    throw new Error("useSnackbar must be used within a SnackbarProvider");
  }
  return showSnackbar;
};
