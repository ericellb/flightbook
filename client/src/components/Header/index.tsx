import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  makeStyles,
  Container
} from "@material-ui/core";
import { OfflineBolt, AirplanemodeActive, Bookmark } from "@material-ui/icons";

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1
  },
  menuButton: {
    marginRight: theme.spacing(2)
  },
  title: {
    flexGrow: 1,
    color: "#2b2e4a"
  },
  flex: {
    display: "flex",
    alignItems: "center"
  },
  icon: {
    marginRight: "0.3em",
    height: "100%",
    width: "40px"
  }
}));

export default function Header() {
  const classes = useStyles({});

  return (
    <AppBar position="sticky">
      <Container>
        <Toolbar>
          <Typography
            variant="h4"
            className={classes.title + " " + classes.flex}
          >
            <Bookmark className={classes.icon} /> Flightbook
          </Typography>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
