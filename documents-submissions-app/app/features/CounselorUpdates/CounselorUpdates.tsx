"use client";

import { useState, useMemo, useEffect } from "react";
import { CircularProgress, Container, Stack } from "@mui/material";
import { withProviders } from "@/app/hoc/withProviders";
import { realMessageObj } from "./dummyData";
import { Message, DateGroup } from "./types";
import { formatDateKey } from "./helper";
import { DateGroupAccordion } from "./DateGroupAccordion";
import { HeaderSection } from "./HeaderSection";
import { EmptyState } from "./EmptyState";
import { getUserId } from "@/app/utils/getUserId";
import { useSnackbar } from "@/app/contexts/SnackbarProvider/useSnackbar";

const CounselorUpdates = () => {
  // Sample data - in production, this would come from an API
  const [messages, setMessages] = useState<Message[]>(realMessageObj);
  const [loading, setLoading] = useState(true);
  const { showSnackbar } = useSnackbar();

  // Group activities by date
  const dateGroups = useMemo<{ [key: string]: Message[] }>(() => {
    const groups: { [key: string]: Message[] } = {};
    messages.forEach((message) => {
      const dateKey = formatDateKey(message.date || "");
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      // Convert activity to match Activity interface (dateCreated -> timestamp)
      groups[dateKey].push(message);
    });

    // Ensure current date is always included (even if no activities)
    const today = new Date();
    const todayKey = formatDateKey(today);
    if (!groups[todayKey]) {
      groups[todayKey] = [];
    }
    if (Object.keys(groups).length > 1) {
      console.log("groups", groups);
    }
    return groups;
  }, [messages]);

  useEffect(() => {
    const fetchMessages = async () => {
      const studentId = getUserId();
      const response = await fetch(
        `/api/followups/conversations?student_id=${studentId}`
      );
      const data = await response.json();
      if (data.success) {
        console.log("data.messages from api", data.messages);
        setMessages(data.messages);
      }
      setLoading(false);
    };
    fetchMessages();
  }, []);

  const formatDisplayDate = (date: Date | string): string => {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const dateKey = formatDateKey(dateObj);
    const todayKey = formatDateKey(today);
    const yesterdayKey = formatDateKey(yesterday);

    if (dateKey === todayKey) {
      return "Today";
    } else if (dateKey === yesterdayKey) {
      return "Yesterday";
    } else {
      return dateObj.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    }
  };

  const isToday = (date: string): boolean => {
    const today = new Date();
    return date === formatDateKey(today);
  };

  const handleActivityAdded = async (newMessage: Message) => {
    try {
      const studentId = getUserId();
      
      if (!studentId) {
        showSnackbar("User ID not found. Please log in again.", "error");
        return;
      }

      // Prepare the message data for the API
      const messageData = {
        student_id: studentId,
        message: newMessage.message,
        sender: newMessage.sender,
        date: newMessage.date || new Date(),
        ...(newMessage.documentUrl && { documentUrl: newMessage.documentUrl }),
        ...(newMessage.documentName && { documentName: newMessage.documentName }),
      };

      // Send message to API
      const response = await fetch("/api/followups/conversations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(messageData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Update local state only after successful API call
        setMessages((prev) => [...prev, newMessage]);
        showSnackbar("Your response has been sent!", "success");
      } else {
        showSnackbar(
          data.error || "Failed to send message. Please try again.",
          "error" 
        );
      }
    } catch (error) {
      console.error("Error sending message:", error);
      showSnackbar("Failed to send message. Please try again.", "error");
    }
  };

  if (loading) {
    return (
      <Stack
        minHeight="100vh"
        width="100%"
        alignItems="center"
        justifyContent="center"
      >
        <CircularProgress />
      </Stack>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Stack spacing={4}>
        {/* Header Section */}
        <HeaderSection />

        {/* Timeline Container */}
        <Stack spacing={2}>
          {Object.keys(dateGroups).length === 0 ? (
            <EmptyState />
          ) : (
            Object.keys(dateGroups)
              .sort()
              .reverse()
              .map((dateKey) => {
                const isCurrentDate = isToday(dateKey);
                const group: DateGroup = {
                  date: new Date(dateKey),
                  activities: dateGroups[dateKey] || [],
                };
                return (
                  <DateGroupAccordion
                    key={dateKey}
                    group={group}
                    isToday={isCurrentDate}
                    formatDisplayDate={formatDisplayDate}
                    onMessageAdded={
                      isCurrentDate ? handleActivityAdded : undefined
                    }
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
