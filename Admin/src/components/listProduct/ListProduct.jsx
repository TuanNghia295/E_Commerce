import { useEffect, useState } from "react";
import "./listProduct.css";
import { CiSquareRemove } from "react-icons/ci";
const ListProduct = () => {
  const [allProducts, setAllProducts] = useState([]);

  const fetchInfo = async () => {
    await fetch("http://localhost:2905/allProducts")
      .then((res) => res.json())
      .then((data) => setAllProducts(data));
  };

  useEffect(() => {
    fetchInfo();
  }, []);

  const removeProduct = async (id) => {
    await fetch("http://localhost:2905/allProducts/removeProduct", {
      method: "POST",
      headers: {
        // headers có thể chứa thông tin như các thông số của request,
        // authentication tokens, và nhiều thông tin khác.
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      // Body là phần dữ liệu mà ta truyền đi để có thể xử lý
      body: JSON.stringify({ pro_code: id }),
    }).catch(function (err) {
      console.log("error deleting", err);
    });
    await fetchInfo();
  };

  return (
    <div className="listProduct">
      <h1>All Products List</h1>
      <div className="listProduct-format-main">
        <p>Products</p>
        <p>Title</p>
        <p>Old Price</p>
        <p>new Price</p>
        <p>Category</p>
        <p>Remove</p>
      </div>
      <div className="listProduct-allProduct">
        <hr />
        {allProducts.map((product, indexedDB) => {
          const { pro_code, name, image, old_price, new_price, category } =
            product;
          return (
            <div key={indexedDB}>
              <div className="listProduct-format-main listProduct-format">
                <img
                  src={image.replace(";", "")}
                  alt=""
                  className="listProduct-productIcon"
                />
                <p>{name}</p>
                <p>${old_price}</p>
                <p>${new_price}</p>
                <p>{category}</p>
                <CiSquareRemove
                  className="listProduct-removeIcon"
                  onClick={() => removeProduct(pro_code)}
                />
              </div>
              ;
              <hr />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ListProduct;
