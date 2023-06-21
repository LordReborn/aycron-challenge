import {
  Alert,
  Button,
  Grid,
  Paper,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { useEffect, useState } from "react";
import WarehouseService from "../../services/WarehouseService";
import ModalNewWarehouse from "./components/ModalNewWarehouse";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import { downloadFileBlob } from "../../utils/functions";
import ModalMultipleWarehouses from "./components/ModalMultipleWarehouses";

const WarehousesPage = () => {
  const [modal, setModal] = useState("");
  const [warehouses, setWarehouses] = useState([]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    autoHideDuration: 0,
    message: "",
    severity: "",
  });
  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;
    const getWarehouses = async () => {
      try {
        const _warehouses = await WarehouseService.list(signal);
        setWarehouses(_warehouses);
      } catch (error) {
        //handle error
      }
    };
    getWarehouses();
    return () => {
      abortController.abort();
    };
  }, []);

  const handleClose = () => setModal("");

  const handleSnackbar = ({ open, duration, message, severity }) => {
    setSnackbar({ open, autoHideDuration: duration, message, severity });
  };

  const downloadFile = () => {
    const data = warehouses.map((warehouse) => {
      const partial = { ...warehouse };
      delete partial.coordinates;
      return partial;
    });
    const headers = [
      Object.keys(data[0])
        .map((header) => header.toUpperCase())
        .join(","),
    ];
    const dataCsv = data.reduce((acc, file) => {
      acc.push(
        Object.values(file)
          .map((val) => val.replaceAll(",", ""))
          .join(",")
      );
      return acc;
    }, []);
    downloadFileBlob({
      data: [...headers, ...dataCsv].join("\n"),
      fileName: `warehouse-list.csv`,
      fileType: "text/csv",
    });
  };

  return (
    <>
      <Grid>
        <Grid
          item
          py={2}
          display="flex"
          flexWrap="wrap"
          justifyContent="space-between"
        >
          <Button variant="outlined" onClick={() => setModal("simple")}>
            New Warehouse
          </Button>
          <Button
            startIcon={<UploadFileIcon />}
            variant="text"
            onClick={() => setModal("multiple")}
          >
            Upload Warehouses
          </Button>
          <Button
            startIcon={<FileDownloadIcon />}
            variant="text"
            onClick={downloadFile}
          >
            Download
          </Button>
        </Grid>

        <Grid item>
          <TableContainer component={Paper} variant="outlined">
            <Table sx={{ minWidth: 650 }}>
              <TableHead>
                <TableRow>
                  <TableCell>Code</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Address</TableCell>
                  <TableCell>State</TableCell>
                  <TableCell>Country</TableCell>
                  <TableCell>Zip</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {warehouses.map((row) => (
                  <TableRow key={row.code}>
                    <TableCell>{row.code}</TableCell>
                    <TableCell>{row.name}</TableCell>
                    <TableCell>{row.address}</TableCell>
                    <TableCell>{row.state}</TableCell>
                    <TableCell>{row.country}</TableCell>
                    <TableCell>{row.zip}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
      <ModalNewWarehouse
        setWarehouses={setWarehouses}
        open={modal === "simple"}
        handleClose={handleClose}
        handleSnackbar={handleSnackbar}
      />
      <ModalMultipleWarehouses
        setWarehouses={setWarehouses}
        open={modal === "multiple"}
        handleClose={handleClose}
        handleSnackbar={handleSnackbar}
      />
      <Snackbar {...snackbar}>
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </>
  );
};

export default WarehousesPage;
