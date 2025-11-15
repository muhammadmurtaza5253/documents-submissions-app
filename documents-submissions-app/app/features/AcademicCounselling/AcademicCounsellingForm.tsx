"use client";
import { useForm, Controller } from "react-hook-form";
import {
  Box,
  TextField,
  MenuItem,
  Button,
  Typography,
  Stack,
  CircularProgress,
  Container,
  Card,
  CardContent,
  Divider,
  useTheme,
} from "@mui/material";
import { submitPersonalStudentData, fetchExistingFormData } from "../../services/studentService";
import {
  counsellingPurposes,
  countries,
  educationLevels,
  languages,
} from "./constants";
import { useState, useEffect } from "react";
import { withProviders } from "@/app/hoc/withProviders";
import { useSnackbar } from "@/app/contexts/SnackbarProvider/useSnackbar";
import SchoolIcon from "@mui/icons-material/School";

const AcademicCounsellingForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const { showSnackbar } = useSnackbar();
  const theme = useTheme();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      phone: "",
      city: "",
      educationLevel: "",
      institution: "",
      fieldOfStudy: "",
      purpose: "",
      careerInterest: "",
      country: "",
      language: "",
      description: "",
    },
  });

  // Load existing form data on component mount
  useEffect(() => {
    const loadExistingData = async () => {
      setIsLoadingData(true);
      const { error, data } = await fetchExistingFormData();
      
      if (!error && data) {
        // Check if any form field has data (user has filled the form before)
        const hasData = Object.values(data).some(value => value && value !== "");
        
        if (hasData) {
          // Populate form with existing data
          reset(data);
          showSnackbar("Your previous details has been loaded again", "info");
        }
      }
      
      setIsLoadingData(false);
    };

    loadExistingData();
  }, [reset, showSnackbar]);

  const onSubmit = async (data: unknown) => {
    setIsLoading(true);
    const { resp, error } = await submitPersonalStudentData(data);
    setIsLoading(false);
    if (error) {
      showSnackbar("Error submitting data", "error");
    } else if (resp?.status === 200) {
      showSnackbar("Data submitted successfully", "success");
      // Reload the form data to show the updated values
      const { error: fetchError, data: updatedData } = await fetchExistingFormData();
      if (!fetchError && updatedData) {
        reset(updatedData);
      }
    }
  };

  // Show loading state while fetching existing data
  if (isLoadingData) {
    return (
      <Container maxWidth="md" sx={{ py: 6 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
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
            <SchoolIcon sx={{ fontSize: 40 }} />
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
            Academic Counselling Form
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
            Fill out the form below to get personalized academic guidance and support
          </Typography>
        </Box>

        {/* Form Card */}
        <Card
          sx={{
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            borderRadius: 3,
            overflow: "hidden",
          }}
        >
          <CardContent sx={{ p: 4 }}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Stack spacing={3}>
                {/* Personal Information Section */}
                <Box>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 600,
                      color: theme.palette.text.primary,
                      mb: 2,
                    }}
                  >
                    Personal Information
                  </Typography>
                  <Divider sx={{ mb: 3 }} />
                  <TextField
                    label="Email Address"
                    fullWidth
                    type="email"
                    {...register("email", { required: "Email is required" })}
                    error={!!errors.email}
                    helperText={errors.email?.message as string | undefined}
                  />

                  <Stack
                    direction={{ xs: "column", sm: "row" }}
                    spacing={2}
                    mt={2}
                  >
                    <TextField
                      label="Phone Number (WhatsApp)"
                      fullWidth
                      {...register("phone", {
                        required: "Phone number is required",
                      })}
                      error={!!errors.phone}
                      helperText={errors.phone?.message as string | undefined}
                    />
                    <TextField
                      label="City"
                      fullWidth
                      {...register("city", { required: "City is required" })}
                      error={!!errors.city}
                      helperText={errors.city?.message as string | undefined}
                    />
                  </Stack>
                </Box>

                {/* Educational Background Section */}
                <Box>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 600,
                      color: theme.palette.text.primary,
                      mb: 2,
                      mt: 2,
                    }}
                  >
                    Educational Background
                  </Typography>
                  <Divider sx={{ mb: 3 }} />
                  <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                    <Controller
                      name="educationLevel"
                      control={control}
                      rules={{ required: "Education level is required" }}
                      render={({ field }) => (
                        <TextField
                          select
                          label="Education Level"
                          fullWidth
                          {...field}
                          error={!!errors.educationLevel}
                          helperText={
                            errors.educationLevel?.message as string | undefined
                          }
                        >
                          {educationLevels.map((level) => (
                            <MenuItem key={level} value={level}>
                              {level}
                            </MenuItem>
                          ))}
                        </TextField>
                      )}
                    />

                    <TextField
                      label="Institution Name"
                      fullWidth
                      {...register("institution", {
                        required: "Institution is required",
                      })}
                      error={!!errors.institution}
                      helperText={
                        errors.institution?.message as string | undefined
                      }
                    />
                  </Stack>

                  <Box sx={{ mt: 2 }}>
                    <TextField
                      label="Field of Study / Subjects"
                      fullWidth
                      {...register("fieldOfStudy")}
                      helperText="Optional: Enter your current or intended field of study"
                    />
                  </Box>
                </Box>

                {/* Counselling Details Section */}
                <Box>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 600,
                      color: theme.palette.text.primary,
                      mb: 2,
                      mt: 2,
                    }}
                  >
                    Counselling Details
                  </Typography>
                  <Divider sx={{ mb: 3 }} />
                  <Box>
                    <Controller
                      name="purpose"
                      control={control}
                      rules={{ required: "Purpose is required" }}
                      render={({ field }) => (
                        <TextField
                          select
                          label="Counselling Purpose"
                          fullWidth
                          {...field}
                          error={!!errors.purpose}
                          helperText={
                            errors.purpose?.message as string | undefined
                          }
                        >
                          {counsellingPurposes.map((item) => (
                            <MenuItem key={item} value={item}>
                              {item}
                            </MenuItem>
                          ))}
                        </TextField>
                      )}
                    />
                  </Box>

                  <Box sx={{ mt: 2 }}>
                    <TextField
                      label="Intended Field or Career Interest"
                      fullWidth
                      {...register("careerInterest")}
                      helperText="Optional: Describe your career interests or goals"
                    />
                  </Box>

                  <Stack
                    direction={{ xs: "column", sm: "row" }}
                    spacing={2}
                    mt={2}
                  >
                    <Controller
                      name="country"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          select
                          label="Preferred Country"
                          fullWidth
                          {...field}
                        >
                          {countries.map((c) => (
                            <MenuItem key={c} value={c}>
                              {c}
                            </MenuItem>
                          ))}
                        </TextField>
                      )}
                    />

                    <Controller
                      name="language"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          select
                          label="Preferred Language"
                          fullWidth
                          {...field}
                        >
                          {languages.map((l) => (
                            <MenuItem key={l} value={l}>
                              {l}
                            </MenuItem>
                          ))}
                        </TextField>
                      )}
                    />
                  </Stack>
                </Box>

                {/* Additional Information Section */}
                <Box>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 600,
                      color: theme.palette.text.primary,
                      mb: 2,
                      mt: 2,
                    }}
                  >
                    Additional Information
                  </Typography>
                  <Divider sx={{ mb: 3 }} />
                  <TextField
                    label="Short Description of Your Query"
                    multiline
                    rows={4}
                    fullWidth
                    {...register("description")}
                    helperText="Optional: Provide any additional details about your query or requirements"
                  />
                </Box>

                {/* Submit Button */}
                <Box sx={{ mt: 2, display: "flex", justifyContent: "center" }}>
                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    disabled={isLoading}
                    sx={{
                      px: 6,
                      py: 1.5,
                      fontSize: 16,
                      minWidth: 200,
                      backgroundColor: theme.palette.primary.main,
                      "&:hover": {
                        backgroundColor: theme.palette.primary.dark,
                      },
                    }}
                  >
                    {isLoading ? (
                      <CircularProgress size={24} sx={{ color: "white" }} />
                    ) : (
                      "Submit Form"
                    )}
                  </Button>
                </Box>
              </Stack>
            </form>
          </CardContent>
        </Card>
      </Stack>
    </Container>
  );
};

export default withProviders(AcademicCounsellingForm);
