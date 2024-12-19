import React from "react";
import Carousel from "./carousel";
import style from "../../static/css/home.module.css";
import ProductList from "../product/product_list";

function Home() {
  return (
    <>
      <Carousel />
      <section className={`${style['select_home']}`}>
        <div className="container py-5">
          <ProductList />
        </div>
      </section>
    </>
  );
}

export default Home;
