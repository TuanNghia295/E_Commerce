import { useState } from "react";
import "./editProduct.css";
import { SlCloudUpload } from "react-icons/sl";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
const EditProduct = () => {
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

  const { id } = useParams();

  const imageHandler = (e) => {
    setImage(e.target.files[0]);
  };

  useEffect(() => {
    console.log(id);
    // Hàm để lấy dữ liệu sản phẩm từ server
    const fetchProduct = async () => {
      const response = await fetch(`http://localhost:2905/allProducts/${id}`);
      const data = await response.json();
      if (data.success) {
        setProductDetails(data.product); // Cập nhật state với dữ liệu sản phẩm
      }
    };
    fetchProduct(); // Gọi hàm khi component được render
  }, [id]); // Chạy lại useEffect khi pro_code thay đổi

  useEffect(() => {
    console.log("prod", productDetails);
  });

  const changeHandler = (e) => {
    const { name, value } = e.target;
    setProductDetails({
      ...productDetails,
      [e.target.pro_code]: [e.target.value],
      [name]: value,
    });
  };

  const editProduct = async () => {
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
        console.log("répons", responseData);
      })
      .catch((err) => console.log("error upload", err));
    product.image = responseData.image_url;
    console.log(product);
    await fetch(
      `http://localhost:2905/allProducts/update/${product.pro_code}`,
      {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(product),
      }
    )
      .then((res) => res.json())
      .then((data) => {
        data.success ? alert("Product updated") : alert("Update failed");
      });
  };

  const changeSizeHandler = (index, e) => {
    let newSizeArray = [...productDetails.size];
    newSizeArray[index] = e.target.value;
    setProductDetails({
      ...productDetails,
      size: newSizeArray,
    });
  };

  const addSizeField = () => {
    setProductDetails({
      ...productDetails,
      size: [...productDetails.size, ""],
    });
  };

  return (
    <div className="EditProduct">
      <div className="EditProduct-item-field">
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
      <div className="EditProduct-item-field">
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

      <div className="EditProduct-price">
        <div className="EditProduct-item-field">
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

      <div className="EditProduct-price">
        <div className="EditProduct-item-field">
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

      <div className="EditProduct-item-field">
        <p>Product category</p>
        <select
          value={productDetails.category}
          onChange={changeHandler}
          name="category"
          id=""
          className="EditProduct-selector"
        >
          <option value="women">Women</option>
          <option value="men">Man</option>
          <option value="kid">Kid</option>
        </select>
      </div>

      <div className="EditProduct-item-field">
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

      <div className="EditProduct-item-field">
        <p>Product size</p>
        {productDetails.size.map((size, index) => (
          <input
            key={index}
            value={size}
            onChange={(e) => changeSizeHandler(index, e)}
            type="text"
            name="size"
            id=""
            placeholder="Type here"
          />
        ))}
        <button onClick={addSizeField}>Add size</button>
      </div>

      <div className="EditProduct-item-field">
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

      <div className="EditProduct-item-field">
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

      <div className="EditProduct-item-field">
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

      <button onClick={() => editProduct()} className="EditProduct-btn">
        SAVE
      </button>
    </div>
  );
};

export default EditProduct;
