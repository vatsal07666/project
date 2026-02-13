import axios from "axios";
import { createContext, useEffect, useState } from "react";

export const DataContext = createContext();

export const ContextProvider = ({children}) => {
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const suppliers = ["Global Electronics Ltd", "Home Supply", "Fashion World Inc", "SportsPro Equipment"];

    // Tokens
    const productToken = "w4AkMdTjMm7CLvTY";
    const categoryToken = "y5japrtJDM9NkJjU";


    // Get Data
    const getProducts = () => {
        return axios.get("https://generateapi.techsnack.online/api/product", {
            headers: { Authorization: productToken }
        })
        .then((res) => setProducts(res.data.Data))
        .catch((err) => console.error("GET error: ", err))
    }

    const getCategories = () => {
        return axios.get("https://generateapi.techsnack.online/api/category", {
            headers: { Authorization: categoryToken }
        })
        .then((res) => setCategories(res.data.Data))
        .catch((err) => console.error("GET error: ", err))
    }

    useEffect(() => {
        getProducts();
        getCategories();
    }, [])

    return(
        <DataContext.Provider value={{ products, setProducts, categories, setCategories, suppliers }}>
            {children}
        </DataContext.Provider>
    )
}