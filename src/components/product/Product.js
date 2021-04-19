import { useHistory, useLocation } from "react-router-dom";
import { useModal } from "../../hooks/hooks";

import classnames from "classnames";

const Product = ({ product }) => {
  const history = useHistory();
  // const location = useLocation();
  // const prevPath = location.pathname;
  // const divStyle = {
  //     border: "1px solid black",
  //     margin: "5px"
  // }

  // const [modal, showModal, closeModal] = useModal({
  //     withBackdrop: true,
  //     useTimer: false,
  //     inPlace: false,
  //   });

  const handleClick = (prod) => {
    history.push("/product-info", prod);
  };

  const handleClickEdit = (prod) => {
    history.push("/edit-product", prod);
  };

  //  const confirmDelete = (
  //     <>
  //         <h3>Are you sure to delete?</h3>
  //         <button onClick={() => onDelete(product.product_id)}>Yes</button>
  //         <button onClick={() => closeModal()}>No</button>
  //     </>
  // );

  return (
    <div className="prd-grid">
      <div
        className={classnames("product-element", {
          "prd-personal": product.personal,
        })}
      >
        {/* <img className="prd-img" src={product.image_urls.length > 0 ? product.image_urls[0] : product.icon} /> */}
        <div className="prd-description">
          <p>
            <b>{product.properties.name}</b>
          </p>
          <p>${product.properties.price}</p>
          {product.geometry.properties.distance_km && (
            <p>{product.geometry.properties.distance_km} km away</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Product;

// {(user_id === product.user_id || prevPath === '/user-products') ? (
//     <div style={divStyle}>
//         {/* <h1>Your product</h1> */}
//         <p>{product.name}</p>
//         <p>{product.description}</p>
//         <p>${product.price}</p>
//         <button onClick={() => handleClickEdit(product)}>Edit Product</button>
//         </div>
// ) : (
//     <div onClick={() => handleClick(product)} style={divStyle} className="product">
//     <p>{product.name}</p>
//     <p>{product.description}</p>
//     <p>${product.price}</p>
//     </div>)
// }
//     {prevPath === "/search-results" ? null :
//     (<button onClick={() => {
//         showModal(confirmDelete)
//         }
//         }>Delete Product</button>)}
//     {modal}
