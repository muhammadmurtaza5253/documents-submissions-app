"use client";

import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { useRouter } from "next/navigation";
import SchoolIcon from "@mui/icons-material/School";
import DescriptionIcon from "@mui/icons-material/Description";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import { useAuth } from "@/app/contexts/AuthProvider";
import { getDataFromLocalStorage } from "@/app/utils/getDataFromLocalStorage";
import { useEffect, useState } from "react";

export const StudentHomepage = () => {
  console.log("StudentHomepage");
  const router = useRouter();
  const theme = useTheme();
  const { logout } = useAuth();
  const [studentName, setStudentName] = useState(" ");

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setStudentName(getDataFromLocalStorage("name") || " ");
  }, []);

  const academicCounsellingFormClick = () => {
    router.push("/academic-counselling-form");
  };

  const submitDocsClick = () => {
    router.push("/documents");
  };

  const actionCards = [
    {
      title: "Academic Counselling Form",
      description:
        "Fill out the academic counselling form to get personalized guidance and support for your academic journey.",
      icon: <SchoolIcon sx={{ fontSize: 48 }} />,
      onClick: academicCounsellingFormClick,
      color: theme.palette.primary.main,
      bgColor: theme.palette.primary.light + "15",
    },
    {
      title: "Submit Your Documents",
      description:
        "Upload and submit your required documents for review and processing.",
      icon: <DescriptionIcon sx={{ fontSize: 48 }} />,
      onClick: submitDocsClick,
      color: theme.palette.info.main,
      bgColor: theme.palette.info.light + "15",
    },
  ];

  const handleLogout = () => {
    if (window.localStorage) {
      window.localStorage.removeItem("user");
    }
    logout();
  };

  return (
    <Stack>
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          p: 3,
        }}
      >
        <Button
          variant="outlined"
          size="medium"
          onClick={handleLogout}
          startIcon={<LogoutOutlinedIcon />}
          sx={{
            px: 3,
            py: 1,
            fontSize: 14,
            fontWeight: 500,
            textTransform: "none",
            borderColor: theme.palette.divider,
            color: theme.palette.text.primary,
            "&:hover": {
              borderColor: theme.palette.error.main,
              color: theme.palette.error.main,
              backgroundColor: theme.palette.error.light + "10",
            },
          }}
        >
          Logout
        </Button>
      </Box>
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Stack spacing={6}>
          {/* Header Section */}
          <Box textAlign="center">
            {studentName && (
              <Typography
                variant="h3"
                component="h1"
                gutterBottom
                sx={{
                  fontWeight: 600,
                  color: theme.palette.text.primary,
                  mb: 2,
                }}
              >
                Welcome, {studentName}!
              </Typography>
            )}
            <Typography
              variant="h6"
              color="text.secondary"
              sx={{
                maxWidth: "600px",
                mx: "auto",
                fontWeight: 400,
              }}
            >
              Manage your academic journey and document submissions all in one
              place
            </Typography>
          </Box>

          {/* Action Cards */}
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={4}
            justifyContent="center"
            alignItems="stretch"
          >
            {actionCards.map((card, index) => (
              <Box key={index} sx={{ flex: 1, maxWidth: { sm: "500px" } }}>
                <Card
                  sx={{
                    height: "100%",
                    transition: "all 0.3s ease-in-out",
                    border: `1px solid ${theme.palette.divider}`,
                    "&:hover": {
                      boxShadow: `0 8px 24px ${card.color}40`,
                    },
                  }}
                >
                  <CardContent
                    sx={{
                      p: 4,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      textAlign: "center",
                      minHeight: "280px",
                      justifyContent: "center",
                    }}
                  >
                    <Box
                      sx={{
                        width: 100,
                        height: 100,
                        borderRadius: "50%",
                        backgroundColor: card.bgColor,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        mb: 3,
                        color: card.color,
                      }}
                    >
                      {card.icon}
                    </Box>
                    <Typography
                      variant="h5"
                      component="h2"
                      gutterBottom
                      sx={{
                        fontWeight: 600,
                        color: theme.palette.text.primary,
                        mb: 2,
                      }}
                    >
                      {card.title}
                    </Typography>
                    <Typography
                      variant="body1"
                      color="text.secondary"
                      sx={{
                        lineHeight: 1.6,
                        maxWidth: "400px",
                      }}
                    >
                      {card.description}
                    </Typography>
                    <Button
                      variant="contained"
                      size="large"
                      onClick={card.onClick}
                      sx={{
                        mt: 4,
                        px: 4,
                        py: 1.5,
                        backgroundColor: card.color,
                        "&:hover": {
                          backgroundColor: card.color,
                          opacity: 0.9,
                        },
                      }}
                    >
                      Get Started
                    </Button>
                  </CardContent>
                </Card>
              </Box>
            ))}
          </Stack>
        </Stack>
      </Container>
    </Stack>
  );
};
