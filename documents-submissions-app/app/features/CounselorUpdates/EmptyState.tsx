import { Card, CardContent, Typography } from "@mui/material";

export const EmptyState = () => {
  return (
    <Card>
      <CardContent sx={{ textAlign: "center", py: 6 }}>
        <Typography variant="body1" color="text.secondary">
          No updates yet. Your counselor will add updates here.
        </Typography>
      </CardContent>
    </Card>
  );
};
