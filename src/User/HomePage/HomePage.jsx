import React from 'react'
import { Box, Button, Container, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import image from "../Images/IMAGE.png";

const HomePage = () => {
    return (
        <>
            <Box className="home" sx={{ display: "flex", justifyContent :"center", flexDirection: "column", flex: 1, 
                    minHeight: "100vh", backgroundImage: `url(${image})`, backgroundPosition: {xs: "top", sm: "center"},
                    backgroundRepeat: "no-repeat", backgroundSize: "cover"
                }}
            >
                <Container maxWidth="lg">
                    <Box sx={{display: "flex", flexDirection: "column", justifyContent: "center", 
                            alignItems: "center", color: "#fff", gap: 1.5
                        }}
                    >
                        <Typography component={"span"} sx={{fontSize: {xs: "27px", sm: "40px"}}}> 
                            Explore Our Categories 
                        </Typography>
                        
                        <Button component={Link} to={"/user/category"} variant="contained" type="button" 
                            sx={{ color: "#fff", background: "transparent", border: 2,
                                transition: "0.3s ease-in-out",
                                '&:hover': {background: "#fff", color: "#1e293b", fontWeight: 600 }, 
                                "& .arrow": { transform: "translateX(-5px)", ml: 1,
                                    transition: "opacity 0.3s, transform 0.3s" 
                                },
                                "&:hover .arrow": { opacity: 1, transform: "translateX(0)" },
                                fontSize: {xs: "12px", sm: "14px"}
                            }}
                        >
                            Goto Categories
                            <ArrowForwardIcon className="arrow" fontSize="small" />
                        </Button>
                    </Box>
                </Container>
            </Box>
        </>
    )
}

export default HomePage 