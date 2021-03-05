import React from "react";
import { makeStyles } from "@material-ui/styles";
import { Box, CircularProgress } from "@material-ui/core";

const useStyles = makeStyles(() => ({
  progressBarWrapper: {
    height: "100%",
    width: "100%",
    position: "fixed",
    zIndex: 100,
    left: 0,
    top: 0,
    overflowX: "hidden",
    transition: "0.5s",
  },
  progressBar: {
    position: "relative",
    top: "35%",
    left: "47%",
  },
}));

const ProgressBarView: React.FC = () => {
  const classes = useStyles();

  return (
    <Box className={classes.progressBarWrapper}>
      <CircularProgress className={classes.progressBar} size={100} />
    </Box>
  );
};

export default ProgressBarView;
