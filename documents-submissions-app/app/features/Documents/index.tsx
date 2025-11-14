"use client";
import { useState, useRef } from "react";
import {
  Box,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Stack,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Container,
  Divider,
  IconButton,
  useTheme,
} from "@mui/material";
import { documentTypes } from "./constants";
import { withProviders } from "@/app/hoc/withProviders";
import { useSnackbar } from "@/app/contexts/SnackbarProvider/useSnackbar";
import DescriptionIcon from "@mui/icons-material/Description";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

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
  const theme = useTheme();
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
            <DescriptionIcon sx={{ fontSize: 40 }} />
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
            Document Submission
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
            Upload and submit your required documents for review and processing
          </Typography>
        </Box>

        {/* Main Card */}
        <Card
          sx={{
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            borderRadius: 3,
            overflow: "hidden",
          }}
        >
          <CardContent sx={{ p: 4 }}>
            <Stack spacing={4}>
              {/* Document Selection */}
              <Box>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 600,
                    color: theme.palette.text.primary,
                    mb: 2,
                  }}
                >
                  Add Document
                </Typography>
                <Divider sx={{ mb: 3 }} />
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
                {availableDocuments.length === 0 && (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 2, fontStyle: "italic" }}
                  >
                    All document types have been added
                  </Typography>
                )}
              </Box>

              {/* Selected Documents List */}
              {selectedDocuments.length > 0 && (
                <Box>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 600,
                      color: theme.palette.text.primary,
                      mb: 2,
                    }}
                  >
                    Selected Documents ({selectedDocuments.length})
                  </Typography>
                  <Divider sx={{ mb: 3 }} />
                  <Stack spacing={2}>
                    {selectedDocuments.map((doc) => (
                      <Card
                        key={doc.id}
                        variant="outlined"
                        sx={{
                          border: `1px solid ${theme.palette.divider}`,
                          borderRadius: 2,
                          transition: "all 0.2s ease-in-out",
                          "&:hover": {
                            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                          },
                        }}
                      >
                        <CardContent sx={{ "&:last-child": { pb: 2 } }}>
                          <Stack
                            direction={{ xs: "column", sm: "row" }}
                            spacing={2}
                            alignItems={{ xs: "flex-start", sm: "center" }}
                            justifyContent="space-between"
                          >
                            <Box sx={{ flex: 1, minWidth: 0 }}>
                              <Typography
                                variant="subtitle1"
                                sx={{
                                  fontWeight: 600,
                                  color: theme.palette.text.primary,
                                }}
                              >
                                {doc.name}
                              </Typography>
                              {doc.file && !doc.uploading && (
                                <Chip
                                  icon={<CheckCircleIcon />}
                                  label={doc.file.name}
                                  size="small"
                                  color="success"
                                  sx={{ mt: 1 }}
                                />
                              )}
                            </Box>

                            <Stack
                              direction="row"
                              spacing={1}
                              alignItems="center"
                              flexWrap="wrap"
                            >
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
                                  variant={doc.file ? "outlined" : "contained"}
                                  component="span"
                                  startIcon={
                                    doc.uploading ? (
                                      <CircularProgress size={16} />
                                    ) : (
                                      <CloudUploadIcon />
                                    )
                                  }
                                  disabled={doc.uploading}
                                  sx={{
                                    backgroundColor: doc.file
                                      ? "transparent"
                                      : theme.palette.primary.main,
                                    color: doc.file
                                      ? theme.palette.primary.main
                                      : "white",
                                    borderColor: theme.palette.primary.main,
                                    "&:hover": {
                                      backgroundColor: doc.file
                                        ? theme.palette.primary.light + "10"
                                        : theme.palette.primary.dark,
                                      borderColor: theme.palette.primary.dark,
                                    },
                                  }}
                                >
                                  {doc.uploading
                                    ? "Uploading..."
                                    : doc.file
                                    ? "Change File"
                                    : "Upload File"}
                                </Button>
                              </label>

                              {doc.url && (
                                <Button
                                  variant="outlined"
                                  size="small"
                                  startIcon={<VisibilityIcon />}
                                  onClick={() => handleViewDocument(doc.url!)}
                                  sx={{
                                    borderColor: theme.palette.info.main,
                                    color: theme.palette.info.main,
                                    "&:hover": {
                                      borderColor: theme.palette.info.dark,
                                      backgroundColor:
                                        theme.palette.info.light + "10",
                                    },
                                  }}
                                >
                                  View
                                </Button>
                              )}

                              <IconButton
                                color="error"
                                onClick={() => handleRemoveDocument(doc.id)}
                                disabled={doc.uploading}
                                sx={{
                                  "&:hover": {
                                    backgroundColor: theme.palette.error.light + "15",
                                  },
                                }}
                              >
                                <DeleteIcon />
                              </IconButton>
                            </Stack>
                          </Stack>
                        </CardContent>
                      </Card>
                    ))}
                  </Stack>
                </Box>
              )}

              {selectedDocuments.length === 0 && (
                <Box
                  sx={{
                    textAlign: "center",
                    py: 6,
                    border: `2px dashed ${theme.palette.divider}`,
                    borderRadius: 2,
                    backgroundColor: theme.palette.grey[50],
                  }}
                >
                  <DescriptionIcon
                    sx={{
                      fontSize: 48,
                      color: theme.palette.grey[400],
                      mb: 2,
                    }}
                  />
                  <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{ fontStyle: "italic" }}
                  >
                    No documents selected yet. Choose a document type above to get
                    started.
                  </Typography>
                </Box>
              )}
            </Stack>
          </CardContent>
        </Card>
      </Stack>
    </Container>
  );
};

export default withProviders(Documents);