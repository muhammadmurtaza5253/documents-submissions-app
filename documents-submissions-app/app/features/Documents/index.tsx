"use client";
import { useState, useRef } from "react";
import {
  Box,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  List,
  ListItem,
  ListItemText,
  Button,
  Stack,
  Paper,
  Chip,
  CircularProgress,
} from "@mui/material";
import { documentTypes } from "./constants";
import { withProviders } from "@/app/hoc/withProviders";
import { useSnackbar } from "@/app/contexts/SnackbarProvider/useSnackbar";

interface SelectedDocument {
  id: string;
  name: string;
  file: File | null;
  url?: string;
  uploading?: boolean;
}

const Documents = () => {
  const [selectedDocuments, setSelectedDocuments] = useState<SelectedDocument[]>([]);
  const [selectedDocType, setSelectedDocType] = useState<string>("");
  const { showSnackbar } = useSnackbar();
  const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

  const handleSelectDocument = (docType: string) => {
    if (!docType || selectedDocuments.some((doc) => doc.name === docType)) {
      return;
    }

    const newDocument: SelectedDocument = {
      id: Date.now().toString(),
      name: docType,
      file: null,
    };

    setSelectedDocuments([...selectedDocuments, newDocument]);
    setSelectedDocType("");
  };

  const handleFileUpload = async (documentId: string, file: File) => {
    // Set uploading state
    setSelectedDocuments((prev) =>
      prev.map((doc) =>
        doc.id === documentId ? { ...doc, file, uploading: true } : doc
      )
    );

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/documents", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        // Reset file state on error - show upload button again
        setSelectedDocuments((prev) =>
          prev.map((doc) =>
            doc.id === documentId ? { ...doc, file: null, url: undefined, uploading: false } : doc
          )
        );
        // Clear the file input so the same file can be selected again
        const input = fileInputRefs.current[documentId];
        if (input) {
          input.value = "";
        }
        showSnackbar("Failed to upload file. Please try again.", "error");
        return;
      }

      const data = await response.json();

      // Store the URL in the document object
      setSelectedDocuments((prev) =>
        prev.map((doc) =>
          doc.id === documentId
            ? { ...doc, file, url: data.url, uploading: false }
            : doc
        )
      );

      // Clear the file input so the same file can be selected again if needed
      const input = fileInputRefs.current[documentId];
      if (input) {
        input.value = "";
      }

      showSnackbar("File uploaded successfully!", "success");
    } catch (error) {
      console.error("Error uploading file:", error);
      // Reset file state on error - show upload button again
      setSelectedDocuments((prev) =>
        prev.map((doc) =>
          doc.id === documentId ? { ...doc, file: null, url: undefined, uploading: false } : doc
        )
      );
      // Clear the file input so the same file can be selected again
      const input = fileInputRefs.current[documentId];
      if (input) {
        input.value = "";
      }
      showSnackbar("Failed to upload file. Please try again.", "error");
    }
  };

  const handleRemoveDocument = (documentId: string) => {
    setSelectedDocuments((prev) =>
      prev.filter((doc) => doc.id !== documentId)
    );
  };

  const handleFileChange = (
    documentId: string,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0] || null;
    if (file) {
      handleFileUpload(documentId, file);
    }
  };

  const handleViewDocument = (url: string) => {
    window.open(url, "_blank");
  };

  const availableDocuments = documentTypes.filter(
    (doc) => !selectedDocuments.some((selected) => selected.name === doc)
  );

  return (
    <Box sx={{ mx: "auto", mt: 6, p: 4, maxWidth: "1000px" }}>
      <Typography
        variant="h5"
        component="h2"
        fontWeight={600}
        mb={3}
        textAlign="center"
      >
        Submit your documents here
      </Typography>

      <Paper
        elevation={3}
        sx={{
          p: 4,
          borderRadius: 3,
          backgroundColor: "#fff",
        }}
      >
        <Box sx={{ mb: 4 }}>
          <FormControl fullWidth>
            <InputLabel id="document-select-label">
              Select a document type
            </InputLabel>
            <Select
              labelId="document-select-label"
              id="document-select"
              value={selectedDocType}
              label="Select a document type"
              onChange={(e) => handleSelectDocument(e.target.value)}
            >
              {availableDocuments.map((doc) => (
                <MenuItem key={doc} value={doc}>
                  {doc}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {selectedDocuments.length > 0 && (
          <Box>
            <Typography variant="h6" component="h3" fontWeight={500} mb={2}>
              Selected Documents
            </Typography>
            <List>
              {selectedDocuments.map((doc) => (
                <ListItem
                  key={doc.id}
                  sx={{
                    mb: 2,
                    border: "1px solid #e0e0e0",
                    borderRadius: 2,
                    bgcolor: "#fafafa",
                  }}
                  secondaryAction={
                    <Stack direction="row" spacing={1} alignItems="center">
                      <input
                        accept="*/*"
                        style={{ display: "none" }}
                        id={`file-upload-${doc.id}`}
                        type="file"
                        ref={(el) => {
                          fileInputRefs.current[doc.id] = el;
                        }}
                        onChange={(e) => handleFileChange(doc.id, e)}
                        disabled={doc.uploading}
                      />
                      <label htmlFor={`file-upload-${doc.id}`}>
                        <Button
                          variant="outlined"
                          component="span"
                          sx={{ mr: 1 }}
                          disabled={doc.uploading}
                        >
                          {doc.file ? "Change File" : "Upload"}
                        </Button>
                      </label>
                      {doc.uploading && (
                        <CircularProgress size={20} sx={{ mr: 1 }} />
                      )}
                      {doc.file && !doc.uploading && (
                        <Chip
                          label={doc.file.name}
                          size="small"
                          color="success"
                          sx={{ mr: 1 }}
                        />
                      )}
                      {doc.url && (
                        <Button
                          variant="contained"
                          color="primary"
                          size="small"
                          onClick={() => handleViewDocument(doc.url!)}
                          sx={{ mr: 1 }}
                        >
                          View Document
                        </Button>
                      )}
                      <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        onClick={() => handleRemoveDocument(doc.id)}
                        sx={{ minWidth: "auto" }}
                        disabled={doc.uploading}
                      >
                        Remove
                      </Button>
                    </Stack>
                  }
                >
                  <ListItemText primary={doc.name} />
                </ListItem>
              ))}
            </List>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default withProviders(Documents);