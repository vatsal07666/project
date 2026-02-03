import React from "react";
import { AppBar, Box, Button, CssBaseline, Divider, Drawer, IconButton, InputBase, List, ListItem, ListItemButton, ListItemText, 
    Toolbar, Typography 
} from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';

const drawerWidth = 240;
const navItems = ['Home', 'Product', 'Category'];

const UserPage = (props) => {
    const { window } = props;
    const [mobileOpen, setMobileOpen] = React.useState(false);

    const handleDrawerToggle = () => {
        setMobileOpen((prevState) => !prevState);
    };

    const drawer = (
        <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
            <Typography variant="h6" sx={{ my: 2 }}>
                MUI
            </Typography>
            <Divider />
            <List>
                {navItems.map((item) => (
                    <ListItem key={item} disablePadding>
                        <ListItemButton sx={{ textAlign: 'center' }}>
                        <ListItemText primary={item} />
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
                <AppBar component="nav">
                    <Toolbar sx={{gap: 3}}>
                        <IconButton color="inherit" aria-label="open drawer" edge="start"
                            onClick={handleDrawerToggle}
                            sx={{ mr: 2, display: { sm: 'none' } }}
                        >
                            <MenuIcon />
                        </IconButton>

                        <Typography variant="h6" component="div"
                            sx={{ display: { xs: 'none', sm: 'block' }, flex: 1 }}
                        >
                            MUI
                        </Typography>

                        <Box sx={{ display: { xs: 'none', sm: 'block' }, flex: 1 }}>
                            {navItems.map((item) => (
                                <Button key={item} sx={{ color: '#fff' }}>
                                    {item}
                                </Button>
                            ))}
                        </Box>

                        {/* Search Field */}
                        <Box sx={{ position: 'relative', border: 1, borderRadius: 2}}>
                            <InputBase name="search" placeholder="Search"
                                sx={{ paddingLeft: '40px', width: '100%', background: "#fff", borderRadius: 2 }}
                            />
                            <SearchIcon sx={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: "#000"}} />
                        </Box>
                    </Toolbar>
                </AppBar>

                <nav>
                    <Drawer container={container} variant="temporary" open={mobileOpen}
                        onClose={handleDrawerToggle}
                        ModalProps={{
                            keepMounted: true, // Better open performance on mobile.
                        }}
                        sx={{
                            display: { xs: 'block', sm: 'none' },
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

export default UserPage;