import { useContext, useEffect } from 'react'; 
import { useHistory } from "react-router-dom"; 
import { useForm } from "react-hook-form";
import useRequest from "../hooks/useRequest"; 
import { ModalMsgContext } from "../context/ModalMsgContext"


const SearchMain = () => {

    const { register, handleSubmit, setValue } = useForm();
    const [isLoading, data, error, errorNum, sendRequest] = useRequest();
    const [, setModalMsgState] = useContext(ModalMsgContext);


    const history = useHistory(); 

    const onSubmit = (searchTerm) => {
        sendRequest("/api/products/get-all", "post", searchTerm); 
    }; 

    useEffect(() => {
        if (data && data.products.length === 0) {
            setModalMsgState({
                open: true, 
                msg: "No results per this location", 
                classes: "mdl-error"
            })
        } else if (data) {
            console.log("yes data")
           history.push({
               pathname: "/search-results",
               state: data.products,
            });    
       } else if (error) {
           setModalMsgState({
               open: true, 
               msg: error, 
               classes: "mdl-error"
           }); 
       }
    }, [data, error]);

    return(
        <>
        {/* {error && <h1>Error: {error}</h1>} */}
        {isLoading && <h1>Is Loading</h1>}
        <form onSubmit={handleSubmit(onSubmit)}>
            <input type="text" placeholder="Enter your location" name="search_term" ref={register}/>
            <button type="submit">Find</button>
        </form>
        </>
    )
}

export default SearchMain; 