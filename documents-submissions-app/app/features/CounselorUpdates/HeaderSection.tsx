import { Box, Typography, useTheme } from "@mui/material";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";


export const HeaderSection = () => {
  const theme = useTheme();
  return (
    <Box textAlign="center">
      <Box
        sx={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: 80,
          height: 80,
          borderRadius: "50%",
          backgroundColor: theme.palette.info.light + "15",
          color: theme.palette.info.main,
          mb: 3,
        }}
      >
        <SupportAgentIcon sx={{ fontSize: 40 }} />
      </Box>
      <Typography
        variant="h3"
        component="h1"
        sx={{
          fontWeight: 600,
          color: theme.palette.text.primary,
          mb: 2,
        }}
      >
        Counselor Updates
      </Typography>
      <Typography
        variant="h6"
        color="text.secondary"
        sx={{
          maxWidth: "600px",
          mx: "auto",
          fontWeight: 400,
        }}
      >
        Track your follow-up updates and communications with your counselor
      </Typography>
    </Box>
  );
};
