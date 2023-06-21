import {
  Button,
  FormHelperText,
  Grid,
  Modal,
  Paper,
  TextField,
} from "@mui/material";
import { Box } from "@mui/system";
import PropTypes from "prop-types";
import { useState } from "react";
import WarehouseService from "../../../services/WarehouseService";
import GoogleService from "../../../services/GoogleService";
import { downloadFileBlob } from "../../../utils/functions";

const initialData = {
  code: "",
  name: "",
  address: "",
  state: "",
  country: "",
  zip: "",
};

const ModalNewWarehouse = ({ open, handleClose, setWarehouses }) => {
  const [data, setData] = useState(initialData);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { value, name } = e.target;
    setData((d) => ({ ...d, [name]: value }));
  };

  const _handleClose = () => {
    handleClose();
    setData(initialData);
    setError(null);
  };

  const downloadTemplate = () => {
    const headers = [
      Object.keys(initialData)
        .map((header) => header.toUpperCase())
        .join(";"),
    ];

    downloadFileBlob({
      data: headers.join("\n"),
      fileName: `templete.csv`,
      fileType: "text/csv",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const address = [data?.address, data?.state, data?.country, data?.zip]
        .filter((val) => !!val)
        .join(", ");
      const coordinates = await GoogleService.getCoordinates({ address });
      const warehouse = await WarehouseService.create({ ...data, coordinates });
      setWarehouses((prev) => [...prev, warehouse]);
      _handleClose();
    } catch (e) {
      setError({ message: e?.message || "Failed to create warehouse" });
    }
  };

  return (
    <Modal open={open} onClose={_handleClose}>
      <Box
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        <Paper style={{ minWidth: "400px" }}>
          <Grid
            container
            direction="column"
            p={3}
            spacing={2}
            component="form"
            onSubmit={handleSubmit}
          >
            <Grid container item spacing={2}>
              <Grid item xs={6}>
                <TextField
                  required
                  fullWidth
                  value={data.code}
                  onChange={handleChange}
                  name="code"
                  label="Code"
                  size="small"
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  required
                  fullWidth
                  value={data.name}
                  onChange={handleChange}
                  name="name"
                  label="Name"
                  size="small"
                />
              </Grid>
            </Grid>
            <Grid item>
              <TextField
                required
                fullWidth
                value={data.address}
                onChange={handleChange}
                name="address"
                label="Address"
                size="small"
              />
            </Grid>
            <Grid item>
              <TextField
                required
                fullWidth
                value={data.state}
                onChange={handleChange}
                name="state"
                label="State"
                size="small"
              />
            </Grid>
            <Grid item>
              <TextField
                fullWidth
                value={data.country}
                onChange={handleChange}
                name="country"
                label="Country"
                size="small"
              />
            </Grid>
            <Grid item>
              <TextField
                fullWidth
                value={data.zip}
                onChange={handleChange}
                name="zip"
                label="Zip"
                size="small"
              />
            </Grid>
            <Grid item>
              {!!error?.message && (
                <FormHelperText error>{error?.message}</FormHelperText>
              )}
            </Grid>

            <Grid item display="flex" justifyContent="space-evenly">
              <Button onClick={_handleClose}>Cancel</Button>
              <Button type="submit" variant="contained">
                Create
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </Modal>
  );
};

export default ModalNewWarehouse;

ModalNewWarehouse.propTypes = {
  open: PropTypes.bool,
  handleClose: PropTypes.func,
  setWarehouses: PropTypes.func,
};
