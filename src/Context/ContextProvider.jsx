import { createContext } from "react"

export const DataContext = createContext();

export const ContextProvider = ({children}) => {
    // Category & Supplier List
    const categories = ["Electronics", "Home Appliances", "Fashion", "Sports"];
    const suppliers = ["Global Electronics Ltd", "Home Supply", "Fashion World Inc", "SportsPro Equipment"];

    return(
        <DataContext.Provider value={{ categories, suppliers }}>
            {children}
        </DataContext.Provider>
    )
}