import { useState } from "react";
import "./addProduct.css";
import { SlCloudUpload } from "react-icons/sl";
const AddProduct = () => {
  const [image, setImage] = useState(false);
  const [productDetails, setProductDetails] = useState({
    name: "",
    image: "",
    category: "women",
    new_price: "",
    old_price: "",
  });

  const imageHandler = (e) => {
    setImage(e.target.files[0]);
  };

  const changeHandler = (e) => {
    setProductDetails({ ...productDetails, [e.target.name]: e.target.value });
  };

  const addProduct = async () => {
    console.log(productDetails);
    let responseData;
    let product = productDetails;

    let formData = new FormData();
    formData.append("product", image);

    await fetch("http://localhost:2905/upload", {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        responseData = data;
      });
      if(responseData.success){
        product.image = responseData.image_url
        console.log(product);
        await fetch("http://localhost:2905/addProduct",{
          method: "POST",
          headers:{
            Accept: "application/json",
            'Content-Type':"application/json"
          },
          body: JSON.stringify(product),
        }).then((res) => res.json()).then((data) => {
          data.success  ? alert("Product added") : alert("Failed")
        })
      }

  };

  return (
    <div className="addProduct">
      <div className="addProduct-item-field">
        <p>Product title</p>
        <input
          value={productDetails.name}
          onChange={changeHandler}
          type="text"
          name="name"
          id=""
          placeholder="Type here"
        />
      </div>

      <div className="addProduct-price">
        <div className="addProduct-item-field">
          <p>Price</p>
          <input
            value={productDetails.old_price}
            onChange={changeHandler}
            type="text"
            name="old_price"
            placeholder="Type here"
          />
        </div>
      </div>

      <div className="addProduct-price">
        <div className="addProduct-item-field">
          <p>Offer Price</p>
          <input
            value={productDetails.new_price}
            onChange={changeHandler}
            type="text"
            name="new_price"
            placeholder="Type here"
          />
        </div>
      </div>

      <div className="addProduct-item-field">
        <p>Product category</p>
        <select
          value={productDetails.category}
          onChange={changeHandler}
          name="category"
          id=""
          className="addProduct-selector"
        >
          <option value="women">Women</option>
          <option value="man">Man</option>
          <option value="kid">Kid</option>
        </select>
      </div>

      <div className="addProduct-item-field">
        <label htmlFor="file-input" className="product-upload">
          {image ? (
            URL.createObjectURL(image)
          ) : (
            <SlCloudUpload className="product-thumbnail-image" />
          )}
        </label>

        <input
          onChange={imageHandler}
          type="file"
          name="image"
          id="file-input"
          hidden
        />
      </div>

      <button onClick={() => addProduct()} className="addProduct-btn">
        ADD
      </button>
    </div>
  );
};

export default AddProduct;
