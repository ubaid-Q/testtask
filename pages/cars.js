import * as React from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import axios from "axios";
import NavBar from "../components/AppBar";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import { SnackBar } from "../components/SnackBar";

const columns = [
  "ID",
  "Name",
  "Category",
  "Model",
  "Make",
  "Color",
  "Registration No",
];

export default function StickyHeadTable() {
  const [cars, setCars] = React.useState([]);
  const [car, setCar] = React.useState({
    name: "",
    color: "",
    model: "",
    make: "",
    registrationNo: "",
    category: "",
    image: "",
  });
  const [categories, setCategories] = React.useState([])
  const [open, setOpen] = React.useState(false)
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [snackBar, setSnackBar] = React.useState({
    open: false,
    severity: "",
    message: null,
  });

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const getCars = async () => {
    const host = process.env.API_URL;
    const res = await axios({
      url: `${host}/car`,
      method: "Get",
      withCredentials: true,
    });
    if (res.data.cars) {
      setCars(res.data.cars);
    }
  };

  const getCategories = async () => {
    try {
      const host = process.env.API_URL;
      const res = await axios.get(`${host}/category`, { withCredentials: true })
      setCategories(res.data.categories)
    } catch (error) {
      console.log(error);
      const li = error.response?.data?.errors?.map((msg, i) => <li key={i}>{msg.message}</li>)
      setSnackBar({ severity: "error", message: <>{li}</>, open: true })
    }
  }

  React.useEffect(() => {
    getCars();
    getCategories()
  }, []);

  const deleteCar = async (rowId, index) => {
    const host = process.env.API_URL;
    try {
      const res = await axios({
        url: `${host}/car/${rowId}`,
        method: "DELETE",
        withCredentials: true,
      });
      console.log(res);
      if (res.data.success) {
        cars.splice(index, 1);
        setCars(cars);
        setSnackBar({
          severity: "success",
          message: res.data.success,
          open: true,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const viewCar = (rowId, index) => {
    const getCar = cars[index];
    car._id = getCar._id
    car.name = getCar.name
    car.color = getCar.color
    car.model = getCar.model
    car.make = getCar.make
    car.registrationNo = getCar.registrationNo
    car.category = getCar.category?._id
    car.image = getCar.image
    setCar(car)
    setOpen(true)
  }

  const updateCar = async () => {
    const host = process.env.API_URL;
    console.log(car);
    try {
      const carId = car._id;
      delete car._id;
      const res = await axios({
        url: `${host}/car/${carId}`,
        method: "PUT",
        data: car,
        withCredentials: true,
      });
      console.log(res);
      if (res.data.success) {
        cars.filter((car, i) => {
          car._id == res.data.car._id
            ? cars.splice(i, 1, res.data.car)
            : ""
        })
        setSnackBar({
          severity: "success",
          message: res.data.success,
          open: true,
        });
        // setCars(cars)
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      <SnackBar
        open={snackBar.open}
        setOpen={setSnackBar}
        severity={snackBar.severity}
        message={snackBar.message}
      />
      <NavBar />
      <div style={{ margin: 10 }}>
        <Paper sx={{ width: "100%", overflow: "hidden" }}>
          <h3 style={{ marginLeft: 20 }}>View ALl Cars</h3>
          <TableContainer>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
                    <TableCell key={column}>{column}</TableCell>
                  ))}
                  <TableCell key={"View"}>View</TableCell>
                  <TableCell key={"delete"}>Delete</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {cars?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, i) => {
                    return (
                      <TableRow
                        hover
                        role="checkbox"
                        tabIndex={-1}
                        key={row._d}
                      >
                        <TableCell key={row._id}>{row._id}</TableCell>
                        <TableCell key={row.name}>{row.name}</TableCell>
                        <TableCell key={row.category?.name}>
                          {row.category?.name}
                        </TableCell>
                        <TableCell key={row.model}>{row.model}</TableCell>
                        <TableCell key={row.make}>{row.make}</TableCell>
                        <TableCell key={row.color}>{row.color}</TableCell>
                        <TableCell key={row.registrationNo}>
                          {" "}
                          {row.registrationNo}{" "}
                        </TableCell>
                        <TableCell key={"view"}>
                          <Button size="small" color="info" onClick={() => viewCar(row._id, i)} >
                            View
                          </Button>
                        </TableCell>
                        <TableCell key={"delete"}>
                          <Button size="small" color="error" onClick={() => deleteCar(row._id, i)} >
                            Delete
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })
                }
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[10, 25, 100]}
            component="div"
            count={cars.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      </div>

      <Dialog
        open={open}
        onClose={() => false}
        aria-labelledby="viewCars"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="viewCars">
          Update Car
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <TextField value={car.name} type={"text"} required label="Name" name="name" id="name" variant="outlined" sx={{ margin: "5px" }} onChange={(e) => setCar({ ...car, name: e.target.value })} />
            <TextField value={car.color} type={"text"} required label="Color" name="color" id="color" variant="outlined" sx={{ margin: "5px" }} onChange={(e) => setCar({ ...car, color: e.target.value })} />
            <TextField value={car.model} type={"text"} required label="Model" name="model" id="model" variant="outlined" sx={{ margin: "5px" }} onChange={(e) => setCar({ ...car, model: e.target.value })} />
            <TextField value={car.make} type={"text"} required label="Make" name="make" id="make" variant="outlined" sx={{ margin: "5px" }} onChange={(e) => setCar({ ...car, make: e.target.value })} />
            <TextField value={car.registrationNo} type={"text"} required label="Registration No" name="registrationNo" id="registrationNo" variant="outlined" onChange={(e) => setCar({ ...car, registrationNo: e.target.value })} sx={{ margin: "5px" }} />
            <FormControl sx={{ width: "49%" }}>
              <InputLabel id="category">Category</InputLabel>
              <Select required name="category" label="Category" value={car?.category} onChange={(e, child) => setCar({ ...car, category: e.target.value })} sx={{ margin: "5px" }} >
                {categories.map((category, i) => <MenuItem value={category._id} key={i} selected>{category.name}</MenuItem>)}
              </Select>
            </FormControl>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" color="warning" onClick={() => setOpen(false)}>Close</Button>
          <Button onClick={updateCar}>Update</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
