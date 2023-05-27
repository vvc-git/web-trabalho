import { Cell, Grid } from "bold-ui";
import React from "react";

export default function Navbar() {
  return (
    <Grid
      alignItems="center"
      direction="row"
      gap={2}
      gapVertical={1}
      justifyContent="center"
      wrap
    >
      <Cell>Home</Cell>
      <Cell>Login</Cell>
    </Grid>
  );
}
