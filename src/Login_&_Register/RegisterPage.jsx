import { Button } from "@mui/material";
import { Link } from "react-router-dom";
import { Box } from "@mui/system";
import axios from "axios";
import { Field, Form, Formik } from "formik";
import * as Yup from 'yup';
import { useSnackbar } from "./SnackbarContext";
import { useHistory } from "react-router-dom";

const RegisterPage = () => {
    const history = useHistory();
    const { ShowSnackbar } = useSnackbar();

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
        <Box className="register-container">
            <Formik initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({errors, touched}) => (
                    <>
                        <Form className="register-box">
                            <Box sx={{textAlign: "center"}}><h1>Register</h1></Box>

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

                            <Button type="submit" variant="contained">Create Account</Button>
                            
                            <Box sx={{ textAlign: "center", display:"flex", justifyContent: "center", 
                                    alignItems: "center", gap: 1
                                }}
                            >
                                <p>Already Have An Account?</p>
                                <Link to="/log-in" className="router-link"> Log In </Link>
                            </Box>
                        </Form>
                    </>
                )}
            </Formik>
        </Box>
    )
}   

export default RegisterPage;