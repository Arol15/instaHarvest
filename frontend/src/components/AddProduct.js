import useRequest from '../hooks/useRequest'; 

const AddProduct = () => {

    const [isLoading, data, error, errorNum, sendRequest] = useRequest(); 

    return(
        <div>
            add product
        </div>
    )
}

export default AddProduct; 