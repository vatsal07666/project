import { Field, Form, Formik } from "formik";
import { Link } from "react-router-dom";
import { Box, Button, Paper, Typography, useMediaQuery, useTheme } from "@mui/material";
import axios from "axios";
import * as Yup from 'yup';
import { useSnackbar } from "./SnackbarContext";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

const LoginPage = () => {
    const { ShowSnackbar } = useSnackbar();
    const history = useHistory();

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));     

    const initialValues = {username: '', password: ''};

    const validationSchema = Yup.object({
        username: Yup.string().required("Username is Required*"),
        password: Yup.string().required("Password is Required*")
    })

    const token = "vZt3CGeByg2P1RDS";

    const postItem = (values) => {
        const data = {username: values.username, password: values.password}

        axios.post("https://generateapi.techsnack.online/api/login", data, {
            headers: {Authorization: token, "Content-Type": "application/json" }
        })
        .then((res) => {
            console.log("/* Login Data */");
            console.log("POST response: ", res.data);
        })
        .catch((err) => {
            console.error("POST error: ", err);
        })
    }

    const handleSubmit = (values, { resetForm }) => {
        postItem(values);
        resetForm();
        history.push("/");
        ShowSnackbar("Login Successful !", "success");
    }

    return(
        <Box className="login-container" sx={{ px: {xs: 2, md: 0}}}>
            <Paper elevation={10} sx={{ width: "100%", maxWidth: 320, p: { xs: 2.5, md: 4 }, borderRadius: 3 }}>
                <Typography variant={isMobile ? "h5" : "h4"} align="center" fontWeight={700}>
                    Login
                </Typography>
            
                <Formik initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {({errors, touched}) => (
                        <Form className="login-box">
                            <label htmlFor="username">Username </label>
                            <Field name="username" id="username" placeholder="Enter Username" />
                            {errors.username && touched.username && <div style={{color: "#ff0000", marginTop: "5px"}}>{errors.username}</div>}
                            <br /><br />

                            <label htmlFor="password">Password </label>
                            <Field name="password" id="password" type="password" placeholder="Enter Password" />
                            {errors.password && touched.password && <div style={{color: "#ff0000", marginTop: "5px"}}>{errors.password}</div>}
                            <br /><br />

                            <Button type="submit" fullWidth size="large" variant="contained" sx={{
                                    mt: 3, py: 1.3, background: "#1e293b", "&:hover": { background: "#0f172a" }
                                }}
                            >
                                Log In
                            </Button>

                            <Box sx={{ mt: 3, display:"flex", justifyContent: "center", 
                                    alignItems: "center", gap: 1, flexWrap: "wrap"
                                }}
                            >
                                <Typography variant="body2">
                                    Don&apos;t have an account?
                                </Typography>
                                <Link to="/register" className="router-link"> Register </Link>
                            </Box>
                        </Form>
                    )}
                </Formik>
            </Paper>
        </Box>
    )
}

export default LoginPage