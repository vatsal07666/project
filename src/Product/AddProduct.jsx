import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, IconButton, Paper, Table, TableBody, 
    TableCell, TableContainer, TableHead, TableRow, Tooltip, InputBase
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
import { useSnackbar } from "../Login_&_Register/SnackbarContext";
import { DataContext } from "../Context/ContextProvider";

const initialValues = {productName: '', sku: '', category: '', supplier: '', stock: '', costPrice: '', sellingPrice: ''};

const AddProduct = () => {
    const [data, setData] = useState([]);
    const [editId, setEditId] = useState(null);
    const [formValues, setFormValues] = useState(initialValues);
    const [searchItem, setSearchItem] = useState("");
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const { categories, suppliers } = useContext(DataContext);

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
            setData(res.data.Data);
        })
        .catch((err) => {
            console.error("GET error: ", err);
        })
    }

    // Load Data
    useEffect(() => {
        getData();
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
                ShowSnackbar("Data Added Successfully !", "success");
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
                setData(data.filter((_,i) => i !== index));
                ShowSnackbar("Data Deleted Successfully !", "error");
            }
        })
        .catch((err) => {
            console.log("DELETE error: ", err);
        })
    }

    // Patch Method
    const patchData = (id, values) => {
        // const val = {productName: values.productName, quantity: values.quantity, price: values.price}

        axios.patch(`https://generateapi.techsnack.online/api/product/${id}`, values, {
            headers: { Authorization: token }
        })
        .then((res) => {
            console.log("PATCH response: ", res.data);
            if(res.status === 200 || res.status === 204){
                getData();
                setEditId(null);
                ShowSnackbar("Data Updated Successfully !", "success");
                handleRefresh();
            }
        })
        .catch((err) => {
            console.error("PATCH response: ", err);
        })
    }

    // Submit Action
    const handleSubmit = (values, {resetForm}) => {
        if (document.activeElement) document.activeElement.blur();
        
        if(editId !== null){
            patchData(editId, values);
        } else {
            postData(values);
        }
        resetForm();
        setEditId(null);
        setOpen(false);
        setFormValues(initialValues)
    }

    // Edit/Update Action
    const handleEdit = (item) => {
        if (document.activeElement) document.activeElement.blur();
        
        setEditId(item._id);
        setFormValues({
            productName: item.productName, sku: item.sku, category: item.category, supplier: item.supplier,
            stock: item.stock, costPrice: item.costPrice, sellingPrice: item.sellingPrice 
        })
        setOpen(true);
    }

    // Cancle Action
    const handleCancle = () => {
        if (document.activeElement) document.activeElement.blur();

        setOpen(false); 
        setEditId(null);
        setFormValues(initialValues);
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

    // Search Logic
    const searchTerm = searchItem?.toLowerCase() || "";
    const filteredProduct = (data || []).filter((item) => (item.productName || "").toLowerCase().includes(searchTerm));

    return(
        <Box component={Paper} sx={{p:3, borderRadius: 2, mt: 10}}>
            {/* Heading & Add Product Button */}
            <Box sx={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                <h1>Products</h1>
                <Button onClick={() => setOpen(true)} 
                    sx={{background: "#1e293b", color: "#fff", p: "8px 14px", borderRadius: 2}}
                    startIcon={<IoMdAdd />}
                >
                    Add Products
                </Button>
            </Box>

            {/* Product Form */}
            <Dialog open={open} sx={{ zIndex: 2000 }} maxWidth="md" fullWidth >
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
                        {({errors, touched, isSubmitting, isValid, dirty}) => (
                            <Form>
                                {/* Product & SKU */}
                                <Box sx={{ display: "flex", gap: 3, mb: 3 }}>
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
                                <Box sx={{ display: "flex", gap: 3, mb: 3 }}>
                                    <Box sx={{display: "flex", flexDirection: "column", gap: 1, flex: 1}}>
                                        <label htmlFor="category">Category</label>
                                        <Field name= "category" id= "category" as="select">
                                            <option value="" hidden>Select Category</option>
                                            {categories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
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
                                <Box sx={{ display: "flex", gap: 3, mb: 3 }}>
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
                                    <Button onClick={handleCancle} sx={{ color: "#1e293b" }}>
                                        Cancel
                                    </Button>
                                    
                                    <Button type="submit" variant="contained"                
                                        sx={{ background: "#1e293b", "&:hover": { background: "#0f172a" } }}
                                        disabled={isSubmitting || !isValid || !dirty}
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
            <Box sx={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                {/* Heading & Referesh Button */}
                <Box sx={{display: "flex", alignItems: "center", gap: 1}}>
                    <h2>List Of Products</h2>

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
                    <InputBase name="search" placeholder="Search Product" value={searchItem}
                        onChange={(e) => setSearchItem(e.target.value)}
                        sx={{ paddingLeft: '40px', width: '100%' }}
                    />
                    <SearchIcon sx={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)'}} />
                </Box>
            </Box>

            {/* Table */}
            <TableContainer component={Paper} elevation={0}>
                <Table>
                    <TableHead sx={{background: "#1e293b",
                        "& .MuiTableCell-root": { color: "#fff", fontSize: "16px", 
                            borderRight: "1px solid rgba(255, 255, 255, 0.1)",
                            whiteSpace: "nowrap", textAlign: "center", fontWeight: 600
                        }
                    }}>
                        <TableRow>
                            <TableCell>#</TableCell>
                            <TableCell>Product Name</TableCell>
                            <TableCell>SKU</TableCell>
                            <TableCell>Category</TableCell>
                            <TableCell>Supplier</TableCell>
                            <TableCell>Stock</TableCell>
                            <TableCell>Cost Price</TableCell>
                            <TableCell>Selling Price</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {filteredProduct.length > 0 ? (
                            filteredProduct.map((item, index) => (
                                <TableRow key={item._id ?? index}>
                                    <TableCell>{index + 1}</TableCell>
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
                                                    onClick={() => deleteData(item._id, index)}
                                                >
                                                    <RiDeleteBin6Line />
                                                </IconButton>
                                            </Tooltip>

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
        </Box>
    )
}

export default AddProduct;