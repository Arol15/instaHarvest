import { useState, useEffect } from "react";
import { useRequest } from "./hooks";

/**
 *  useFavorites
 *
 * ```
 * const {total, added, addToFavorites} = useFavorites(product_id);
 * ```
 */

const useFavorites = (product_id) => {
  const [added, setAdded] = useState(false);
  const [total, setTotal] = useState(0);

  const { data, sendRequest } = useRequest();

  const addToFavorites = () => {
    sendRequest(`/api/products/like/${product_id}`, "POST");
  };

  useEffect(() => {
    sendRequest(`/api/products/get_likes/${product_id}`, "POST");
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (data) {
      setAdded(data.liked);
      setTotal(data.likes);
    }
  }, [data]);

  return { total, added, addToFavorites };
};

export default useFavorites;
