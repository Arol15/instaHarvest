import { useState, useEffect } from 'react'; 
import { useForm } from "react-hook-form";
import useRequest from "../hooks/useRequest"; 
// import Search from './Search'
import Product from './Product'

const SearchMain = () => {

    const { register, handleSubmit, setValue } = useForm();
    const [isLoading, data, error, errorNum, sendRequest] = useRequest();
    const [products, setProducts] = useState([]); 

    const onSubmit = (searchTerm) => {
        sendRequest("/api/products/get-all", "post", searchTerm); 
        // console.log(data)
    }; 

    useEffect(() => {
       if (data) {
        //    console.log(data)
           setProducts(data)
       } 
    }, [data])

    // console.log(products)
    // console.log(typeof(products))
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