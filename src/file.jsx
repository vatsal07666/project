const DesktopTable = () => {
  return (
    <TableContainer
      component={Paper}
      sx={{
        width: '100%',
        maxWidth: 'calc(100vw - 250px)', // ← Subtract sidebar width (adjust 250px to your sidebar width)
        overflowX: 'auto',
        WebkitOverflowScrolling: 'touch',
        margin: '0 auto',
        '&::-webkit-scrollbar': {
          height: '8px',
        },
        '&::-webkit-scrollbar-track': {
          backgroundColor: '#f1f1f1',
        },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: '#888',
          borderRadius: '4px',
          '&:hover': {
            backgroundColor: '#555',
          },
        },
      }}
    >
      <Table sx={{ minWidth: 900, width: '100%' }}>
        <TableHead>
          <TableRow>
            {["#", "Product", "SKU", "Category", "Supplier", "Stock", "Cost", "Price", "Actions"].map((h) => (
              <TableCell
                key={h}
                sx={{
                  fontSize: { xs: '0.875rem', md: '1rem' },
                  padding: { xs: '12px 8px', md: '16px' },
                  whiteSpace: 'nowrap',
                }}
              >
                {h}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>

        <TableBody>
          {paginatedProducts.length > 0 ? (
            paginatedProducts.map((item, index) => (
              <TableRow key={index}>
                {/* {index + 1} */}
                <TableCell sx={{ fontSize: { xs: '0.813rem', md: '0.938rem' }, padding: { xs: '10px 8px', md: '14px 16px' } }}>
                  {page * rowsPerPage + index + 1}
                </TableCell>

                <TableCell sx={{ fontSize: { xs: '0.813rem', md: '0.938rem' }, padding: { xs: '10px 8px', md: '14px 16px' } }}>
                  {item.productName}
                </TableCell>

                <TableCell sx={{ fontSize: { xs: '0.813rem', md: '0.938rem' }, padding: { xs: '10px 8px', md: '14px 16px' } }}>
                  {item.sku}
                </TableCell>

                <TableCell sx={{ fontSize: { xs: '0.813rem', md: '0.938rem' }, padding: { xs: '10px 8px', md: '14px 16px' } }}>
                  {item.category}
                </TableCell>

                <TableCell sx={{ fontSize: { xs: '0.813rem', md: '0.938rem' }, padding: { xs: '10px 8px', md: '14px 16px' } }}>
                  {item.supplier}
                </TableCell>

                <TableCell sx={{ fontSize: { xs: '0.813rem', md: '0.938rem' }, padding: { xs: '10px 8px', md: '14px 16px' } }}>
                  {item.stock}
                </TableCell>

                <TableCell sx={{ fontSize: { xs: '0.813rem', md: '0.938rem' }, padding: { xs: '10px 8px', md: '14px 16px' } }}>
                  {item.costPrice}
                </TableCell>

                <TableCell sx={{ fontSize: { xs: '0.813rem', md: '0.938rem' }, padding: { xs: '10px 8px', md: '14px 16px' } }}>
                  {item.sellingPrice}
                </TableCell>

                <TableCell sx={{ fontSize: { xs: '0.813rem', md: '0.938rem' }, padding: { xs: '10px 8px', md: '14px 16px' } }}>
                  {/* Delete Button */}
                  <IconButton
                    onClick={() => setDailogOpen(true)}
                  >
                    {/* <DeleteIcon /> */}
                  </IconButton>

                  {/* Delete Button Dailog */}
                  <Dialog open={dailogOpen} onClose={() => setDailogOpen(false)}>
                    <DialogTitle>Confirm Delete</DialogTitle>
                    <DialogContent>
                      <DialogContentText>
                        By Clicking Delete!
                      </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                      <Button onClick={() => setDailogOpen(false)}>
                        Cancle
                      </Button>
                      <Button
                        onClick={() => handleDailog(item, index)}
                        sx={{
                          background: "#ef4444",
                          color: "#fff",
                          transition: "0.2s ease-in-out",
                          '&:hover': {
                            background: "#fff",
                            color: "#ff0000",
                            boxShadow: "0 0 2px rgba(255, 0, 0, 1)"
                          }
                        }}
                      >
                        Delete
                      </Button>
                    </DialogActions>
                  </Dialog>

                  {/* Edit Button */}
                  <IconButton onClick={() => handleEdit(item)}>
                    {/* <EditIcon /> */}
                  </IconButton>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={9} align="center">
                No Product Data Found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

// import * as React from 'react';
// import { styled, useTheme } from '@mui/material/styles';
// import { Box, Button, Drawer, Tooltip } from '@mui/material';
// import MuiDrawer from '@mui/material/Drawer';
// import MuiAppBar from '@mui/material/AppBar';
// import Toolbar from '@mui/material/Toolbar';
// import List from '@mui/material/List';
// import CssBaseline from '@mui/material/CssBaseline';
// import Typography from '@mui/material/Typography';
// import Divider from '@mui/material/Divider';
// import IconButton from '@mui/material/IconButton';
// import MenuIcon from '@mui/icons-material/Menu';
// import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
// import ChevronRightIcon from '@mui/icons-material/ChevronRight';
// import ListItem from '@mui/material/ListItem';
// import ListItemButton from '@mui/material/ListItemButton';
// import ListItemIcon from '@mui/material/ListItemIcon';
// import ListItemText from '@mui/material/ListItemText';
// import { Link } from "react-router-dom";
// import { useHistory, useLocation } from 'react-router-dom';
// import { FaBoxes } from "react-icons/fa";
// import { MdCategory } from "react-icons/md";
// import { TbLayoutDashboardFilled } from "react-icons/tb";
// import { useState } from 'react';
// import { useEffect } from 'react';
// import { useSnackbar } from '../../Login_&_Register/SnackbarContext';
// import { useContext } from 'react';
// import { DataContext } from '../../Context/ContextProvider';
// import useMediaQuery from "@mui/material/useMediaQuery";

// const drawerWidth = 240;

// const openedMixin = (theme) => ({
//     width: drawerWidth,
//     transition: theme.transitions.create('width', {
//         easing: theme.transitions.easing.sharp,
//         duration: theme.transitions.duration.enteringScreen,
//     }),
//     overflowX: 'hidden',
// });

// const closedMixin = (theme) => ({
//     transition: theme.transitions.create('width', {
//         easing: theme.transitions.easing.sharp,
//         duration: theme.transitions.duration.leavingScreen,
//     }),
//     overflowX: 'hidden',
//     width: `calc(${theme.spacing(7)} + 1px)`,
//     [theme.breakpoints.up('sm')]: {
//         width: `calc(${theme.spacing(8)} + 1px)`,
//     },
// });

// const DrawerHeader = styled('div')(({ theme }) => ({
//     display: 'flex',
//     alignItems: 'center',
//     justifyContent: 'flex-end',
//     padding: theme.spacing(0, 1),
//     // necessary for content to be below app bar
//     ...theme.mixins.toolbar,
// }));

// const AppBar = styled(MuiAppBar, {
//         shouldForwardProp: (prop) => prop !== 'open',
//     })(({ theme, open }) => ({
//         zIndex: theme.zIndex.drawer + 1,
//         transition: theme.transitions.create(['width', 'margin'], {
//             easing: theme.transitions.easing.sharp,
//             duration: theme.transitions.duration.leavingScreen,
//         }),
//     ...(open && {
//         marginLeft: drawerWidth,
//         width: `calc(100% - ${drawerWidth}px)`,
//         transition: theme.transitions.create(['width', 'margin'], {
//             easing: theme.transitions.easing.sharp,
//             duration: theme.transitions.duration.enteringScreen,
//         }),
//     }),

// }));

// const DesktopDrawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open'})(
//     ({ theme, open }) => ({
//         width: drawerWidth,
//         flexShrink: 0,
//         whiteSpace: 'nowrap',
//         boxSizing: 'border-box',
//         ...(open && {
//             ...openedMixin(theme),
//             '& .MuiDrawer-paper': openedMixin(theme),
//         }),
//         ...(!open && {
//             ...closedMixin(theme),
//             '& .MuiDrawer-paper': closedMixin(theme),
//         }),
//     }),
// );

// const Items = [
//     { name: "Dashboard", icon: <TbLayoutDashboardFilled />, label: "Dashboard", to: "/admin" },
//     { name: "Product", icon: <FaBoxes />, label: "Add Product", to: "/admin/product" },
//     { name: "Category", icon: <MdCategory />, label: "Add Category", to: "/admin/category" },
// ]

// export default function Index({children}) {
//     const theme = useTheme();
//     const [open, setOpen] = useState(false);
//     const [isLoggedIn, setIsLoggedIn] = React.useState(false);
//     const { ShowSnackbar } = useSnackbar();
//     const history = useHistory();
//     const { setIsDrawerOpen } = useContext(DataContext);
//     const isMobile = useMediaQuery(theme.breakpoints.down("md"));
//     const location = useLocation();

//     const handleDrawerOpen = () => {
//         setOpen(prev => !prev);
//         setIsDrawerOpen(true);
//     };

//     const handleDrawerClose = () => {
//         setOpen(false);
//         setIsDrawerOpen(false)
//     };

//     // ROLE CHECK
//     useEffect(() => {
//         const token = localStorage.getItem("authToken");
//         const role = localStorage.getItem("role");

//         if (!token || role !== "admin") {
//             history.replace(role === "user" ? "/" : "/log-in");
//         } else {
//             setIsLoggedIn(true);
//         }
//     }, [history]);

//     useEffect(() => {
//         if (isMobile && open) {
//             setOpen(false);
//             setIsDrawerOpen(false);
//         }
//     }, [location.pathname, isMobile, open, setIsDrawerOpen]); // route change only


//     const handleLogout = () => {
//         localStorage.removeItem("authToken");
//         localStorage.removeItem("role");
//         setIsLoggedIn(false);
//         history.push("/log-in");
//         ShowSnackbar("Logged Out successful !", "success");
//     };

//     if (!isLoggedIn) return null; // Prevent rendering before role check

//     const DrawerContent = (
//         <>
//             <DrawerHeader>
//                 <IconButton onClick={handleDrawerClose}>
//                     {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
//                 </IconButton>
//             </DrawerHeader>
//             <Divider />
//             {Items.map((menu) => (
//                 <List key={menu.name}>
//                     <ListItem disablePadding sx={{ display: 'block' }}>
//                         <Tooltip title={menu.name} placement="right"
//                             slotProps={{
//                                 tooltip: { sx: {background: "#1e293b", color: "#fff", letterSpacing: 2}}
//                             }}
//                         >
//                             <ListItemButton component={Link} to={menu.to}>
//                                 <ListItemIcon sx={{ minWidth: 0, justifyContent: 'center', fontSize: "23px",
//                                         mr: open ? 3 : 'auto',
//                                     }}
//                                 >
//                                     {menu.icon}
//                                 </ListItemIcon>
//                                 <ListItemText primary={menu.name}
//                                     sx={{ opacity: open ? 1 : 0 }}
//                                 />
//                             </ListItemButton>
//                         </Tooltip>
//                     </ListItem>
//                 </List>
//             ))}
//         </>
//     )

//     return (
//         <Box sx={{ display: 'flex' }}>
//             <CssBaseline />
//             <AppBar position="fixed" open={!isMobile && open} sx={{background: "#1e293b"}}>
//                 <Toolbar>
//                     <IconButton color="inherit" aria-label="open drawer"
//                         onClick={handleDrawerOpen} edge="start"
//                         sx={{ mr: 2, display: { md: open ? "none" : "inline-flex" } }}
//                     >
//                         <MenuIcon />
//                     </IconButton>

//                     <Box sx={{width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center"}}>
//                         <Typography variant="h6" noWrap component="div">
//                             Dashboard
//                         </Typography>
//                         <Button sx={{color: "#fff", border: 1, px: 2, py: 0.6, 
//                                 boxShadow: "0 0 10px rgba(255, 255, 255, 0.7)",
//                                 transition: "0.3s ease-in-out", textTransform: "none",
//                                 '&:hover': { background: "#fff", color: "#252729", border: 0, 
//                                     boxShadow: "0 0 10px rgba(255, 255, 255, 0.7)", fontWeight: 700
//                                 }, fontSize: {xs: "13px", sm: "15px"}
//                             }}
//                             onClick={() => { isLoggedIn ? handleLogout() : history.push("/log-in") }}
//                         >
//                             {isLoggedIn ? "Log out" : "Log in"}
//                         </Button>
//                     </Box>
//                 </Toolbar>
//             </AppBar>

//             {/* Desktop Drawer */}
//             {!isMobile && (
//                 <DesktopDrawer variant="permanent" open={open}>
//                     {DrawerContent}
//                 </DesktopDrawer>
//             )}

//             {/* Mobile Drawer */}
//             {isMobile && (
//                 <Drawer variant="temporary" open={open} onClose={handleDrawerClose}
//                     ModalProps={{ keepMounted: true }}
//                     sx={{ '& .MuiDrawer-paper': { width: drawerWidth, height: '100vh' } }}
//                 >
//                     {DrawerContent}
//                 </Drawer>
//             )}

//             <Box component="main" 
//                 sx={{ minHeight: "100vh", flexGrow: 1, p: { xs: 2, sm: 3 }, mt: 8, transition: 'margin 0.3s',
//                     background: "#f5f7fa"
//                 }}
//             >
//                 {children}
//             </Box>
//         </Box>
//     );
// }

// import './App.css';
// import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
// import LoginPage from "./Login_&_Register/LoginPage";
// import RegisterPage from "./Login_&_Register/RegisterPage";
// import AddProduct from './Product/AddProduct';
// import Index from './IndexFile/Index';
// import Dashboard from './Dashboard/Dashboard';
// import AddCategory from './Category/Add Category';

// function App() {
//     return (
//         <>
//             <Router>
//                 <Switch>
//                     <Route exact path="/log-in" component={LoginPage} />
//                     <Route exact path="/register" component={RegisterPage} />

//                     <Route>
//                         <Index>
//                             <Switch>
//                                 <Route exact path="/" component={Dashboard} />
//                                 <Route exact path="/product" component={AddProduct} />
//                                 <Route exact path="/category" component={AddCategory} />
//                             </Switch>
//                         </Index>
//                     </Route>
//                 </Switch>
//             </Router>
//         </>
//     )
// }

// export default App;


// import React from 'react'
// import Layout from './UserPanel/Layout';
// import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
// import HomePage from './UserPanel/HomePage'; 
// import ProductPage from "./UserPanel/ProductPage";
// import CategoryPage from './UserPanel/CategoryPage';
// import "./App.css";
// import ProductsByCategory from './UserPanel/ProductsByCategory';
// import LoginPage from "./Login_&_Register/LoginPage";
// import RegisterPage from "./Login_&_Register/RegisterPage";

// const App = () => {
//     return (
//         <>
//             <Router>
//                 <Switch>
//                     <Route exact path={"/log-in"} component={LoginPage} />
//                     <Route exact path={"/register"} component={RegisterPage} />
                    
//                     <Route>
//                         <Layout>
//                             <Route exact path={"/"} component={HomePage} />
//                             <Route exact path={"/product"} component={ProductPage} />
//                             <Route exact path={"/category"} component={CategoryPage} />
//                             <Route exact path={"/products/:categoryId"} component={ProductsByCategory} />
//                         </Layout>
//                     </Route>
//                 </Switch>
//             </Router>
//         </>
//     )
// }

// export default App



// import React from "react";
// import { Route, Redirect } from "react-router-dom";

// // role: "admin" or "user" or null
// // example usage: <PrivateRoute path="/admin" component={AdminDashboard} role="admin" />

// const PrivateRoute = ({ component: Component, role, ...rest }) => {
//     const userRole = localStorage.getItem("role"); // get role from localStorage
//     const token = localStorage.getItem("authToken"); // check if logged in

//     return (
//         <Route
//             {...rest}
//             render={(props) =>
//                 token && userRole ? (
//                     role ? (
//                         userRole === role ? (
//                             <Component {...props} />
//                         ) : (
//                             <Redirect to={userRole === "admin" ? "/admin" : "/"} />
//                         )
//                     ) : (
//                         <Component {...props} />
//                     )
//                 ) : (
//                     <Redirect to="/log-in" />
//                 )
//             }
//         />
//     );
// };

// export default PrivateRoute;



import { Button, Paper, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { Box, useMediaQuery, useTheme } from "@mui/system";
import axios from "axios";
import { Field, Form, Formik } from "formik";
import * as Yup from 'yup';
import { useSnackbar } from "./SnackbarContext";
import { useHistory } from "react-router-dom";

const RegisterPage = () => {
    const history = useHistory();
    const { ShowSnackbar } = useSnackbar();

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm")); 

    const initialValues = {username: '', email: '', password: ''};

    const validationSchema = Yup.object({
        username: Yup.string().required("Enter Username*"),
        email: Yup.string().email("Invalid Email*").required("Enter Email*"),
        password: Yup.string().required("Enter Password*")
    })

    const token = "5wI8xsf3DqDSmYTX";

    // const getData = () => {
    //     axios.get("https://generateapi.techsnack.online/api/register", {
    //         headers: { Authorization: token }
    //     })
    //     .then((res) => {
    //         console.log("/* Register Data */");
    //         console.log("GET response: ", res.data);
    //     })
    //     .catch((err) => {
    //         console.error("GET error: ", err);
    //     })
    // }

    const postData = (values) => {
        const data = {username: values.username, email: values.email, password: values.password}

        axios.post("https://generateapi.techsnack.online/api/register", data, {
            headers: { Authorization: token, "Content-Type": "application/json" }
        })
        .then((res) => {
            console.log("/* Register Data */");
            console.log("POST response: ", res.status);
            if(res.status === 200 || res.status === 204){
                // Auto-login after registration
                const role = values.username === "admin" ? "admin" : "user"; // demo role
                localStorage.setItem("authToken", "dummy-token"); // or real token if API provides
                localStorage.setItem("role", role);

                ShowSnackbar("Account Created Successfully!", "success");

                // Redirect based on role
                if (role === "admin") history.push("/admin");
                else history.push("/");
            }
        })
        .catch((err) => {
            console.error("POST error: ", err);
            ShowSnackbar("Registration Failed !", "error");
        })
    }

    const handleSubmit = (values, { resetForm }) => {
        postData(values);
        resetForm();
    }

    return(
        <Box className="register-container"  sx={{ px: {xs: 4.5, md: 0}}}>
            <Paper elevation={10} sx={{ width: "100%", maxWidth: 320, p: { xs: 2.5, md: 4 }, borderRadius: 3 }}>
                <Typography variant={isMobile ? "h5" : "h4"} align="center" fontWeight={700}>
                    Register
                </Typography>

                <Formik initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {({errors, touched}) => (
                        <>
                            <Form className="register-box">
                                <label htmlFor="username">Username</label>
                                <Field name="username" id="username" placeholder="Enter Username" />
                                {errors.username && touched.username && <div style={{color: "#ff0000", marginTop: "5px"}}>{errors.username}</div>}
                                <br /><br />

                                <label htmlFor="email">Email</label>
                                <Field name="email" id="email" type="email" placeholder="Enter Email" />
                                {errors.email && touched.email && <div style={{color: "#ff0000", marginTop: "5px"}}>{errors.email}</div>}
                                <br /><br />

                                <label htmlFor="password">Password</label>
                                <Field name="password" id="password" type="password" placeholder="Enter Password" />
                                {errors.password && touched.password && <div style={{color: "#ff0000", marginTop: "5px"}}>{errors.password}</div>}
                                <br /><br />

                                <Button type="submit" fullWidth size="large" variant="contained" sx={{
                                        mt: 3, py: 1.3, background: "#1e293b", "&:hover": { background: "#0f172a" }
                                    }}
                                >
                                    Create Account
                                </Button>
                                
                                <Box sx={{ mt: 3, display:"flex", justifyContent: "center", 
                                        alignItems: "center", gap: 1, flexWrap: "wrap"
                                    }}
                                >
                                    <Typography variant="body2">
                                        Already have an account?
                                    </Typography>

                                    <Link to="/log-in" className="router-link"> Log In </Link>
                                </Box>
                            </Form>
                        </>
                    )}
                </Formik>
            </Paper>
        </Box>
    )
}   

export default RegisterPage;