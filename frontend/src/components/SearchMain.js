import { useState, useEffect } from 'react'; 
import useRequest from "../hooks/useRequest"; 

const SearchMain = () => {

    const [isLoading, data, error, errorNum, sendRequest] = useRequest();
    const [searchDataTerm, setSearchDataTerm] = useState(""); 
    const [products, setProducts] = useState([]); 

    const onClick = (searchDataTerm) => {
        sendRequest('/api/products/get-all', "post", searchDataTerm); 
    }; 

    useEffect(() => {
       if(data) {
           setProducts(data)
       }
    }, [])


    return(
        <div>
            <input type="text" placeholder="Enter your location" onChange={(e) => {setSearchDataTerm(e.target.value)}}/>
            <button onClick={onClick}>Find</button>
        </div> 
    )
}

export default SearchMain; 