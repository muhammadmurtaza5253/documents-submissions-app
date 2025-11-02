"use client";

import { Button, Stack, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export const StudentHomepage = () => {
  const router = useRouter();

  const academicCounsellingFormClick = () => {
    router.push("/academic-counselling-form");
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/users");
      const data = await response.json();
      console.log(data);
    }
    catch (error) {
      console.error("Error fetching users:", error);  
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <Stack mt={3} mx="auto" maxWidth="900px" spacing={5}>
      <Typography variant="h3" component="h1">Hello Student!</Typography>
      <Stack direction="row" justifyContent="space-around">
        <Button variant="contained" onClick={academicCounsellingFormClick}>Academic Counselling Form</Button>
        <Button variant="contained">Check Status</Button>
        <Button variant="contained">Submit Your Documents</Button>
      </Stack>
    </Stack>
  );
};
