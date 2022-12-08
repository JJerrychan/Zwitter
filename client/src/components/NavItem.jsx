import React from "react";
import { NavLink } from "react-router-dom";
import Button from '@mui/material-next/Button';


export default function NavItem({ Icon, to, title }) {
  return (
    <Button component={NavLink} to={to} startIcon={<Icon />} size={"large"}>
      {title}
    </Button>
  );
}
