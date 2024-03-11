import { useContext } from "react";
import { ShopContext } from "../../context/ShopContext";
import { useParams } from "react-router-dom";
import Breadcrumbs from "../breadcrumbs/Breadcrumbs";
import ProductDisplay from "../productDisplay/ProductDisplay";
import DescriptionBox from "../descriptionBox/DescriptionBox";
import RelatedProducts from "../relatedProduct/RelatedProducts";

const Products = () => {
  const { all_product } = useContext(ShopContext);
  const { productId } = useParams();
  
  const product = all_product.find((e) => e.id === Number(productId));
  return (
    <div>
      <Breadcrumbs product={product}></Breadcrumbs>
      <ProductDisplay product={product}></ProductDisplay>
      <DescriptionBox></DescriptionBox>
      <RelatedProducts></RelatedProducts>
    </div>
  );
};

export default Products;
