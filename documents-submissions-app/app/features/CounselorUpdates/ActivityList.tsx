import { Box, Stack, Divider } from "@mui/material";
import { Activity } from "./types";
import { ActivityItem } from "./ActivityItem";

interface ActivityListProps {
  activities: Activity[];
}

export const ActivityList = ({ activities }: ActivityListProps) => {
  if (activities.length === 0) {
    return null;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Stack spacing={2.5}>
        {activities.map((activity, activityIndex) => (
          <Box key={activity.id}>
            <ActivityItem activity={activity} />
            {/* Divider between activities (not after last one) */}
            {activityIndex < activities.length - 1 && (
              <Divider sx={{ mt: 2.5, ml: 7 }} />
            )}
          </Box>
        ))}
      </Stack>
    </Box>
  );
};

