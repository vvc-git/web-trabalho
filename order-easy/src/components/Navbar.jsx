import { Cell, Grid } from "bold-ui";

export default function Navbar() {
  return (
    <Grid
      alignItems="center"
      direction="row"
      gap={2}
      gapVertical={4}
      justifyContent="center"
      wrap
    >
      <Cell>Home</Cell>
      <Cell>Login</Cell>
    </Grid>
  );
}
