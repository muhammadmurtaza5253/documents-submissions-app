import { Box, Avatar, Typography, Paper, useTheme } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import { Activity } from "./types";

interface ActivityItemProps {
  activity: Activity;
}

export const ActivityItem = ({ activity }: ActivityItemProps) => {
  const theme = useTheme();

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          gap: 2,
          alignItems: "flex-start",
        }}
      >
        {/* Avatar */}
        <Avatar
          sx={{
            bgcolor:
              activity.sender === "counselor"
                ? theme.palette.info.main
                : theme.palette.primary.main,
            width: 40,
            height: 40,
          }}
        >
          {activity.sender === "counselor" ? (
            <SupportAgentIcon sx={{ fontSize: 22 }} />
          ) : (
            <PersonIcon sx={{ fontSize: 22 }} />
          )}
        </Avatar>

        {/* Activity Content */}
        <Box sx={{ flex: 1 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              mb: 1,
            }}
          >
            <Typography
              variant="subtitle2"
              sx={{
                fontWeight: 600,
                color:
                  activity.sender === "counselor"
                    ? theme.palette.info.main
                    : theme.palette.primary.main,
              }}
            >
              {activity.sender === "counselor" ? "Counselor" : "You"}
            </Typography>
          </Box>
          <Paper
            elevation={0}
            sx={{
              p: 2,
              borderRadius: 2,
              backgroundColor:
                activity.sender === "counselor"
                  ? theme.palette.grey[100]
                  : theme.palette.primary.light + "20",
              borderLeft: `4px solid ${
                activity.sender === "counselor"
                  ? theme.palette.info.main
                  : theme.palette.primary.main
              }`,
            }}
          >
            <Typography
              variant="body1"
              sx={{ wordBreak: "break-word", mb: activity.documentUrl ? 1 : 0 }}
            >
              {activity.text}
            </Typography>
            {activity.documentUrl && (
              <Box
                sx={{
                  mt: 1,
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <AttachFileIcon
                  sx={{ fontSize: 16, color: theme.palette.text.secondary }}
                />
                <Typography
                  variant="caption"
                  component="a"
                  href={activity.documentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    color: theme.palette.primary.main,
                    textDecoration: "none",
                    "&:hover": {
                      textDecoration: "underline",
                    },
                  }}
                >
                  {activity.documentName || "View Document"}
                </Typography>
              </Box>
            )}
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

