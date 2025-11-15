"use client";
import { useState, useEffect, Suspense } from "react";
import { useForm } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Box,
  TextField,
  Button,
  Typography,
  Stack,
  Container,
  Card,
  CardContent,
  Divider,
  useTheme,
  InputAdornment,
  IconButton,
  ToggleButton,
  ToggleButtonGroup,
  CircularProgress,
} from "@mui/material";
import { withProviders } from "@/app/hoc/withProviders";
import { useSnackbar } from "@/app/contexts/SnackbarProvider/useSnackbar";
import { useAuth } from "@/app/contexts/AuthProvider";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

type FormMode = "login" | "signup";

interface LoginFormData {
  name?: string;
  username: string;
  password: string;
  confirmPassword?: string;
}

const LoginPageContent = () => {
  const [mode, setMode] = useState<FormMode>("login");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showSnackbar } = useSnackbar();
  const { login, isAuthenticated } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const theme = useTheme();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const redirect = searchParams.get("redirect") || "/";
      router.push(redirect);
    }
  }, [isAuthenticated, router, searchParams]);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<LoginFormData>({
    defaultValues: {
      name: "",
      username: "",
      password: "",
      confirmPassword: "",
    },
  });

  const password = watch("password");

  const handleModeChange = (
    _event: React.MouseEvent<HTMLElement>,
    newMode: FormMode | null
  ) => {
    if (newMode !== null) {
      setMode(newMode);
      reset();
      setShowPassword(false);
      setShowConfirmPassword(false);
    }
  };

  const createAccount = async (data: LoginFormData) => {
    if (data.password !== data.confirmPassword) {
      showSnackbar("Passwords do not match", "error");
      return;
    }
    // Handle signup logic here
    try {
      const { name, username, password } = data;
      const response = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          username,
          password,
        }),
      });

      if (response.ok) {
        showSnackbar("Signup successful! Please login.", "success");
        setMode("login");
        reset();
      } else {
        const errorData = await response.json();
        showSnackbar(errorData.error || "Signup failed", "error");
      }
    } catch {
      showSnackbar("An error occurred during signup", "error");
    }
  }

  const onSubmit = async (data: LoginFormData) => {
    if (mode === "signup") {
      createAccount(data);
    } else {
      setIsSubmitting(true);
      try {
        const success = await login(data.username, data.password);
        if (success) {
          showSnackbar("Login successful!", "success");
          const redirect = searchParams.get("redirect") || "/";
          console.log("redirect", redirect);
          router.push(redirect);
        } else {
          showSnackbar("Invalid username or password", "error");
        }
      } catch {
        showSnackbar("An error occurred during login", "error");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: `linear-gradient(135deg, ${theme.palette.primary.light}15 0%, ${theme.palette.secondary.light}15 100%)`,
        py: 4,
      }}
    >
      <Container maxWidth="sm">
        <Stack spacing={4}>
          {/* Header Section */}
          <Box textAlign="center">
            <Box
              sx={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: 80,
                height: 80,
                borderRadius: "50%",
                backgroundColor: theme.palette.primary.light + "15",
                color: theme.palette.primary.main,
                mb: 3,
              }}
            >
              <LockOutlinedIcon sx={{ fontSize: 40 }} />
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
              {mode === "login" ? "Welcome Back" : "Create Account"}
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{
                maxWidth: "400px",
                mx: "auto",
                fontWeight: 400,
              }}
            >
              {mode === "login"
                ? "Sign in to your account to continue"
                : "Sign up to get started with your account"}
            </Typography>
          </Box>

          {/* Mode Toggle */}
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <ToggleButtonGroup
              value={mode}
              exclusive
              onChange={handleModeChange}
              aria-label="login or signup mode"
              sx={{
                backgroundColor: theme.palette.background.paper,
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                borderRadius: 2,
                "& .MuiToggleButton-root": {
                  px: 4,
                  py: 1,
                  textTransform: "none",
                  fontWeight: 500,
                  border: "none",
                  "&.Mui-selected": {
                    backgroundColor: theme.palette.primary.main,
                    color: theme.palette.primary.contrastText,
                    "&:hover": {
                      backgroundColor: theme.palette.primary.dark,
                    },
                  },
                },
              }}
            >
              <ToggleButton value="login" aria-label="login">
                Login
              </ToggleButton>
              <ToggleButton value="signup" aria-label="signup">
                Sign Up
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>

          {/* Form Card */}
          <Card
            sx={{
              boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
              borderRadius: 3,
              overflow: "hidden",
            }}
          >
            <CardContent sx={{ p: 4 }}>
              <form onSubmit={handleSubmit(onSubmit)}>
                <Stack spacing={3}>
                  {/* Name Field (only for signup) */}
                  {mode === "signup" && (
                    <TextField
                      label="Name"
                      fullWidth
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <PersonOutlinedIcon
                              sx={{ color: theme.palette.text.secondary }}
                            />
                          </InputAdornment>
                        ),
                      }}
                      {...register("name", {
                        required: "Name is required",
                        minLength: {
                          value: 2,
                          message: "Name must be at least 2 characters",
                        },
                      })}
                      error={!!errors.name}
                      helperText={errors.name?.message as string | undefined}
                    />
                  )}

                  {/* Username Field */}
                  <TextField
                    label="Username"
                    fullWidth
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PersonOutlinedIcon
                            sx={{ color: theme.palette.text.secondary }}
                          />
                        </InputAdornment>
                      ),
                    }}
                    {...register("username", {
                      required: "Username is required",
                      minLength: {
                        value: 3,
                        message: "Username must be at least 3 characters",
                      },
                    })}
                    error={!!errors.username}
                    helperText={errors.username?.message as string | undefined}
                  />

                  {/* Password Field */}
                  <TextField
                    label="Password"
                    type={showPassword ? "text" : "password"}
                    fullWidth
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockOutlinedIcon
                            sx={{ color: theme.palette.text.secondary }}
                          />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    {...register("password", {
                      required: "Password is required",
                      minLength: {
                        value: 6,
                        message: "Password must be at least 6 characters",
                      },
                    })}
                    error={!!errors.password}
                    helperText={errors.password?.message as string | undefined}
                  />

                  {/* Confirm Password Field (only for signup) */}
                  {mode === "signup" && (
                    <TextField
                      label="Confirm Password"
                      type={showConfirmPassword ? "text" : "password"}
                      fullWidth
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <LockOutlinedIcon
                              sx={{ color: theme.palette.text.secondary }}
                            />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle confirm password visibility"
                              onClick={() =>
                                setShowConfirmPassword(!showConfirmPassword)
                              }
                              edge="end"
                            >
                              {showConfirmPassword ? (
                                <VisibilityOff />
                              ) : (
                                <Visibility />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                      {...register("confirmPassword", {
                        required: "Please confirm your password",
                        validate: (value) =>
                          value === password || "Passwords do not match",
                      })}
                      error={!!errors.confirmPassword}
                      helperText={
                        errors.confirmPassword?.message as string | undefined
                      }
                    />
                  )}

                  <Divider sx={{ my: 1 }} />

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    fullWidth
                    disabled={isSubmitting}
                    sx={{
                      py: 1.5,
                      fontSize: 16,
                      fontWeight: 600,
                      backgroundColor: theme.palette.primary.main,
                      "&:hover": {
                        backgroundColor: theme.palette.primary.dark,
                      },
                    }}
                  >
                    {isSubmitting
                      ? mode === "login"
                        ? "Signing In..."
                        : "Creating Account..."
                      : mode === "login"
                      ? "Sign In"
                      : "Create Account"}
                  </Button>

                  {/* Additional Links */}
                  {mode === "login" && (
                    <Box textAlign="center">
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          cursor: "pointer",
                          "&:hover": { textDecoration: "underline" },
                        }}
                        onClick={() => {
                          showSnackbar(
                            "Forgot password feature coming soon",
                            "info"
                          );
                        }}
                      >
                        Forgot password?
                      </Typography>
                    </Box>
                  )}
                </Stack>
              </form>
            </CardContent>
          </Card>
        </Stack>
      </Container>
    </Box>
  );
};

const LoginPage = () => {
  return (
    <Suspense
      fallback={
        <Box
          sx={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CircularProgress />
        </Box>
      }
    >
      <LoginPageContent />
    </Suspense>
  );
};

export default withProviders(LoginPage);

