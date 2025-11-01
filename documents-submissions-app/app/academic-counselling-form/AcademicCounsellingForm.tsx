"use client";
import React from "react";
import { useForm } from "react-hook-form";
import {
  Box,
  TextField,
  MenuItem,
  Button,
  Typography,
  Stack,
} from "@mui/material";

const educationLevels = [
  "Matric",
  "O-Levels",
  "Intermediate",
  "A-Levels",
  "Bachelor's",
];

const counsellingPurposes = [
  "Subject Selection",
  "University Admission",
  "Career Direction",
];

const countries = ["Pakistan", "USA", "UK", "Germany", "Other"];

const languages = ["English", "Urdu", "Mix"];

const AcademicCounsellingForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data: unknown) => {
  };

  return (
    <Box sx={{ mx: "auto", mt: 6, p: 4 }}>
      <Typography variant="h5" component="h2" fontWeight={600} mb={3} textAlign="center">
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
          <TextField
            select
            label="Education Level"
            fullWidth
            {...register("educationLevel", {
              required: "Education level is required",
            })}
            error={!!errors.educationLevel}
          >
            {educationLevels.map((level) => (
              <MenuItem key={level} value={level}>
                {level}
              </MenuItem>
            ))}
          </TextField>

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
          <TextField
            select
            label="Counselling Purpose"
            fullWidth
            {...register("purpose", { required: "Purpose is required" })}
            error={!!errors.purpose}
          >
            {counsellingPurposes.map((item) => (
              <MenuItem key={item} value={item}>
                {item}
              </MenuItem>
            ))}
          </TextField>
        </Box>

        <Box sx={{ mt: 2 }}>
          <TextField
            label="Intended Field or Career Interest"
            fullWidth
            {...register("careerInterest")}
          />
        </Box>

        <Stack direction={{ xs: "column", sm: "row" }} spacing={2} mt={2}>
          <TextField select label="Preferred Country" fullWidth {...register("country")}>
            {countries.map((c) => (
              <MenuItem key={c} value={c}>
                {c}
              </MenuItem>
            ))}
          </TextField>

          <TextField select label="Preferred Language" fullWidth {...register("language")}>
            {languages.map((l) => (
              <MenuItem key={l} value={l}>
                {l}
              </MenuItem>
            ))}
          </TextField>
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
          Submit
        </Button>
      </form>
    </Box>
    </Box>
  );
};

export default AcademicCounsellingForm;
