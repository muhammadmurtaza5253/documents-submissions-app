import { useState, useRef } from "react";
import {
  Box,
  Typography,
  Stack,
  TextField,
  IconButton,
  Button,
  LinearProgress,
  Divider,
  useTheme,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import DeleteIcon from "@mui/icons-material/Delete";
import { useSnackbar } from "@/app/contexts/SnackbarProvider/useSnackbar";
import { RawActivity } from "./types";
import { formatDateKey } from "./helper";

interface TodayActivityInputProps {
  onSend: (activity: RawActivity) => void;
  hasActivities: boolean;
}

export const TodayActivityInput = ({
  onSend,
  hasActivities,
}: TodayActivityInputProps) => {
  const theme = useTheme();
  const { showSnackbar } = useSnackbar();
  const [inputMessage, setInputMessage] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleFileUpload = async (): Promise<string | null> => {
    if (!selectedFile) return null;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      const response = await fetch("/api/documents", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        showSnackbar("Failed to upload file. Please try again.", "error");
        return null;
      }

      const data = await response.json();
      showSnackbar("File uploaded successfully!", "success");
      return data.url;
    } catch (error) {
      console.error("Error uploading file:", error);
      showSnackbar("Failed to upload file. Please try again.", "error");
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleSendMessage = async () => {
    if (inputMessage.trim() === "" && !selectedFile) return;

    let documentUrl: string | undefined;
    let documentName: string | undefined;

    // Upload file if selected
    if (selectedFile) {
      const uploadedUrl = await handleFileUpload();
      if (uploadedUrl) {
        documentUrl = uploadedUrl;
        documentName = selectedFile.name;
      }
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }

    // Create new raw activity
    const newActivity: RawActivity = {
      id: Date.now().toString(),
      text: inputMessage.trim() || (documentName ? `Uploaded: ${documentName}` : ""),
      sender: "student",
      dateCreated: new Date(),
      ...(documentUrl && { documentUrl }),
      ...(documentName && { documentName }),
    };

    showSnackbar("Your response has been sent!", "success");
    setInputMessage("");
    console.log("newActivity", newActivity);
    onSend(newActivity);
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <>
      {hasActivities && <Divider sx={{ mx: 3 }} />}
      <Box sx={{ p: 3 }}>
        <Stack spacing={2}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
            Add Your Response
          </Typography>

          {/* File Upload Section */}
          <Box>
            <input
              ref={fileInputRef}
              type="file"
              style={{ display: "none" }}
              onChange={handleFileSelect}
            />
            {selectedFile ? (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  p: 1.5,
                  borderRadius: 1,
                  backgroundColor: theme.palette.grey[100],
                  mb: 2,
                }}
              >
                <AttachFileIcon
                  sx={{ fontSize: 20, color: theme.palette.text.secondary }}
                />
                <Typography variant="body2" sx={{ flex: 1 }}>
                  {selectedFile.name}
                </Typography>
                <IconButton
                  size="small"
                  onClick={handleRemoveFile}
                  sx={{ color: theme.palette.error.main }}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Box>
            ) : (
              <Button
                variant="outlined"
                startIcon={<AttachFileIcon />}
                onClick={() => fileInputRef.current?.click()}
                sx={{ mb: 2 }}
              >
                Attach Document
              </Button>
            )}
          </Box>

          {/* Text Input */}
          <TextField
            fullWidth
            multiline
            rows={3}
            placeholder="Type your response..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            variant="outlined"
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
              },
            }}
          />

          {/* Upload Progress */}
          {uploading && (
            <Box sx={{ width: "100%" }}>
              <LinearProgress />
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ mt: 0.5, display: "block" }}
              >
                Uploading file...
              </Typography>
            </Box>
          )}

          {/* Send Button */}
          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <Button
              variant="contained"
              endIcon={<SendIcon />}
              onClick={handleSendMessage}
              disabled={
                (inputMessage.trim() === "" && !selectedFile) || uploading
              }
              sx={{
                borderRadius: 2,
                px: 3,
              }}
            >
              Send
            </Button>
          </Box>
        </Stack>
      </Box>
    </>
  );
};

