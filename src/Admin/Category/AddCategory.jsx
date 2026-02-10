import { Box, Button, Card, CardContent, Dialog, DialogActions, DialogContent, DialogTitle, Divider, IconButton, InputBase, Paper, 
    Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Tooltip, 
    Typography, 
    useMediaQuery, 
    useTheme
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
import { useSnackbar } from "../../Context/SnackbarContext";
import { DataContext } from "../../Context/ContextProvider";

const initialValues = {categoryName: '', description: '', status: ''};

const AddCategory = () => {
    const { categories, setCategories } = useContext(DataContext);
    
    const [editId, setEditId] = useState(null);
    const [formValues, setFormValues] = useState(initialValues);
    const [open, setOpen] = useState(false);
    const [dailogOpen, setDailogOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [searchItem, setSearchItem] = useState("");

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));

    /* Pagination state */
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

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

    const DesktopTable = () => {
        return(
            <TableContainer component={Paper} elevation={0} 
                sx={{ width: '100%', maxWidth: 'calc(100vw - 180px)', // adjust to sidebar width
                    overflowX: 'auto', WebkitOverflowScrolling: 'touch', margin: '0 auto',
                    '&::-webkit-scrollbar': { height: '8px' },
                    '&::-webkit-scrollbar-track': { backgroundColor: '#f1f1f1' },
                    '&::-webkit-scrollbar-thumb': { backgroundColor: '#888', borderRadius: 4,
                        '&:hover': { backgroundColor: '#555' },
                    },
                }}
            >
                <Table sx={{width: "100%", minWidth: 900}}>
                    <TableHead sx={{background: "#1e293b"}}>
                        <TableRow>
                            {["#", "Category", "Description", "Status", "Actions"]
                                .map((h) => (
                                    <TableCell key={h} sx={{ color: "#fff", textAlign: "center" }}>
                                        {h}
                                    </TableCell>
                                ))}
                        </TableRow>
                    </TableHead>

                    <TableBody sx={{ "& .MuiTableRow-root": {"&:hover": {background: "#f0f0f0"}}, 
                        "& .MuiTableCell-root": { fontSize: "16px", 
                            borderRight: "1px solid rgba(255, 255, 255, 0.1)",
                            // whiteSpace: "nowrap",
                        }
                    }}>
                        {paginatedCategories.length > 0 ? (
                            paginatedCategories.map((item, index) => (
                                <TableRow key={item._id ?? index}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell sx={{whiteSpace: "nowrap"}}>{item.categoryName}</TableCell>
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
        )
    }

    const MobileCards = () => (
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2}}>
            {paginatedCategories.map((item, index) => (
                <Card key={item._id ?? index}
                    sx={{ borderRadius: 3, boxShadow: 2, display: "flex", flexDirection: "column" }}
                >
                    {/* CONTENT */}
                    <CardContent sx={{ flexGrow: 1 }}>
                        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                            <Typography fontWeight={600}> {item.categoryName} </Typography>
                            <Typography color="text.secondary"> #{page * rowsPerPage + index + 1} </Typography>
                        </Box>

                        <Divider sx={{ my: 1 }} />

                        <Typography variant="body2"><b>Description:</b> {item.description}</Typography>
                        <Typography variant="body2" sx={{mt: 1}}>
                            <b>Status:&nbsp;</b> 
                            <span style={{ background: item.status === "Active" ? "#4caf50" : "#f44336",
                                    padding: "4px 10px", borderRadius: "20px", fontSize: "13px", color: "#fff"
                                }}
                            >
                                {item.status}
                            </span>
                        </Typography>
                    </CardContent>

                    {/* ACTIONS — ALWAYS AT BOTTOM */}
                    <Box sx={{ display: "flex", justifyContent: "center", gap: 1, p: 2, mt: "auto" }}>
                        <Button
                            sx={{ background: "#fff", color: "#ef4444", border: 1 }}
                            onClick={() => setDailogOpen(true)}
                        >
                            <RiDeleteBin6Line />&nbsp; Delete
                        </Button>

                        <Button
                            sx={{ background: "#fff", color: "#2563eb", border: 1 }}
                            onClick={() => handleEdit(item)}
                        >
                            <FaEdit />&nbsp; Edit
                        </Button>
                    </Box>
                </Card>
            ))}
        </Box>
    );

    /* ---------------- Search + Pagination ---------------- */
    const filteredCategory = categories.filter((p) =>
        p.categoryName.toLowerCase().includes(searchItem.toLowerCase())
    );

    const paginatedCategories = filteredCategory.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
    );

    useEffect(() => {
        setPage(0);
    }, [searchItem]);

    return(
        <Box component={Paper} sx={{p:3, borderRadius: 2}}>
            {/* Heading & Add Category Button */}
            <Box sx={{display: "flex", flexDirection: {xs: "column", sm: "row"}, justifyContent: "space-between", 
                    alignItems: {xs: "flex-start", sm: "center"}
                }}
            >
                {/* Refresh Button */}
                <Box sx={{display: "flex", alignItems: "center", gap: 1}}>
                    <h1>Category</h1>
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

                <Button onClick={() => setOpen(true)} 
                    sx={{background: "#1e293b", color: "#fff", p: "8px 14px", borderRadius: 2, mt: {xs: 2, sm: 0}}}
                    startIcon={<IoMdAdd />}
                >
                    Add Category
                </Button>
            </Box>

            {/* Category Form */}
            <Dialog open={open} sx={{ zIndex: 2000 }} maxWidth="md" fullWidth disableRestoreFocus
                slotProps={{
                    backdrop: { sx: { backgroundColor: "rgba(0,0,0,0.35)", backdropFilter: "blur(4px)" } }
                }}
            >
                <DialogTitle sx={{ fontWeight: 700 }} >
                    {editId !== null ? "Edit Category" : "Add New Category"}
                </DialogTitle>

                <Divider />

                <DialogContent sx={{ mt: 2 }}>
                    <Formik initialValues={formValues} 
                        validationSchema={validationSchema}
                        onSubmit={handleSubmit}
                    >
                        {({errors, touched, isValid, dirty, resetForm}) => (
                            <Form>
                                {/* Category Name & Status */}
                                <Box sx={{display: "flex", flexDirection: {xs: "column", sm: "row"}, gap: 3, mb: 3}}>
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
                                        disabled={!isValid || !dirty}
                                    >
                                        {editId !== null ? "Update" : "Submit"}
                                    </Button>
                                </DialogActions>
                            </Form>
                        )}
                    </Formik>
                </DialogContent>
            </Dialog>

            {/* Category Table */}
            <Box sx={{display: "flex", justifyContent: "center", alignItems: "center", my: 2}}>    
                {/* Search Field */}
                <Box sx={{ position: 'relative', border: 1, borderRadius: 2, width: { xs: "100%", sm: "60%", md: "35%" }, 
                        py: 0.5, my: 2
                    }}
                >
                    <InputBase name="search" placeholder="Search Category" value={searchItem}
                        onChange={(e) => setSearchItem(e.target.value)}
                        sx={{ paddingLeft: '40px', width: '100%', boxSizing: "border-box" }}
                    />
                    <SearchIcon sx={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)'}} />
                </Box>
            </Box>

            {isMobile ? <MobileCards /> : <DesktopTable />}

            {/* PAGINATION */}
            <TablePagination
                rowsPerPageOptions={[5, 10, 25, 50]}
                component="div"
                count={filteredCategory.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={(e, newPage) => setPage(newPage)}
                onRowsPerPageChange={(e) => {
                    setRowsPerPage(parseInt(e.target.value, 10));
                    setPage(0);
                }}
            />
        </Box>
    )
}

export default AddCategory;