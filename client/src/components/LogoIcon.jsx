import { ReactComponent as Logo } from "../public/zwitter-logo/svg/logo-primary.svg";
import React from "react";
import { SvgIcon } from "@mui/material";

export default function LogoIcon(props) {
  return <SvgIcon {...props} component={Logo}/>;
}
