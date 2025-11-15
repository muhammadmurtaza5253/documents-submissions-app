"use client";

import { useState, useRef, useEffect } from "react";
import {
  Box,
  Typography,
  Container,
  Card,
  CardContent,
  TextField,
  IconButton,
  Stack,
  Avatar,
  useTheme,
  Paper,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import PersonIcon from "@mui/icons-material/Person";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import { withProviders } from "@/app/hoc/withProviders";

interface Message {
  id: string;
  text: string;
  sender: "student" | "counselor";
  timestamp: Date;
}

const CounselorUpdates = () => {
  const theme = useTheme();
  const [messages, setMessages] = useState<Message[]>(() => {
    const now = Date.now();
    return [
      {
        id: "1",
        text: "Hello! How can I help you today?",
        sender: "counselor",
        timestamp: new Date(now - 3600000),
      },
      {
        id: "2",
        text: "Hi, I have a question about my academic application.",
        sender: "student",
        timestamp: new Date(now - 3300000),
      },
      {
        id: "3",
        text: "Of course! I'd be happy to help. What specific question do you have?",
        sender: "counselor",
        timestamp: new Date(now - 3000000),
      },
    ];
  });
  const [inputMessage, setInputMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (inputMessage.trim() === "") return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      sender: "student",
      timestamp: new Date(),
    };

    setMessages([...messages, newMessage]);
    setInputMessage("");

    // Simulate counselor response after a short delay
    setTimeout(() => {
      const counselorResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: "Thank you for your message. I'll get back to you shortly with more information.",
        sender: "counselor",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, counselorResponse]);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

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
              backgroundColor: theme.palette.info.light + "15",
              color: theme.palette.info.main,
              mb: 3,
            }}
          >
            <SupportAgentIcon sx={{ fontSize: 40 }} />
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
            Communicate with our counselor
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
            Chat with our counselor for guidance and support
          </Typography>
        </Box>

        {/* Chat Container */}
        <Card
          sx={{
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            borderRadius: 3,
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            height: "600px",
          }}
        >
          <CardContent
            sx={{
              p: 0,
              display: "flex",
              flexDirection: "column",
              height: "100%",
              overflow: "hidden",
            }}
          >
            {/* Messages Container */}
            <Box
              sx={{
                flex: 1,
                overflowY: "auto",
                p: 3,
                display: "flex",
                flexDirection: "column",
                gap: 2,
                backgroundColor: theme.palette.background.default,
                "&::-webkit-scrollbar": {
                  width: "8px",
                },
                "&::-webkit-scrollbar-track": {
                  background: theme.palette.grey[100],
                },
                "&::-webkit-scrollbar-thumb": {
                  background: theme.palette.grey[400],
                  borderRadius: "4px",
                  "&:hover": {
                    background: theme.palette.grey[500],
                  },
                },
              }}
            >
              {messages.map((message) => (
                <Box
                  key={message.id}
                  sx={{
                    display: "flex",
                    justifyContent:
                      message.sender === "student" ? "flex-end" : "flex-start",
                    alignItems: "flex-start",
                    gap: 1.5,
                  }}
                >
                  {message.sender === "counselor" && (
                    <Avatar
                      sx={{
                        bgcolor: theme.palette.info.main,
                        width: 36,
                        height: 36,
                      }}
                    >
                      <SupportAgentIcon sx={{ fontSize: 20 }} />
                    </Avatar>
                  )}
                  <Box
                    sx={{
                      maxWidth: "70%",
                      display: "flex",
                      flexDirection: "column",
                      gap: 0.5,
                    }}
                  >
                    <Paper
                      elevation={0}
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        backgroundColor:
                          message.sender === "student"
                            ? theme.palette.primary.main
                            : theme.palette.grey[200],
                        color:
                          message.sender === "student"
                            ? theme.palette.primary.contrastText
                            : theme.palette.text.primary,
                      }}
                    >
                      <Typography variant="body1" sx={{ wordBreak: "break-word" }}>
                        {message.text}
                      </Typography>
                    </Paper>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{
                        alignSelf:
                          message.sender === "student" ? "flex-end" : "flex-start",
                        px: 1,
                        fontSize: "0.7rem",
                      }}
                    >
                      {formatTime(message.timestamp)}
                    </Typography>
                  </Box>
                  {message.sender === "student" && (
                    <Avatar
                      sx={{
                        bgcolor: theme.palette.primary.main,
                        width: 36,
                        height: 36,
                      }}
                    >
                      <PersonIcon sx={{ fontSize: 20 }} />
                    </Avatar>
                  )}
                </Box>
              ))}
              <div ref={messagesEndRef} />
            </Box>

            {/* Input Container */}
            <Box
              sx={{
                p: 2,
                borderTop: `1px solid ${theme.palette.divider}`,
                backgroundColor: theme.palette.background.paper,
              }}
            >
              <Stack direction="row" spacing={1} alignItems="flex-end">
                <TextField
                  fullWidth
                  multiline
                  maxRows={4}
                  placeholder="Type your message..."
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  variant="outlined"
                  size="small"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                      backgroundColor: theme.palette.background.default,
                    },
                  }}
                />
                <IconButton
                  color="primary"
                  onClick={handleSendMessage}
                  disabled={inputMessage.trim() === ""}
                  sx={{
                    backgroundColor: theme.palette.primary.main,
                    color: theme.palette.primary.contrastText,
                    "&:hover": {
                      backgroundColor: theme.palette.primary.dark,
                    },
                    "&.Mui-disabled": {
                      backgroundColor: theme.palette.action.disabledBackground,
                      color: theme.palette.action.disabled,
                    },
                    width: 48,
                    height: 48,
                  }}
                >
                  <SendIcon />
                </IconButton>
              </Stack>
            </Box>
          </CardContent>
        </Card>
      </Stack>
    </Container>
  );
};

const CounselorUpdatesWithProviders = withProviders(CounselorUpdates);

export { CounselorUpdatesWithProviders as CounselorUpdates };
export default CounselorUpdatesWithProviders;