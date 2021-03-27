import { useState } from "react";

const Search = ({ products }) => {
  const [searchData, setSearchData] = useState("");

  return (
    <div>
      <input
        type="text"
        placeholder="Enter name of the product"
        onChange={(e) => {
          setSearchData(e.target.value);
        }}
      />
      {products
        .filter((val) => {
          if (searchData === "") return val;
          else if (val.name.toLowerCase().includes(searchData.toLowerCase())) {
            return val;
          }
        })
        .map((val, key) => {
          return (
            <div className="product" key={key}>
              <p>{val.name}</p>
              <p>{val.description}</p>
              <p>{val.price}</p>
            </div>
          );
        })}
    </div>
  );
};

export default Search;
