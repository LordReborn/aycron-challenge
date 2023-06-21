import { Grid, TextField, Button } from "@mui/material";
import { useRef } from "react";
import useCalculate from "./hooks/useCalculate";

const CalculatePage = () => {
  const ref = useRef();

  const { address, setAddress, handleSubmit } = useCalculate({ ref });

  return (
    <Grid container direction="column" spacing={2}>
      <Grid item container mt={2} component="form" onSubmit={handleSubmit}>
        <Grid item xs={12} md={8}>
          <TextField
            fullWidth
            required
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            name="address"
            label="Address"
            size="small"
          />
        </Grid>
        <Grid item xs={12} md={4} sx={{ pl: { md: 1 }, mt: { xs: 1, md: 0 } }}>
          <Button fullWidth variant="contained" type="submit">
            Search
          </Button>
        </Grid>
      </Grid>
      <Grid item>
        <div id="map" ref={ref} style={{ width: "100%", height: "400px" }} />
      </Grid>
    </Grid>
  );
};

export default CalculatePage;
