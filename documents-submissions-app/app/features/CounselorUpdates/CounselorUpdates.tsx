"use client";

import { useState, useMemo } from "react";
import {
  Box,
  Typography,
  Container,
  Card,
  CardContent,
  Stack,
  useTheme,
} from "@mui/material";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import { withProviders } from "@/app/hoc/withProviders";
import { realMessageObj } from "./dummyData";
import { Activity, DateGroup, RawActivity } from "./types";
import { formatDateKey } from "./helper";
import { DateGroupAccordion } from "./DateGroupAccordion";
import { HeaderSection } from "./HeaderSection";
import { EmptyState } from "./EmptyState";

const CounselorUpdates = () => {
  const theme = useTheme();
  
  // Sample data - in production, this would come from an API
  const [activities, setActivities] = useState<RawActivity[]>(realMessageObj);

  // Group activities by date
  const dateGroups = useMemo<DateGroup[]>(() => {
    const groups: { [key: string]: Activity[] } = {};
    activities.forEach((activity) => {
      const dateKey = formatDateKey(activity.dateCreated);
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      // Convert activity to match Activity interface (dateCreated -> timestamp)
      const convertedActivity: Activity = {
        id: activity.id,
        text: activity.text,
        sender: activity.sender as "student" | "counselor",
        timestamp: activity.dateCreated,
        ...(activity.documentUrl && { documentUrl: activity.documentUrl }),
        ...(activity.documentName && { documentName: activity.documentName }),
      };
      groups[dateKey].push(convertedActivity);
    });

    // Ensure current date is always included (even if no activities)
    const today = new Date();
    const todayKey = formatDateKey(today);
    if (!groups[todayKey]) {
      groups[todayKey] = [];
    }

    // Convert to array and sort by date (newest first)
    return Object.entries(groups)
      .map(([dateKey, activities]) => ({
        date: new Date(dateKey + "T00:00:00"),
        activities: activities.sort(
          (a, b) => a.timestamp.getTime() - b.timestamp.getTime()
        ),
      }))
      .sort((a, b) => b.date.getTime() - a.date.getTime());
  }, [activities]);
  
  const formatDisplayDate = (date: Date): string => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const dateKey = formatDateKey(date);
    const todayKey = formatDateKey(today);
    const yesterdayKey = formatDateKey(yesterday);
    
    if (dateKey === todayKey) {
      return "Today";
    } else if (dateKey === yesterdayKey) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    }
  };

  const isToday = (date: Date): boolean => {
    const today = new Date();
    return formatDateKey(date) === formatDateKey(today);
  };

  const handleActivityAdded = (newActivity: RawActivity) => {
    setActivities([...activities, newActivity]);
    console.log("New activity:", newActivity);
  };

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Stack spacing={4}>
        {/* Header Section */}
       <HeaderSection />

        {/* Timeline Container */}
        <Stack spacing={2}>
          {dateGroups.length === 0 ? (
            <EmptyState />
          ) : (
            dateGroups.map((group) => {
              const isCurrentDate = isToday(group.date);
              return (
                <DateGroupAccordion
                  key={formatDateKey(group.date)}
                  group={group}
                  isToday={isCurrentDate}
                  formatDisplayDate={formatDisplayDate}
                  onActivityAdded={isCurrentDate ? handleActivityAdded : undefined}
                />
              );
            })
          )}
        </Stack>
      </Stack>
    </Container>
  );
};

const CounselorUpdatesWithProviders = withProviders(CounselorUpdates);

export { CounselorUpdatesWithProviders as CounselorUpdates };
export default CounselorUpdatesWithProviders;