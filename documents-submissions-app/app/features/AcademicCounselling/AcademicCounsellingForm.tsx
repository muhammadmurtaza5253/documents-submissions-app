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
} from "@mui/material";
import { submitPersonalStudentData } from "../../services/studentService";
import {
  counsellingPurposes,
  countries,
  educationLevels,
  languages,
} from "./constants";
import { useState } from "react";
import { withProviders } from "@/app/hoc/withProviders";
import { useSnackbar } from "@/app/contexts/SnackbarProvider/useSnackbar";

const AcademicCounsellingForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { showSnackbar } = useSnackbar();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      fullName: "",
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

  const onSubmit = async (data: unknown) => {
    setIsLoading(true);
    const { resp, error } = await submitPersonalStudentData(data);
    setIsLoading(false);
    if (error) {
      showSnackbar("Error submitting data", "error");
    } else if (resp?.status === 200) {
      showSnackbar("Data submitted successfully", "success");
    }
  };

  return (
    <Box sx={{ mx: "auto", mt: 6, p: 4 }}>
      <Typography
        variant="h5"
        component="h2"
        fontWeight={600}
        mb={3}
        textAlign="center"
      >
        Submit your details here
      </Typography>
      <Box
        sx={{
          maxWidth: "900px",
          mx: "auto",
          mt: 6,
          p: 4,
          borderRadius: 3,
          boxShadow: 3,
          backgroundColor: "#fff",
        }}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <TextField
              label="Full Name"
              fullWidth
              {...register("fullName", { required: "Full Name is required" })}
              error={!!errors.fullName}
            />
            <TextField
              label="Email Address"
              fullWidth
              {...register("email", { required: "Email is required" })}
              error={!!errors.email}
            />
          </Stack>

          <Stack direction={{ xs: "column", sm: "row" }} spacing={2} mt={2}>
            <TextField
              label="Phone Number (WhatsApp)"
              fullWidth
              {...register("phone", { required: "Phone number is required" })}
              error={!!errors.phone}
            />
            <TextField
              label="City"
              fullWidth
              {...register("city", { required: "City is required" })}
              error={!!errors.city}
            />
          </Stack>

          <Stack direction={{ xs: "column", sm: "row" }} spacing={2} mt={2}>
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
                  helperText={errors.educationLevel?.message as string}
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
            />
          </Stack>

          <Box sx={{ mt: 2 }}>
            <TextField
              label="Field of Study / Subjects"
              fullWidth
              {...register("fieldOfStudy")}
            />
          </Box>

          <Box sx={{ mt: 2 }}>
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
                  helperText={errors.purpose?.message as string}
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
            />
          </Box>

          <Stack direction={{ xs: "column", sm: "row" }} spacing={2} mt={2}>
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

          <Box sx={{ mt: 2 }}>
            <TextField
              label="Short Description of Your Query"
              multiline
              rows={3}
              fullWidth
              {...register("description")}
            />
          </Box>

          <Button
            type="submit"
            variant="contained"
            sx={{
              mt: 3,
              px: 6,
              py: 1.3,
              fontSize: 16,
              display: "block",
              mx: "auto",
              backgroundColor: "#1976d2",
            }}
          >
            {isLoading ? (
              <CircularProgress size={20} sx={{ color: "white" }} />
            ) : (
              "Submit"
            )}
          </Button>
        </form>
      </Box>
    </Box>
  );
};

export default withProviders(AcademicCounsellingForm);
