import React from "react";
import { NavLink } from "react-router-dom";
import { Button, IconButton } from "@mui/material";

export default function NavItem({ Icon, to, title }) {
  return (
    <>
      {title ? (
        <Button component={NavLink} to={to} startIcon={<Icon />} size={"large"}>
          {title}
        </Button>
      ) : (
        <IconButton color="primary" size={"large"} component={NavLink} to={to}>
          <Icon fontSize={"large"} />
        </IconButton>
      )}
    </>
  );
}
