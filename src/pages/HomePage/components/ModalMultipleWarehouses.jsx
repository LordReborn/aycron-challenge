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

const ModalMultipleWarehouses = ({
  open,
  handleClose,
  setWarehouses,
  handleSnackbar,
}) => {
  const [errors, setErrors] = useState([]);
  const [data, setData] = useState([]);
  const _handleClose = () => {
    handleClose();
    setErrors([]);
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

  const handleResult = async (result) => {
    const rows = result.split("\n").filter(Boolean);
    const headers = rows[0].split(/[,;]/);
    const newErrors = [];
    const warehouses = [];
    if (rows.length >= 11) {
      return setErrors(["The maximum limit is 10 items"]);
    }
    for (let i = 1; i < rows.length; i++) {
      const row = rows[i].split(/[,;]/);
      const obj = {};
      for (let j = 0; j < headers.length; j++) {
        obj[headers[j].toLowerCase()] = row[j];
      }
      warehouses.push(obj);
    }
    warehouses.forEach((warehouse) => {
      const warehouseName = warehouse.code || warehouse.name || "unknown";
      if (
        !warehouse.code ||
        !warehouse.name ||
        !warehouse.address ||
        !warehouse.state
      ) {
        newErrors.push(`${warehouseName} miss the required fields`);
      }
    });
    setErrors(newErrors);
    if (!newErrors.length) setData(warehouses);
  };

  const handleChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.readAsText(file);

    reader.onload = () => handleResult(reader.result);
    reader.onerror = () => setErrors(["Error reading file"]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const {
      errors: newErrors,
      success,
      warehouses,
    } = await WarehouseService.createMassive(data);
    setWarehouses(warehouses);
    setErrors(newErrors);
    const names = success.map((warehouse) => warehouse.code).join(", ");
    handleSnackbar({
      open: true,
      duration: 6000,
      message: `Warehouses ${names} created successfully`,
      severity: "success",
    });
    if (!newErrors.length) _handleClose();
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
            <Grid container item spacing={2} direction="column">
              <Grid item>
                <Button variant="outlined" fullWidth onClick={downloadTemplate}>
                  Download Template
                </Button>
              </Grid>
              <Grid item>
                <TextField
                  inputProps={{ multiple: false, accept: ".csv" }}
                  onChange={handleChange}
                  fullWidth
                  type="file"
                />
              </Grid>
            </Grid>
            <Grid item>
              {errors.map((error, index) => (
                <FormHelperText key={`error-${index}`} error>
                  {error}
                </FormHelperText>
              ))}
            </Grid>

            <Grid item display="flex" justifyContent="space-evenly">
              <Button onClick={_handleClose}>Cancel</Button>
              <Button
                type="submit"
                variant="contained"
                disabled={!!errors.length}
              >
                Create
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </Modal>
  );
};

export default ModalMultipleWarehouses;

ModalMultipleWarehouses.propTypes = {
  open: PropTypes.bool,
  handleClose: PropTypes.func,
  setWarehouses: PropTypes.func,
  handleSnackbar: PropTypes.func,
};
