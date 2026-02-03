import { Box, Button, Grid, IconButton, Paper, Typography } from "@mui/material";
import { useContext } from "react";
import { DataContext } from "../Context/ContextProvider";
import { FaBoxes } from "react-icons/fa";
import { MdCategory } from "react-icons/md";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { Link } from "react-router-dom";

const Dashboard = () => {
    const { products, categories } = useContext(DataContext);

    const dashboard = [
        {
            icon: <FaBoxes />,
            title: "Products",
            count: products.length,
            path: "/product",
            tooltip: "Goto Products",
        },
        {
            icon: <MdCategory />,
            title: "Categories",
            count: categories.length,
            path: "/category",
            tooltip: "Goto Category",
        },
    ] 

    return(
        <>
            <Box sx={{ mt: 10 }}>
                {/* Grid space and size change */}
                <Grid container spacing={{ xs: 2, sm: 3, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
                    {dashboard.map((item, index) => (
                        <Grid size={{ xs: 12, sm: 4, md: 3 }} key={index}>
                            <Box component={Paper} sx={{display: "flex", flexDirection: "column", justifyContent: "center", 
                                    alignItems: "center", p: 4, borderRadius: 5
                                }}
                            >
                                <IconButton component={Paper} sx={{ p: 1.5, mb: 1, color: "#fff", background: "#1e293b",
                                        transition: "0.3s ease-in-out",
                                        '&:hover': {background: "#fff", color: "#1e293b", fontWeight: 600}
                                    }}
                                >
                                    {item.icon}
                                </IconButton>

                                <Typography variant="h5" sx={{fontWeight: 600}}>{item.title}</Typography>

                                <Typography variant="p" sx={{fontWeight: 600, my: 2, fontSize: "xx-large"}}>
                                    {item.count}
                                </Typography>

                                <Button component={Link} to={item.path} variant="contained" type="button" 
                                    sx={{ color: "#fff", background: "#1e293b", 
                                        transition: "0.3s ease-in-out",
                                        '&:hover': {background: "#fff", color: "#1e293b", fontWeight: 600 }, 
                                        "& .arrow": { transform: "translateX(-5px)", ml: 1,
                                            transition: "opacity 0.3s, transform 0.3s" 
                                        },
                                        "&:hover .arrow": { opacity: 1, transform: "translateX(0)" }
                                    }}
                                >
                                    {item.tooltip}
                                    <ArrowForwardIcon className="arrow" fontSize="small" />
                                </Button>
                            </Box>
                        </Grid>
                    ))}
                </Grid>
            </Box>
        </>
    )
}   

export default Dashboard;