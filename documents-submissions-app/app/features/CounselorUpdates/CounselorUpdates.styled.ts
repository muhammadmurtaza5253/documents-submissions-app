import { Theme } from "@mui/material/styles";

export const accordionStyles = {
  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  borderRadius: 3,
  overflow: "hidden",
  "&:before": {
    display: "none",
  },
  "&.Mui-expanded": {
    margin: "16px 0",
  },
};

export const getAccordionSummaryStyles = (theme: Theme, isToday: boolean) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  borderRadius: isToday ? "12px 12px 0 0" : "12px",
  "&.Mui-expanded": {
    borderRadius: "12px 12px 0 0",
  },
  "& .MuiAccordionSummary-content": {
    alignItems: "center",
    gap: 1.5,
  },
});
