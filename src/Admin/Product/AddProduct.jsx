import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, IconButton, Paper, Table, 
    TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip, InputBase, TablePagination, Typography, 
    Card, CardContent, useTheme, useMediaQuery,
} from "@mui/material";
import { Field, Form, Formik } from "formik";
import * as Yup from 'yup';
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { IoMdAdd } from "react-icons/io";
import { RiDeleteBin6Line } from "react-icons/ri";
import { IoMdRefresh } from "react-icons/io";
import { CircularProgress } from "@mui/material";
import { FaEdit } from "react-icons/fa";
import SearchIcon from '@mui/icons-material/Search';
import { useSnackbar } from "../../Context/SnackbarContext";
import { DataContext } from "../../Context/ContextProvider";

const initialValues = {productName: '', sku: '', category: '', supplier: '', stock: '', costPrice: '', sellingPrice: ''};

const AddProduct = () => {
    const { products, setProducts, categories, suppliers } = useContext(DataContext);
    
    const [editId, setEditId] = useState(null);
    const [formValues, setFormValues] = useState(initialValues);
    const [searchItem, setSearchItem] = useState("");
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [dailogOpen, setDailogOpen] = useState(false);

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));

    /* Pagination state */
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const { ShowSnackbar } = useSnackbar();

    const validationSchema = Yup.object({
        productName: Yup.string().required("Product Name is Required*"),
        sku: Yup.string().required("SKU is Required*"),
        category: Yup.string().required("Category is required*"),
        supplier: Yup.string().required("Supplier is Required*"),
        stock: Yup.string().typeError("Stock Must be Number").required("Stock is Required"),
        costPrice: Yup.string().typeError("Cost Price must be Number*").required("Cost Price is Required*"),
        sellingPrice: Yup.string().typeError("Selling Price must be Number*").required("selling Price is Required*")
    })

    const token = "w4AkMdTjMm7CLvTY";

    // Get Method
    const getData = () => {
        return axios.get("https://generateapi.techsnack.online/api/product", {
            headers: { Authorization: token }
        })
        .then((res) => {
            console.log("GET response: ", res.data);
            setProducts(res.data.Data);
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
        const val = { productName: values.productName, sku: values.sku, category: values.category, 
            supplier: values.supplier, stock: values.stock, costPrice: values.costPrice, sellingPrice: values.sellingPrice
        }

        axios.post("https://generateapi.techsnack.online/api/product", val, {
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
        axios.delete(`https://generateapi.techsnack.online/api/product/${id}`, {
            headers: { Authorization: token }
        })
        .then((res) => {
            console.log("DELETE response: ", res.status);
            if(res.status === 200 || res.status === 204){
                setProducts(products.filter((_,i) => i !== index));
                ShowSnackbar("Data Deleted Successfully !", "error");
            }
        })
        .catch((err) => {
            console.log("DELETE error: ", err);
        })
    }

    // Patch Method
    const patchData = (id, values) => {
        axios.patch(`https://generateapi.techsnack.online/api/product/${id}`, values, {
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
            console.error("PATCH response: ", err);
        })
    }

    // Submit Action
    const handleSubmit = (values, {resetForm, setFieldError}) => {
        const newProduct = values.sku?.toLowerCase();

        const isDuplicate = (products || []).some((p) => p.sku?.toLowerCase() === newProduct);

        if(isDuplicate && editId === null){
            setFieldError("sku", "Product with same SKU (Stock Keeping Unit) is already exists.");
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

    // Edit/Update Action
    const handleEdit = (item) => {
        setEditId(item._id);
        setFormValues({
            productName: item.productName, sku: item.sku, category: item.category, supplier: item.supplier,
            stock: item.stock, costPrice: item.costPrice, sellingPrice: item.sellingPrice 
        })
        setOpen(true);
    }

    // Cancle Action
    const handleCancle = (resetForm) => {
        setOpen(false); 
        setEditId(null);
        setFormValues(initialValues);
        resetForm();
    }

    // Referesh Data
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
        deleteData(item._id, index);
        setDailogOpen(false);
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
                <Table sx={{ width: '100%', minWidth: 900 }}>
                    <TableHead sx={{ background: "#1e293b" }}>
                        <TableRow>
                            {["#", "Product", "SKU", "Category", "Supplier", "Stock", "Cost", "Price", "Actions"]
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
                            whiteSpace: "nowrap",
                        }
                    }}>
                        {paginatedProducts.length > 0 ? (
                            paginatedProducts.map((item, index) => (
                                <TableRow key={item._id ?? index}>
                                    {/* <TableCell>{index + 1}</TableCell> */}
                                    <TableCell align="center">
                                        {page * rowsPerPage + index + 1}
                                    </TableCell>
                                    <TableCell>{item.productName}</TableCell>
                                    <TableCell>{item.sku}</TableCell>
                                    <TableCell>{item.category}</TableCell>
                                    <TableCell>{item.supplier}</TableCell>
                                    <TableCell style={{textAlign: "center"}}>{item.stock}</TableCell>
                                    <TableCell style={{textAlign: "center"}}>{item.costPrice}</TableCell>
                                    <TableCell style={{textAlign: "center"}}>{item.sellingPrice}</TableCell>
                                    <TableCell>
                                        <Box sx={{display: "flex", justifyContent: "center", alignItems: "center", gap: 1}}>
                                            {/* Delete Button */}
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

                                            {/* Delete Button Dailog */}
                                            <Dialog open={dailogOpen} fullWidth onClose={closeDailog} disableRestoreFocus
                                                slotProps={{
                                                    backdrop: {
                                                        sx: { backgroundColor: "rgba(0,0,0,0.35)",
                                                            backdropFilter: "blur(4px)"
                                                        }
                                                    }
                                                }}
                                            >
                                                <DialogTitle id="alert-dialog-title"> Confirm Delete By Clicking Delete! </DialogTitle>
                                                
                                                <DialogActions>
                                                    <Button onClick={closeDailog} variant="contained" 
                                                        sx={{color: "#1e293b", background: "#fff", 
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

                                            {/* Edit Button */}
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
                            )
                        )) : (
                            <TableRow>
                                <TableCell colSpan={9} align="center">No Product Data Found</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        )
    }

    const MobileCards = () => (
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2}}>
            {paginatedProducts.map((item, index) => (
                <Card key={item._id ?? index}
                    sx={{ borderRadius: 3, boxShadow: 2, display: "flex", flexDirection: "column" }}
                >
                    {/* CONTENT */}
                    <CardContent sx={{ flexGrow: 1 }}>
                        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                            <Typography fontWeight={600}> {item.productName} </Typography>
                            <Typography color="text.secondary"> #{page * rowsPerPage + index + 1} </Typography>
                        </Box>

                        <Divider sx={{ my: 1 }} />

                        <Typography variant="body2"><b>SKU:</b> {item.sku}</Typography>
                        <Typography variant="body2"><b>Category:</b> {item.category}</Typography>
                        <Typography variant="body2"><b>Supplier:</b> {item.supplier}</Typography>
                        <Typography variant="body2"><b>Stock:</b> {item.stock}</Typography>
                        <Typography variant="body2"><b>Cost Price:</b> ₹{item.costPrice}</Typography>

                        <Box sx={{ mt: 1 }}>
                            <Typography fontWeight={600} color="success.main">
                                <b>Selling Price:</b> ₹{item.sellingPrice}
                            </Typography>
                        </Box>
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
    const filteredProduct = products.filter((p) =>
        p.productName.toLowerCase().includes(searchItem.toLowerCase())
    );

    const paginatedProducts = filteredProduct.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
    );

    useEffect(() => {
        setPage(0);
    }, [searchItem]);

    return(
        <Box component={Paper} sx={{p:3, borderRadius: 2 }}>
            {/* Heading & Add Product Button */}
            <Box sx={{display: "flex", flexDirection: {xs: "column", sm: "row"}, justifyContent: "space-between", 
                    alignItems: {xs: "flex-start", sm: "center"}
                }}
            >
                {/* Refresh Button */}
                <Box sx={{display: "flex", alignItems: "center", gap: 1}}>
                    <h1>Products</h1>
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
                    Add Products
                </Button>
            </Box>

            {/* Product Form */}
            <Dialog open={open} sx={{ zIndex: 2000 }} maxWidth="md" fullWidth disableRestoreFocus
                slotProps={{
                    backdrop: { sx: { backgroundColor: "rgba(0,0,0,0.35)", backdropFilter: "blur(4px)" } }
                }}
            >
                <DialogTitle sx={{ fontWeight: 700 }}>
                    {editId !== null ? "Edit Product" : "Add New Product"}
                </DialogTitle>

                <Divider />
            
                <DialogContent sx={{ mt: 1 }}>
                    <Formik initialValues={formValues}
                        validationSchema={validationSchema}
                        onSubmit={handleSubmit}
                        enableReinitialize
                    >
                        {({errors, touched, isValid, dirty, resetForm}) => (
                            <Form>
                                {/* Product & SKU */}
                                <Box sx={{ display: "flex", flexDirection: {xs: "column", sm: "row"}, gap: 3, mb: 3 }}>
                                    <Box sx={{display: "flex", flexDirection: "column", gap: 1, flex: 1}}>
                                        <label htmlFor="productName">Product Name</label>
                                        <Field name="productName" id="productName" placeholder="Enter Product Name" />
                                        {errors.productName && touched.productName && <div style={{color: "#ff0000"}}>{errors.productName}</div>}
                                    </Box>

                                    <Box sx={{display: "flex", flexDirection: "column", gap: 1, flex: 1}}>
                                        <label htmlFor="sku">SKU</label>
                                        <Field name="sku" id="sku" placeholder="Enter SKU" />
                                        {errors.sku && touched.sku && <div style={{color: "#ff0000"}}>{errors.sku}</div>}
                                    </Box>
                                </Box>

                                {/* Category & Supplier */}
                                <Box sx={{ display: "flex", flexDirection: {xs: "column", sm: "row"}, gap: 3, mb: 3 }}>
                                    <Box sx={{display: "flex", flexDirection: "column", gap: 1, flex: 1}}>
                                        <label htmlFor="category">Category</label>
                                        <Field name= "category" id= "category" as="select">
                                            <option value="" hidden>Select Category</option>
                                            {(categories || []).map((cat) => <option key={cat._id} value={cat.categoryName}>{cat.categoryName}</option>)}
                                        </Field>
                                        {errors.category && touched.category && <div style={{color: "#ff0000"}}>{errors.category}</div>}
                                    </Box>

                                    <Box sx={{display: "flex", flexDirection: "column", gap: 1, flex: 1}}>
                                        <label htmlFor="supplier">Supplier</label>
                                        <Field name="supplier" id="supplier" as="select" placeholder="Select Supplier"> 
                                            <option value="" hidden>Select Supplier</option>
                                            {suppliers.map((sup) => <option key={sup} value={sup}>{sup}</option>)}
                                        </Field>
                                        {errors.supplier && touched.supplier && <div style={{color: "#ff0000"}}>{errors.supplier}</div>}
                                    </Box>
                                </Box>

                                {/* Stock & costPrice & sellingPrice */}
                                <Box sx={{ display: "flex", flexDirection: {xs: "column", sm: "row"}, gap: 3, mb: 3 }}>
                                    <Box sx={{display: "flex", flexDirection: "column", gap: 1, flex: 1}}>
                                        <label htmlFor="stock">Stock</label>
                                        <Field name="stock" id= "stock" type="number" placeholder="Enter Stock" />
                                        {errors.stock && touched.stock && <div style={{color: "#ff0000"}}>{errors.stock}</div>}
                                    </Box>

                                    <Box sx={{display: "flex", flexDirection: "column", gap: 1, flex: 1}}>
                                        <label htmlFor="costPrice">Cost Price</label>
                                        <Field name="costPrice" id="costPrice" type="number" placeholder="Enter Cost Price" />
                                        {errors.costPrice && touched.costPrice && <div style={{color: "#ff0000"}}>{errors.costPrice}</div>}
                                    </Box>

                                    <Box sx={{display: "flex", flexDirection: "column", gap: 1, flex: 1}}>
                                        <label htmlFor="sellingPrice">Selling Price</label>
                                        <Field name="sellingPrice" id="sellingPrice" type="number" placeholder="Enter Selling Price" />
                                        {errors.sellingPrice && touched.sellingPrice && <div style={{color: "#ff0000"}}>{errors.sellingPrice}</div>}
                                    </Box>
                                </Box>

                                {/* Cancle & Submit Button */}
                                <DialogActions>
                                    <Button onClick={() => handleCancle(resetForm)} sx={{ color: "#1e293b" }}>
                                        Cancel
                                    </Button>
                                    
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

            {/* Product Table */}
            <Box sx={{display: "flex", justifyContent: "center", alignItems: "center", my: 2}}>
                {/* Search Field */}
                <Box sx={{ position: 'relative', border: 1, borderRadius: 2, width: { xs: "100%", sm: "60%", md: "35%" }, 
                        py: 0.5, my: 2
                    }}
                >
                    <InputBase name="search" placeholder="Search Product" value={searchItem}
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
                count={filteredProduct.length}
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

export default AddProduct;