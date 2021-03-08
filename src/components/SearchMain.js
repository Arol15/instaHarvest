import { useState, useEffect } from 'react'; 
import { useHistory } from "react-router-dom"; 
import { useForm } from "react-hook-form";
import useRequest from "../hooks/useRequest"; 

const SearchMain = () => {

    const { register, handleSubmit, setValue } = useForm();
    const [isLoading, data, error, errorNum, sendRequest] = useRequest();

    const history = useHistory(); 

    const onSubmit = (searchTerm) => {
        sendRequest("/api/products/get-all", "post", searchTerm); 
    }; 

    useEffect(() => {
       if (data) {
           history.push({
               pathname: "/all-products",
               state: data.products,
            }); 
       }
    }, [data]);

    return(
        <>
        {error && <h1>Error: {error}</h1>}
        {isLoading && <h1>Is Loading</h1>}
        <form onSubmit={handleSubmit(onSubmit)}>
            <input type="text" placeholder="Enter your location" name="search_term" ref={register}/>
            <button type="submit">Find</button>
        </form>
        </>
    )
}

export default SearchMain; 