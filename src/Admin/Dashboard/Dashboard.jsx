import { Box, Card, CardContent, Grid, IconButton, Paper, Typography } from "@mui/material";
import { useContext } from "react";
import { DataContext } from "../../Context/ContextProvider";
import { FaBoxes } from "react-icons/fa";
import { MdCategory } from "react-icons/md";
import { Link } from "react-router-dom";
import CountUp from 'react-countup';

const Dashboard = () => {
    const { products, categories } = useContext(DataContext);

    const cards = [
        {
            icon: <FaBoxes />,
            title: "Products",
            count: products.length,
            path: "/admin/product",
            tooltip: "Goto Products",
        },
        {
            icon: <MdCategory />,
            title: "Categories",
            count: categories.length,
            path: "/admin/category",
            tooltip: "Goto Category",
        },
    ] 

    return(
        <>
            <Box>
                <Box sx={{mb: 2}}>
                    <Typography variant="h4">Dashboard</Typography>
                </Box>

                <Grid container spacing={{ xs: 2, sm: 3 }}>
                    {cards.map((item, index) => (
                        <Grid size={{ xs: 12, sm: 4 }} key={index} component={Link} to={item.path}
                            sx={{textDecoration: "none"}}
                        >
                            <Card sx={{ width: "100%", border: 1, borderRadius: 2 }}>
                                <CardContent sx={{display: "flex", flexDirection: "column", alignItems: "center"}}>
                                    <IconButton component={Paper} sx={{ p: 1.5, mb: 1, color: "#fff", background: "#1e293b",
                                        transition: "0.3s ease-in-out",
                                        '&:hover': {background: "#fff", color: "#1e293b", fontWeight: 700, border: 1.5}
                                        }}
                                    >
                                        {item.icon}
                                    </IconButton>
                                    <Typography gutterBottom variant="h5" component="div">
                                        {item.title}
                                    </Typography>
                                    <Typography variant="h3">
                                        <CountUp delay={0.5} end={item.count} duration={0.6} />
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Box>
        </>
    )
}   

export default Dashboard;