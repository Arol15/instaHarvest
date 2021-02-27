import React, { useEffect, useState } from 'react'; 
import { useRequest } from '../hooks/hooks'; 
import Product from './Product'; 

const Products = () => {

    const [products, setProducts] = useState([]);
    const [isLoading, data, error, errorNum, sendRequest] = useRequest(); 

    useEffect(() => {
        sendRequest("/api/products/get-all", 'post', null); 
    }, []); 

    useEffect(() => {
        if(data) {
            setProducts(data.products)
        }
    }, [data])

    return (
        <>
        {products.map((product) => {
            return (
                <div key={product.product_id}>
                    <Product product = {product}/>
                </div>
            )
        })}
       </>
    )
}

export default Products; 

