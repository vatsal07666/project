import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, IconButton, InputBase, Paper, 
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip 
} from "@mui/material";
import { Field, Form, Formik } from "formik";
import * as Yup from 'yup';
import { useContext, useEffect, useState } from "react";
import { IoMdAdd } from "react-icons/io";
import axios from "axios";
import { RiDeleteBin6Line } from "react-icons/ri";
import { IoMdRefresh } from "react-icons/io";
import { CircularProgress } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import { FaEdit } from "react-icons/fa";
import { useSnackbar } from "../Login_&_Register/SnackbarContext";
import { DataContext } from "../Context/ContextProvider";

const initialValues = {categoryName: '', description: '', status: ''};

const AddCategory = () => {
    const { categories, setCategories } = useContext(DataContext);
    
    const [editId, setEditId] = useState(null);
    const [formValues, setFormValues] = useState(initialValues);
    const [open, setOpen] = useState(false);
    const [dailogOpen, setDailogOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [searchItem, setSearchItem] = useState("");

    const { ShowSnackbar } = useSnackbar();

    const validationSchema = Yup.object({
        categoryName: Yup.string().required("Category Name is Required*"),
        description: Yup.string().required("Description is Required*"),
        status: Yup.string().required("Status is Required*")
    })

    const status = ["Active", "Inactive"];

    const token = "y5japrtJDM9NkJjU";

    // Get Method
    const getData = () => {
        return axios.get("https://generateapi.techsnack.online/api/category", {
            headers: { Authorization: token }
        })
        .then((res) => {
            console.log("GET response: ", res.data);
            setCategories(res.data.Data);
        })
        .catch((err) => {
            console.error("GET error: ", err);
        })
    }

    // Load Data
    useEffect(() => {
        getData();
        // eslint-disable-next-line
    }, [])

    // Post Method
    const postData = (values) => {
        let val = { categoryName: values.categoryName, description: values.description, status: values.status }

        axios.post("https://generateapi.techsnack.online/api/category", val, {
            headers: { Authorization: token, "Content-Type": "application/json" }
        })
        .then((res) => {
            console.log("POST response: ", res.data);
            if(res.status === 200 || res.status === 204){
                getData();
            }
        })
        .catch((err) => {
            console.error("POST error: ", err);
        })
    }

    // Delete Method
    const deleteData = (id, index) => {
        axios.delete(`https://generateapi.techsnack.online/api/category/${id}`, {
            headers: { Authorization: token }
        })
        .then((res) => {
            console.log("DELETE response: ", res.status);
            if(res.status === 200 || res.status === 204){
                setCategories((category) => category.filter((_, i) => i !== index));
            }
            handleRefresh();
            ShowSnackbar("Data Deleted Successfully !", "error");
        })
        .catch((err) => {
            console.error("DELETE error: ", err);
        })
    }

    // Patch Method
     const patchData = (id, values) => {
        axios.patch(`https://generateapi.techsnack.online/api/category/${id}`, values, {
            headers: { Authorization: token }
        })
        .then((res) => {
            console.log("PATCH response: ", res.data);
            if(res.status === 200 || res.status === 204){
                getData();
                setEditId(null);
            }
        })
        .catch((err) => {
            console.error("PATCH error: ", err);
        })
     }

    //  Submit Action
    const handleSubmit = (values, { resetForm, setFieldError }) => {
        const newCategory = values.categoryName?.toLowerCase();

        const isDuplicate = (categories || []).some((cat) => cat.categoryName?.toLowerCase() === newCategory);

        if(isDuplicate && editId === null){
            setFieldError("categoryName", "Category already exists");
            return; 
        }

        if(editId !== null){
            patchData(editId, values);
        } else {
            postData(values);
        }
        resetForm();
        setEditId(null);
        setOpen(false);
        setFormValues(initialValues);
        ShowSnackbar(editId !== null ? "Data Updated Successfully !" : "Data Added Successfully !", "success");
        handleRefresh();
    }

    // Edit Action
    const handleEdit = (item) => {
        setEditId(item._id);
        setFormValues({ categoryName: item.categoryName, description: item.description, status: item.status });
        setOpen(true);
    }

    // Cancle Action
    const handleCancle = (resetForm) => {
        setOpen(false);
        setEditId(null);
        setFormValues(initialValues);
        resetForm();
    }

    // Refresh Data
    const handleRefresh = () => {
        setLoading(true);
        getData().then(() => {
            ShowSnackbar("Data Refreshed !", "info");
        }).finally(() => {
            setLoading(false);
        })
    }

    const closeDailog = () => {
        setDailogOpen(false);
    }

    const handleDailog = (item, index) => {
        setDailogOpen(false);
        deleteData(item._id, index);
    }

    // Search Logic
    const searchTerm = searchItem?.toLowerCase() || "";
    const filteredcategory = (categories || []).filter((item) => (item.categoryName || "")?.toLowerCase().includes(searchTerm));

    return(
        <Box component={Paper} sx={{p:3, borderRadius: 2, mt: 10}}>
            {/* Heading & Add Category Button */}
            <Box sx={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                <h1>Category</h1>
                <Button onClick={() => setOpen(true)} 
                    sx={{background: "#1e293b", color: "#fff", p: "8px 14px", borderRadius: 2}}
                    startIcon={<IoMdAdd />}
                >
                    Add Category
                </Button>
            </Box>

            {/* Category Form */}
            <Dialog open={open} sx={{ zIndex: 2000 }} maxWidth="md" fullWidth disableRestoreFocus>
                <DialogTitle sx={{ fontWeight: 700 }} >
                    {editId !== null ? "Edit Category" : "Add New Category"}
                </DialogTitle>

                <Divider />

                <DialogContent sx={{ mt: 2 }}>
                    <Formik initialValues={formValues} 
                        validationSchema={validationSchema}
                        onSubmit={handleSubmit}
                    >
                        {({errors, touched, isValid, resetForm}) => (
                            <Form>
                                {/* Category Name & Status */}
                                <Box sx={{display: "flex", gap: 3, mb: 3}}>
                                    <Box sx={{display: "flex", flexDirection: "column", gap: 1, flex: 1}}>
                                        <label htmlFor="categoryName">Category Name</label>
                                        <Field name= "categoryName" id= "categoryName" placeholder="Enter Category" />
                                        {errors.categoryName && touched.categoryName && <div style={{color: "#ff0000"}}>{errors.categoryName}</div>}
                                    </Box>

                                    <Box sx={{display: "flex", flexDirection: "column", gap: 1, flex: 1}}>
                                        <label htmlFor="status">Status</label>
                                        <Field name="status" id="status" as="select"  >
                                            <option value="" hidden>Select Status</option>
                                            {status.map((stat) => <option key={stat} value={stat}>{stat}</option>)}
                                        </Field>
                                        {errors.status && touched.status && <div style={{color: "#ff0000"}}>{errors.status}</div>}
                                    </Box>
                                </Box>

                                {/* Description */}
                                <Box>
                                    <Box sx={{display: "flex", flexDirection: "column", gap: 1, flex: 1}} >
                                        <label htmlFor="description">Description</label>
                                        <Field name="description" id="description" as="textarea" placeholder="Write a Description of Category" />
                                        {errors.description && touched.description && <div style={{color: "#ff0000"}}>{errors.description}</div>}
                                    </Box>
                                </Box>

                                {/* Cancle & Submit Button */}
                                <DialogActions>
                                    <Button onClick={() => handleCancle(resetForm)} sx={{ color: "#1e293b" }}>Cancle</Button>

                                    <Button type="submit" variant="contained"
                                        sx={{ background: "#1e293b", "&:hover": { background: "#0f172a" } }}
                                        disabled={!isValid}
                                    >
                                        Submit
                                    </Button>
                                </DialogActions>
                            </Form>
                        )}
                    </Formik>
                </DialogContent>
            </Dialog>

            {/* Category Table */}
            <Box>
                <Box sx={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                    {/* Heading & Refresh Button */}
                    <Box sx={{display: "flex", alignItems: "center", gap: 1}}>
                        <h2>List Of Categories</h2>
    
                        <Tooltip title="Refresh List" component={Paper} placement="right"
                            slotProps={{
                                tooltip: {
                                    sx: {background: "#1e293b", color: "#fff", letterSpacing: 2}
                                }
                            }}
                        >
                            <IconButton sx={{background: "#1e293b", color: "#fff", borderRadius: 3, 
                                    transition: "0.3s ease-in-out", 
                                    '&:hover': {background: "#fff", color: "#1e293b"}
                                }}
                                onClick={handleRefresh}
                                disabled={loading}
                            >
                                {loading ? (
                                    <CircularProgress size={24} />
                                ) : (
                                    <IoMdRefresh />
                                )}
                            </IconButton>
                        </Tooltip>
                    </Box>
    
                    {/* Search Field */}
                    <Box sx={{ position: 'relative', border: 1, borderRadius: 2, }}>
                        <InputBase name="search" placeholder="Search Category" value={searchItem}
                            onChange={(e) => setSearchItem(e.target.value)}
                            sx={{ paddingLeft: '40px', width: '100%' }}
                        />
                        <SearchIcon sx={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)'}} />
                    </Box>
                </Box>

                {/* Table */}
                <TableContainer>
                    <Table>
                        <TableHead sx={{background: "#1e293b",
                            "& .MuiTableCell-root": { color: "#fff", fontSize: "16px", 
                                borderRight: "1px solid rgba(255, 255, 255, 0.1)",
                                whiteSpace: "nowrap", textAlign: "center", fontWeight: 600
                            }
                        }}>
                            <TableRow>
                                <TableCell>#</TableCell>
                                <TableCell>Category Name</TableCell>
                                <TableCell>Description</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {filteredcategory.length > 0 ? (
                                filteredcategory.map((item, index) => (
                                    <TableRow key={item._id ?? index}>
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell>{item.categoryName}</TableCell>
                                        <TableCell>{item.description}</TableCell>
                                        <TableCell style={{textAlign: "center"}}>
                                            <span style={{ background: item.status === "Active" ? "#4caf50" : "#f44336",
                                                    padding: "4px 10px", borderRadius: "20px", fontSize: "13px", color: "#fff"
                                                }}
                                            >
                                                {item.status}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            <Box sx={{display: "flex", justifyContent: "center", alignItems: "center", gap: 1}}>
                                                <Tooltip title="Delete" component={Paper}
                                                    slotProps={{
                                                        tooltip: {
                                                            sx:{ fontSize: "12px", px: 2, color:"#ef4444", background: "#ffddddff",
                                                                letterSpacing: 1, fontWeight: 600
                                                            }
                                                        }
                                                    }}
                                                >
                                                    <IconButton
                                                        sx={{
                                                            background:"#fff", color: "#ef4444", transition: "0.3s ease-in-out",
                                                            "&:hover": { background: "#dc2626", color:"#fff" }
                                                        }}
                                                        onClick={() => setDailogOpen(true)}
                                                    >
                                                        <RiDeleteBin6Line />
                                                    </IconButton>
                                                </Tooltip>
                                                <Dialog open={dailogOpen} onClose={closeDailog} fullWidth disableRestoreFocus sx={{backfaceVisibility: "revert-layer"}}>
                                                    <DialogTitle id="alert-dialog-title"> Confirm Delete By Clicking Delete ! </DialogTitle>
                                                    <DialogActions>
                                                        <Button onClick={closeDailog} variant="contained" sx={{color: "#1e293b", background: "#fff", 
                                                                '&:hover': { boxShadow: "0 0 0 2px rgba(0, 0, 0, 0.5)" }
                                                            }}
                                                        >
                                                            Cancle
                                                        </Button>

                                                        <Button variant="contained" className="agree-button" 
                                                            onClick={() => handleDailog(item, index)}
                                                            sx={{background: "#ef4444", color: "#fff", transition: "0.2s ease-in-out",
                                                                '&:hover': {background: "#fff", color: "#ff0000", 
                                                                    boxShadow: "0 0 2px rgba(255, 0, 0, 1)"
                                                                }
                                                            }}
                                                        >
                                                            Delete
                                                        </Button>
                                                    </DialogActions>    
                                                </Dialog>

                                                <Tooltip title="Edit" component={Paper}
                                                    slotProps={{
                                                        tooltip: {
                                                            sx:{ fontSize: "12px", px: 2, color:"#2563eb", background: "#dee9ffff",
                                                                letterSpacing: 1, fontWeight: 600
                                                            }
                                                        }
                                                    }}
                                                >
                                                <IconButton
                                                        sx={{
                                                            background: "#fff", color:"#2563eb", transition: "0.2s",
                                                            "&:hover": { background: "#2563eb", color:"#fff" }
                                                        }}
                                                        onClick={() => handleEdit(item)}
                                                    >
                                                        <FaEdit />
                                                    </IconButton>
                                                </Tooltip>
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={5} style={{textAlign: "center"}}>No Category Data Found</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        </Box>
    )
}

export default AddCategory;