import { Alert, Snackbar } from "@mui/material";
import * as React from "react";

export function SnackBar({ open, setOpen, severity, message }) {
 return <Snackbar open={open} autoHideDuration={3000} onClose={() => setOpen({open:false})}>
    <Alert
      onClose={() => setOpen(false)}
      sx={{ width: "100%" }}
      severity={severity}
    >
      {message}
    </Alert>
  </Snackbar>;
}
