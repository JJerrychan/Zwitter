import React from "react";
import { Box, Stack, Typography } from "@mui/material";
import { Button } from "@mui/material-next";
import { Email, Google } from "@mui/icons-material";

export default function AuthCard() {
  return (
    <Box
      component="section"
      sx={{
        marginY: "10px",
        padding: "15px",
        borderRadius: "16px",
        border: "1px solid #eff3f4",
      }}
    >
      <Stack spacing={1}>
        <Typography fontWeight="bold" variant="h5" component="h2">
          New to Zwitter?
        </Typography>
        <Typography color="#536471" variant="body2" component="p">
          Sign up now to get your own personalized timeline!
        </Typography>
        <Button
          sx={{ fontWeight: "bold" }}
          size="small"
          variant="outlined"
          startIcon={<Google />}
        >
          Sign in/up with Google
        </Button>
        <Button
          sx={{ fontWeight: "bold" }}
          size="small"
          variant="outlined"
          startIcon={<Email />}
        >
          Sign in with Email
        </Button>
        <Button
          sx={{ fontWeight: "bold" }}
          size="small"
          variant="outlined"
          startIcon={<Email />}
        >
          Sign up with Email
        </Button>
        <Typography
          color="#536471"
          fontSize="small"
          variant="body2"
          component="p"
        >
          By signing up, you agree to the Terms of Service and Privacy Policy,
          which includes the terms of use of cookies.
        </Typography>
      </Stack>
    </Box>
  );
}
