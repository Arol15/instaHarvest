import { useState, useEffect } from 'react'; 
import { useForm } from "react-hook-form";
import useRequest from "../hooks/useRequest"; 
import Search from './Search'

const SearchMain = () => {

    const { register, handleSubmit, setValue } = useForm();
    const [isLoading, data, error, errorNum, sendRequest] = useRequest();
    const [products, setProducts] = useState([]); 

    const onSubmit = (searchTerm) => {
        sendRequest("/api/products/get-all", "post", searchTerm); 
    }; 

    useEffect(() => {
       if(data) {
           setProducts(data)
        //    console.log(products)
       }
    }, [data])


    return(
        <>
            {!data ? 
            (<form onSubmit={handleSubmit(onSubmit)}>
                <input type="text" placeholder="Enter your location" name="search_term" ref={register}/>
                <button type="submit">Find</button>
            </form>) : (
                <Search products={products}/>
            )
            
        }
            
        </>
    )
}

export default SearchMain; 