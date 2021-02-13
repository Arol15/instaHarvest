import React, { useEffect, useState } from 'react'; 
import Product from './Product'; 

const Products = () => {

    const [products, setProducts] = useState([]);

    useEffect(() => {
        fetch('/api/products/get-all')
        .then((res) => {
        // console.log(res)
        return res.json()
        })
        .then(data => setProducts(data.products))
    }, [])

    return (
        <div>
            <Product products = {products}/>
        </div>
    )
}

export default Products; 

