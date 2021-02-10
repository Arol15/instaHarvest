import { useEffect, useState } from 'react'; 
import Products from "./Products"

const Home = () => {

    const [products, setProducts] = useState([]);

    useEffect(() => {
        fetch('/api/products/get-all')
        .then((res) => {
        // console.log(res)
        return res.json()
        })
        .then(data => setProducts(data.products))
    }, [])

    return(
    <div>
        <h1>Welcome to instaHarvest</h1>
        <Products products={products} />
    </div>
    )
}

export default Home; 