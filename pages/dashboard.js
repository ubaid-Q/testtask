import { Box, Button, Card, Container, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, Grid, InputLabel, List, ListItem, ListItemText, MenuItem, Select, TextField } from "@mui/material";
import axios from "axios";
import Axios from "axios";
import React, { useEffect, useState } from "react";
import NavBar from "../components/AppBar";
import ShowCarsCard from "../components/ShowCarsCard";
import { SnackBar } from "../components/SnackBar";

const Dashboard = () => {

  const [categories, setCategories] = React.useState()
  const [categoryValue, setCategoryValue] = React.useState()
  const [cars, setCars] = React.useState(Number)
  const [open, setOpen] = React.useState(false)
  const [snackBar, setSnackBar] = React.useState({
    open: false,
    severity: "",
    message: null
  })

  const deleteCategory = async (catId, index) => {
    const host = process.env.API_URL;
    const res = await axios({
      url: `${host}/category/${catId}`,
      method: "DELETE",
      withCredentials: true,
    });
    if (res.data) {
      categories.splice(index, 1)
      setSnackBar({ severity: "success", message: res.data.success, open: true })
    }
  }

  const createCategory = async () => {
    const category = document.getElementById("newCategory")
    try {
      const host = process.env.API_URL;
      const res = await axios({
        url: `${host}/category`,
        method: "POST",
        withCredentials: true,
        data: { name: category?.value }
      })
      category.value = ""
      setCategories([...categories, res.data.category])
      setSnackBar({ severity: "success", message: res.data.success, open: true })
    } catch (error) {
      const li = error.response?.data?.errors?.map((msg, i) => <li key={i}>{msg.message}</li>)
      setSnackBar({ severity: "error", message: <>{li}</>, open: true })
    }
  }

  const getCategories = async () => {
    try {
      const host = process.env.API_URL;
      const res = await Axios.get(`${host}/category`, { withCredentials: true })
      setCategories(res.data.categories)
    } catch (error) {
      console.log(error);
      const li = error.response?.data?.errors?.map((msg, i) => <li key={i}>{msg.message}</li>)
      setSnackBar({ severity: "error", message: <>{li}</>, open: true })
    }
  }

  const getCars = async () => {
    const host = process.env.API_URL;
    const res = await axios({
      url: `${host}/car?count=true`,
      method: "Get",
      withCredentials: true,
    })
    if (res.data.carsCount) {
      console.log(res.data.carsCount);
      setCars(res.data.carsCount)
    }
  }
  useEffect(() => {
    getCategories()
    getCars()
  }, []);



  /**
   * @param {Event} e 
   */
  const handleSubmit = async (e) => {
    e.preventDefault()
    const formdata = new FormData(e.currentTarget)
    try {
      const host = process.env.API_URL;
      const res = await axios({
        url: `${host}/car`,
        method: "POST",
        withCredentials: true,
        data: formdata
      })
      setCars(cars + 1)
      setSnackBar({ severity: "success", message: res.data.success, open: true })
      document.querySelector("form").reset()
    } catch (error) {
      console.log(error);
      const li = error.response?.data?.errors?.map((msg, i) => <li key={i}>{msg.message}</li>)
      setSnackBar({ severity: "error", message: <>{li}</>, open: true })
    }
  }

  return (
    <>
      <SnackBar open={snackBar.open} setOpen={setSnackBar} severity={snackBar.severity} message={snackBar.message} />
      <NavBar />
      <Container>
        <Grid container flex spacing={6} marginTop={4}>
          <Grid item lg={5}>
            <ShowCarsCard carsCount={cars} />
            <Card sx={{ padding: "10px", mt: 3, pl: 3, pr: 3 }}>
              <h3 style={{ margin: 3 }}>Create Category</h3>
              <br />
              <TextField name="newCategory" id="newCategory" type={"text"} variant="outlined" label="Category Name" size="small" />
              <br /><br />
              <Button variant="contained" onClick={createCategory}>Create</Button>
              <Button variant="outlined" onClick={() => setOpen(true)} color={"warning"} sx={{ float: "right" }} >View All</Button>
              <br />
            </Card>
          </Grid>
          <Grid item lg={6}>
            <Card>
              <Box component={"form"} margin={3} encType={"multipart/form-data"} onSubmit={handleSubmit} >
                <h3>Add a New Car</h3>
                <TextField type={"text"} required label="Name" name="name" id="name" variant="outlined" sx={{ margin: "5px" }} />
                <TextField type={"text"} required label="Color" name="color" id="color" variant="outlined" sx={{ margin: "5px" }} />
                <TextField type={"text"} required label="Model" name="model" id="model" variant="outlined" sx={{ margin: "5px" }} />
                <TextField type={"text"} required label="Make" name="make" id="make" variant="outlined" sx={{ margin: "5px" }} />
                <TextField type={"text"} required label="Registration No" name="registrationNo" id="registrationNo" variant="outlined" sx={{ margin: "5px" }} />
                <FormControl sx={{ width: "49%" }}>
                  <InputLabel id="category">Category</InputLabel>
                  <Select
                    required
                    name="category"
                    value={categoryValue}
                    label="Category"
                    onChange={(e, child) => console.log('')}
                    sx={{ margin: "5px" }}
                  >
                    {categories?.map((category, i) => <MenuItem value={category._id} key={i}>{category.name}</MenuItem>)}

                  </Select>
                </FormControl>
                <br />
                <TextField type={"file"} name="image" id="image" variant="outlined" sx={{ margin: "5px" }} size="small" />
                <br />
                <Button type="submit" variant="contained" sx={{ margin: "5px" }} >Submit</Button>
              </Box>
            </Card>
          </Grid>
        </Grid>
      </Container>
      <Dialog
        open={open}
        onClose={() => false}
        aria-labelledby="viewCars"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="viewCars">
          Categories
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {categories?.map((category, i) => {
              return <ListItem key={i} sx={{ display: "flex", justifyContent: "space-between" }} >
                <ListItemText>{category.name}</ListItemText>
                <Button sx={{ ml: 10 }} onClick={() => deleteCategory(category._id, i)}>X</Button>
              </ListItem>
            })}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button fullWidth variant="outlined" color="warning" onClick={() => setOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Dashboard;
