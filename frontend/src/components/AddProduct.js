import useRequest from '../hooks/useRequest'; 
import MainNavbar from './MainNavbar';  

const AddProduct = () => {

    const [isLoading, data, error, errorNum, sendRequest] = useRequest(); 

    
    return(
        <div>
            <MainNavbar />
            <h2>Add your product</h2>
            <form>
                <label>Name of your product</label>
                <input 
                placeholder="Name" 
                type="text" 
                name="name" 
                />
            </form>
        </div>
    )
}

export default AddProduct; 