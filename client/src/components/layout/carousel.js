import React from "react";
import styles from "../../static/css/carousel.module.css"

function Carousel() {
  return (
    <div
      id="carouselExampleFade"
      className={`${styles['carousel-fade']} carousel slide carousel-fade container`}
      data-bs-ride="carousel"
    >
      <div className={`${styles['carousel-inner']} carousel-inner`} >
        <div className="carousel-item active">
          <img src="https://cdnv2.tgdd.vn/mwg-static/tgdd/Banner/b7/e0/b7e05e63dcacde4d2a8e76d2f03e61cd.png" className="d-block w-100" alt="..." />
        </div>
        <div className="carousel-item">
          <img src="https://cdnv2.tgdd.vn/mwg-static/tgdd/Banner/cb/0b/cb0ba849f0806df6502e1022d15b688d.jpg" className="d-block w-100" alt="..." />
        </div>
        <div className="carousel-item">
          <img src="https://cdnv2.tgdd.vn/mwg-static/tgdd/Banner/2c/91/2c915a88ed675e3caba447f53c4f4c38.png" className="d-block w-100" alt="..." />
        </div>
      </div>
      <button
        className="carousel-control-prev"
        type="button"
        data-bs-target="#carouselExampleFade"
        data-bs-slide="prev"
      >
        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Previous</span>
      </button>
      <button
        className="carousel-control-next"
        type="button"
        data-bs-target="#carouselExampleFade"
        data-bs-slide="next"
      >
        <span className="carousel-control-next-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Next</span>
      </button>
    </div>
  );
}

export default Carousel;
