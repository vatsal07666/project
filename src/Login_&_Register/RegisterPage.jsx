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

    const getData = () => {
        axios.get("https://generateapi.techsnack.online/api/register", {
            headers: { Authorization: token }
        })
        .then((res) => {
            console.log("/* Register Data */");
            console.log("GET response: ", res.data);
        })
        .catch((err) => {
            console.error("GET error: ", err);
        })
    }

    const postData = (values) => {
        const data = {username: values.username, email: values.email, password: values.password}

        axios.post("https://generateapi.techsnack.online/api/register", data, {
            headers: { Authorization: token, "Content-Type": "application/json" }
        })
        .then((res) => {
            console.log("/* Register Data */");
            console.log("POST response: ", res.status);
            if(res.status === 200 || res.status === 204){
                getData();
            }
        })
        .catch((err) => {
            console.error("POST error: ", err);
        })
    }

    const handleSubmit = (values, { resetForm }) => {
        postData(values);
        resetForm();
        ShowSnackbar("Account Created Successfully !", "success");
        history.push("/log-in");
    }

    return(
        <Box className="register-container"  sx={{ px: {xs: 5, md: 0}}}>
            <Paper elevation={10} sx={{ width: "100%", maxWidth: 320, p: {xs: 3, md: 4}, borderRadius: 3 }}>
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