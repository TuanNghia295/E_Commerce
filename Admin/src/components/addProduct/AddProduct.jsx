import { useState } from "react";
import "./addProduct.css";
import { SlCloudUpload } from "react-icons/sl";
const AddProduct = () => {
  const [image, setImage] = useState(false);
  const [productDetails, setProductDetails] = useState({
    pro_code: "",
    name: "",
    image: "",
    category: "women",
    new_price: "",
    old_price: "",
    color: "",
    size: [],
    description: "",
    quantity: "",
  });

  const imageHandler = (e) => {
    setImage(e.target.files[0]);
  };

  const changeHandler = (e) => {
    const { name, value } = e.target;
      setProductDetails({
        ...productDetails,
        [e.target.pro_code]: [e.target.value],
        [name]: value,
      });
    }

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
      })
      .catch((err) => console.log("error upload", err));
    if (responseData.success) {
      product.image = responseData.image_url;
      console.log(product);
      await fetch("http://localhost:2905/allProducts/addProduct", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(product),
      })
        .then((res) => res.json())
        .then((data) => {
          data.success ? alert("Product added") : alert("Failed");
        });
    }
  };

  return (
    <div className="addProduct">
      <div className="addProduct-item-field">
        <p>Product code</p>
        <input
          value={productDetails.pro_code}
          onChange={changeHandler}
          type="text"
          name="pro_code"
          id=""
          placeholder="Type here"
        />
      </div>
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
          <option value="men">Man</option>
          <option value="kid">Kid</option>
        </select>
      </div>

      <div className="addProduct-item-field">
        <p>Product color</p>
        <input
          value={productDetails.color}
          onChange={changeHandler}
          type="text"
          name="color"
          id=""
          placeholder="Type here"
        />
      </div>

      <div className="addProduct-item-field">
        <p>Product size</p>
        <input
          value={productDetails.size}
          onChange={changeHandler}
          type="text"
          name="size"
          id=""
          placeholder="41,42,43,..."
        />
      </div>

      <div className="addProduct-item-field">
        <p>Product description</p>
        <input
          value={productDetails.description}
          onChange={changeHandler}
          type="text"
          name="description"
          id=""
          placeholder="Type here"
        />
      </div>

      <div className="addProduct-item-field">
        <p>Product quantity</p>
        <input
          value={productDetails.quantity}
          onChange={changeHandler}
          type="text"
          name="quantity"
          id=""
          placeholder="Type here"
        />
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
