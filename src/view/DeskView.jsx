import { Button, Cell, Grid } from "bold-ui";

const numDesks = Array.from({ length: 12 }, (_, index) => index + 1);

export default function DeskView() {
  return (
    <>
      <Grid
        alignItems="center"
        direction="row"
        gap={2}
        gapVertical={1}
        justifyContent="center"
        wrap
      >
        {numDesks.map((value) => (
          <Cell xs={12} sm={6} md={4} lg={3}>
            <Button
              block
              kind="primary"
              onClick={function noRefCheck() {}}
              size="large"
              skin="default"
            >
              {value}
            </Button>
          </Cell>
        ))}
      </Grid>
    </>
  );
}
