import React, { useContext, useEffect } from "react";
import { AppBar, Box, Button, Container, CssBaseline, Divider, Drawer, IconButton, List, ListItem, ListItemButton, ListItemText,  
    Toolbar, Typography 
} from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import { BiSolidShoppingBagAlt } from "react-icons/bi";
import { Link, NavLink } from "react-router-dom/cjs/react-router-dom";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { useSnackbar } from "../../Context/SnackbarContext";
import { CartContext } from "../../Context/CartProvider";

const drawerWidth = 240;

const Navbar = (props) => {
    const { window } = props;
    const [mobileOpen, setMobileOpen] = React.useState(false);
    const [isLoggedIn, setIsLoggedIn] = React.useState(false);
    const { ShowSnackbar } = useSnackbar();
    const history = useHistory();
    const {cart} = useContext(CartContext);
    
    const navItems = [
        {name: 'Home', to: "/"}, 
        {name: 'Product', to: "/user/product"}, 
        {name: 'Category', to: "/user/category"},
        {name: `Cart ( ${cart.length} )`, to: "/user/cart"}
    ];

    const handleDrawerToggle = () => {
        setMobileOpen((prevState) => !prevState);
    };

    useEffect(() => {
        const token = localStorage.getItem("authToken");
        setIsLoggedIn(!!token);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("authToken");
        setIsLoggedIn(false);
        history.push("/log-in");
        ShowSnackbar("Logged Out successful !", "success");
    };

    const drawer = (
        <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
            <Box sx={{ display: "flex", justifyContent :"center", alignItems: "center", gap: 1, my: 2, 
                    fontWeight: 600 
                }}
            >
                <BiSolidShoppingBagAlt />
                <Typography component="span" sx={{fontWeight: 600, fontSize: "17px"}}>My Website</Typography>
            </Box>

            <Divider />

            <List>
                {navItems.map((item) => (
                    <ListItem key={item.name} component={Link} to={item.to} disablePadding sx={{color: "#1e293b"}}>
                        <ListItemButton sx={{ textAlign: 'center' }}>
                            <ListItemText primary={item.name} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Box>
    );

    const container = window !== undefined ? () => window().document.body : undefined;

    return(
        <>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <CssBaseline />
                <AppBar component="nav" sx={{background: "#1e293b"}}>
                    <Container maxWidth="lg">
                        <Toolbar disableGutters sx={{gap: 3}}>
                            <IconButton color="inherit" aria-label="open drawer" edge="start"
                                onClick={handleDrawerToggle}
                                sx={{ mr: 2, display: { sm: 'none' } }}
                            >
                                <MenuIcon />
                            </IconButton>

                            <Box sx={{ display: "flex", justifyContent: {xs: "center", sm: "flex-start"}, alignItems: "center", gap: 1, 
                                    fontSize: {xs: "18px", sm: "20px"}, flex: {xs: 1, sm: "none"},
                                }}
                            >
                                <BiSolidShoppingBagAlt />
                                <Typography component="span" sx={{fontWeight: 600, fontSize: {xs: "16px", sm: "20px"}}}>
                                    My Website
                                </Typography>
                            </Box>

                            <Box sx={{ display: { xs: 'none', sm: 'flex' }, justifyContent: "center", flex: 1, gap: 2 }}>
                                {navItems.map((item) => (
                                    <Button key={item.name} component={NavLink} to={item.to} exact
                                        sx={{ position: "relative", color: '#fff', textTransform: "none", 
                                            py: 0.5, fontSize: {xs: "20px", sm: "16px"}, transition: "0.2s ease-in-out",
                                            '&::after': { content: '""', position: "absolute", left: 0, bottom: 0,
                                                width: "0%", height: "2px", backgroundColor: "#ff0",
                                                transition: "width 0.3s ease",
                                            },
                                            "&.active::after": {width: "100%"},
                                            '&:hover::after': { width: "100%" }, '&:hover': { background: "transparent"}
                                        }}
                                    >
                                        {item.name}
                                    </Button>
                                ))}
                            </Box>

                            <Box>
                                <Button component={Link} to={"/log-in"} sx={{border: 2, borderRadius: 2, 
                                        background: "#1e293b", color: "#fff", px: 2, py: 0.5,
                                        transition: "0.3s ease-in-out", 
                                        '&:hover': {background: "#fff", color: "#1e293b"}
                                    }}
                                    onClick={() => isLoggedIn ? handleLogout() : history.push("/log-in")}
                                >
                                    <Typography component="span" sx={{ textTransform: "none", 
                                            fontSize: {xs: "13px", sm: "15px"} 
                                        }}
                                    >
                                        {isLoggedIn ? "Log out" : "Log in"}
                                    </Typography>
                                </Button>
                            </Box>
                        </Toolbar>
                    </Container>
                </AppBar>

                <nav>
                    <Drawer container={container} variant="temporary" open={mobileOpen}
                        onClose={handleDrawerToggle}
                        ModalProps={{
                            keepMounted: true, // Better open performance on mobile.
                        }}
                        sx={{ display: { xs: 'block', sm: 'none' },
                            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                        }}
                    >
                        {drawer}
                    </Drawer>
                </nav>
            </Box>
        </>
    )
}

export default Navbar;