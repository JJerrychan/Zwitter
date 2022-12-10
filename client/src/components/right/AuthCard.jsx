import React from "react";
import { Box, Stack, Typography } from "@mui/material";

export default function AuthCard() {
  return (
    <Box
      component="section"
      sx={{
        padding: "10px",
        borderRadius: "16px",
        border: "1px solid rgb(239, 243, 244)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Stack>
        <Typography variant="h5" component="h2">
          New to Zwitter?
        </Typography>
        <Typography variant="body2" component="p">
          Sign up now to get your own personalized timeline!
        </Typography>
          
      </Stack>
    </Box>
  );
}
