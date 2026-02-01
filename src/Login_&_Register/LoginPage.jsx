import { Field, Form, Formik } from "formik";
import { Link } from "react-router-dom";
import { Box, Button } from "@mui/material";
import axios from "axios";
import * as Yup from 'yup';
import { useSnackbar } from "./SnackbarContext";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

const LoginPage = () => {
    const { ShowSnackbar } = useSnackbar();
    const history = useHistory();

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
        <Box className="login-container">
            <Formik initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({errors, touched}) => (
                    <Form className="login-box">
                        <Box sx={{textAlign: "center"}}><h1>Login</h1></Box>
                        
                        <label htmlFor="username">Username </label>
                        <Field name="username" id="username" placeholder="Enter Username" />
                        {errors.username && touched.username && <div style={{color: "#ff0000", marginTop: "5px"}}>{errors.username}</div>}
                        <br /><br />

                        <label htmlFor="password">Password </label>
                        <Field name="password" id="password" type="password" placeholder="Enter Password" />
                        {errors.password && touched.password && <div style={{color: "#ff0000", marginTop: "5px"}}>{errors.password}</div>}
                        <br /><br />

                        <Button type="submit" variant="contained">Log In</Button>

                        <Box sx={{ textAlign: "center", display:"flex", justifyContent: "center", 
                                alignItems: "center", gap: 1
                            }}
                        >
                            <p>Don't have An Account?</p>
                            <Link to="/register" className="router-link"> Register </Link>
                        </Box>
                    </Form>
                )}
            </Formik>
        </Box>
    )
}

export default LoginPage