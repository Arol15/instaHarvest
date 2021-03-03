import { useState, useEffect } from 'react'; 
import { useForm } from "react-hook-form";
import useRequest from "../hooks/useRequest"; 
import Product from './Product'

const SearchMain = () => {

    const { register, handleSubmit, setValue } = useForm();
    const [isLoading, data, error, errorNum, sendRequest] = useRequest();
    const [products, setProducts] = useState([]); 

    const onSubmit = (searchTerm) => {
        sendRequest("/api/products/get-all", "post", searchTerm); 
    }; 

    useEffect(() => {
       if (data) {
           setProducts(data)
       } 
    }, [data])

    return(
        <>
        {error && <h1>Error: {error}</h1>}
        {isLoading && <h1>Is Loading</h1>}
        { products.length === 0 ? 
        (<form onSubmit={handleSubmit(onSubmit)}>
            <input type="text" placeholder="Enter your location" name="search_term" ref={register}/>
            <button type="submit">Find</button>
        </form>) : (
            <Product products={products.products}/>)
        }   
        </>
    )
}

export default SearchMain; 