import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import { Box, Button, Tooltip } from '@mui/material';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { Link } from "react-router-dom";
import { useHistory } from 'react-router-dom';
import { FaBoxes } from "react-icons/fa";
import { MdCategory } from "react-icons/md";
import { TbLayoutDashboardFilled } from "react-icons/tb";
import { useState } from 'react';
import { useEffect } from 'react';

const drawerWidth = 240;

const openedMixin = (theme) => ({
    width: drawerWidth,
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
});

const closedMixin = (theme) => ({
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up('sm')]: {
        width: `calc(${theme.spacing(8)} + 1px)`,
    },
});

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
        shouldForwardProp: (prop) => prop !== 'open',
    })(({ theme }) => ({
        zIndex: theme.zIndex.drawer + 1,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    variants: [
        {
        props: ({ open }) => open,
            style: {
                marginLeft: drawerWidth,
                width: `calc(100% - ${drawerWidth}px)`,
                transition: theme.transitions.create(['width', 'margin'], {
                    easing: theme.transitions.easing.sharp,
                    duration: theme.transitions.duration.enteringScreen,
                }),
            },
        },
    ],
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme }) => ({
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
        boxSizing: 'border-box',
        variants: [
            {
                props: ({ open }) => open,
                style: {
                    ...openedMixin(theme),
                    '& .MuiDrawer-paper': openedMixin(theme),
                },
            },
            {
                props: ({ open }) => !open,
                style: {
                    ...closedMixin(theme),
                    '& .MuiDrawer-paper': closedMixin(theme),
                },
            },
        ],
    }),
);

const Items = [
    {
        name: "Dashboard", icon: <TbLayoutDashboardFilled />, label: "Dashboard", to: "/"
    },
    {
        name: "Product", icon: <FaBoxes />, label: "Add Product", to: "/product"
    },
    {
        name: "Category", icon: <MdCategory />, label: "Add Category", to: "/category"
    },
]


export default function Index({children}) {
    const theme = useTheme();
    const [open, setOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(null);

    const history = useHistory();

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    useEffect(() => {
        const token = localStorage.getItem("token");
        setIsLoggedIn(!!token);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        setIsLoggedIn(false);
        history.push("/log-in");
    };

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar position="fixed" open={open} sx={{background: "#1e293b"}}>
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={handleDrawerOpen}
                        edge="start"
                        sx={[ { marginRight: 5 }, open && { display: 'none' } ]}
                    >
                        <MenuIcon />
                    </IconButton>

                    <Box sx={{width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                        <Typography variant="h6" noWrap component="div">
                            Mini variant drawer
                        </Typography>
                        <Button sx={{color: "#fff", border: 1, p: "5px 20px", boxShadow: "0 0 10px rgba(255, 255, 255, 0.7)",
                                '&:hover': { background: "#fff", color: "#252729", border: 0, 
                                    boxShadow: "0 0 10px rgba(255, 255, 255, 0.7)", fontWeight: 700
                                }
                            }}
                            onClick={() => {
                                if(isLoggedIn) handleLogout()
                                else history.push("/log-in")
                            }}
                        >
                            {isLoggedIn ? "Logout" : "Login"}
                        </Button>
                    </Box>
                </Toolbar>
            </AppBar>

            <Drawer variant="permanent" open={open}>
                <DrawerHeader>
                    <IconButton onClick={handleDrawerClose}>
                        {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                    </IconButton>
                </DrawerHeader>
                <Divider />
                {Items.map((menu) => (
                    <List key={menu.name}>
                        <ListItem disablePadding sx={{ display: 'block' }}>
                            <Tooltip title={menu.name} placement="right"
                                slotProps={{
                                    tooltip: {
                                        sx: {background: "#1e293b", color: "#fff", letterSpacing: 2}
                                    }
                                }}
                            >
                                <ListItemButton component={Link} to={menu.to}>
                                    <ListItemIcon
                                        sx={[ { minWidth: 0, justifyContent: 'center', fontSize: "23px" },
                                            open ? { mr: 3, } : { mr: 'auto', },
                                        ]}
                                    >
                                        {menu.icon}
                                    </ListItemIcon>
                                    <ListItemText primary={menu.name}
                                        sx={[ open ? { opacity: 1, } : { opacity: 0, } ]}
                                    />
                                </ListItemButton>
                            </Tooltip>
                        </ListItem>
                    </List>
                ))}
            </Drawer>

            <Box component="main" sx={{ height: "90vh", flexGrow: 1, p: 3}}>
                {children}
            </Box>
        </Box>
    );
}
