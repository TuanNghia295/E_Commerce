import { useContext, useEffect, useState } from "react";
import { ShopContext } from "../../context/ShopContext";
import { useParams } from "react-router-dom";
import Breadcrumbs from "../breadcrumbs/Breadcrumbs";
import ProductDisplay from "../productDisplay/ProductDisplay";
import DescriptionBox from "../descriptionBox/DescriptionBox";
import RelatedProducts from "../relatedProduct/RelatedProducts";

const Products = () => {
  const { all_product } = useContext(ShopContext);
  const { productId } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    async function getProduct() {
        const foundProduct = await all_product.find(
            (e) => e.pro_code === productId
        );
        if (foundProduct) {
            setProduct(foundProduct);
        }
    }

    getProduct();
}, [all_product, productId]);




  // Kiểm tra xem dữ liệu đã được tải xong chưa
  if (!all_product.length) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      {product ? (
        <>
          <Breadcrumbs product={product}></Breadcrumbs>
          <ProductDisplay product={product}></ProductDisplay>
          <DescriptionBox></DescriptionBox>
          <RelatedProducts></RelatedProducts>
        </>
      ) : (
        <p>Product not found</p>
      )}
    </div>
  );
};

export default Products;
