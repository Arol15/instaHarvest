import { useState, useEffect } from 'react'; 

const Search = () => {

    const [searchData, setSearchData] = useState(""); 
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
            <input type="text" placeholder="Enter name of the product" onChange={(e) => {setSearchData(e.target.value)}}/>
            {products.filter((val) => {
                if (val.name.toLowerCase().includes(searchData.toLowerCase())) {
                    return val
                }
            }).map((val, key) => {
                return (
                    <div className = "product" key={key}>
                        <p>{val.name}</p>
                        <p>{val.description}</p>
                        <p>{val.price}</p>
                    </div>
                )
            })
            }
        </div> 
    )
}

export default Search; 