import { useHistory, useLocation } from "react-router-dom"; 
import { useModal } from "../../hooks/hooks";


const Product = ({product, onDelete, user_id}, ) => {

    const history = useHistory(); 
    const location = useLocation(); 
    const prevPath = location.pathname;
    const divStyle = {
        border: "1px solid black", 
        margin: "5px"
    }

    const [modal, showModal, closeModal] = useModal({
        withBackdrop: true,
        useTimer: false,
        inPlace: false,
      });

    const handleClick = (product) => {
        history.push("/product-info", product)
    }

    const handleClickEdit = (product) => {
        history.push("edit-product", product)
    }

     const confirmDelete = (
        <>
            <h3>Are you sure to delete?</h3>
            <button onClick={() => onDelete(product.product_id)}>Yes</button>
            <button onClick={() => closeModal()}>No</button>
        </>
    );

    return (
        <>
        {(user_id === product.user_id || prevPath === '/user-products') ? (
            <div style={divStyle}>
                {/* <h1>Your product</h1> */}
                <p>{product.name}</p>
                <p>{product.description}</p>
                <p>${product.price}</p>
                <button onClick={() => handleClickEdit(product)}>Edit Product</button>
                </div>
        ) : (
            <div onClick={() => handleClick(product)} style={divStyle} className="product">
            <p>{product.name}</p>
            <p>{product.description}</p>
            <p>${product.price}</p>
            </div>)
        }
            {prevPath === "/search-results" ? null : 
            (<button onClick={() => {
                showModal(confirmDelete)
                }
                }>Delete Product</button>)}
            {modal}
        </>
    )
}

export default Product; 