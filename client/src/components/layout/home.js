import React from 'react';

function Home() {
    return (
        <section style={{ backgroundColor: "#eee" }}>
            <div className="container py-5">
                <div className="row">
                    <div className="col-md-6 col-lg-3 mb-4 mb-md-0 mt-3">
                        <div className="card">
                            <img src="https://mdbcdn.b-cdn.net/img/Photos/Horizontal/E-commerce/Products/4.webp"
                                className="card-img-top mt-3" alt="Gaming Laptop" />
                            <div className="card-body">
                                <div className="d-flex mb-3">
                                    <h4 className="mb-0">HP Notebook</h4>
                                </div>

                                <div className="d-flex">
                                    <h5 className="text-danger fw-bold">15.000.000đ</h5>
                                </div>

                                <div className="d-flex">
                                    <p className="small text-secondary"><s>19.000.000đ</s></p>
                                </div>

                                <div className="d-flex justify-content-between mb-2">
                                    <p className="text-muted mb-0">Có sẵn: <span className="fw-bold">5</span></p>
                                    <div className="ms-auto text-warning">
                                        <i className="fa fa-star"></i>
                                        <i className="fas fa-star"></i>
                                        <i className="fas fa-star"></i>
                                        <i className="fas fa-star"></i>
                                        <i className="fas fa-star-half-alt"></i>
                                    </div>
                                </div>

                                <button type="button" class="btn btn-buy-custom">Mua ngay</button>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6 col-lg-3 mb-4 mb-md-0 mt-3">
                        <div className="card">
                            <img src="https://mdbcdn.b-cdn.net/img/Photos/Horizontal/E-commerce/Products/7.webp"
                                className="card-img-top mt-3" alt="Gaming Laptop" />
                            <div className="card-body">
                                <div className="d-flex mb-3">
                                    <h4 className="mb-0">HP Envy</h4>
                                </div>

                                <div className="d-flex">
                                    <h5 className="text-danger fw-bold">10.000.000đ</h5>
                                </div>

                                <div className="d-flex">
                                    <p className="small text-secondary"><s>15.000.000đ</s></p>
                                </div>

                                <div className="d-flex justify-content-between mb-2">
                                    <p className="text-muted mb-0">Có sẵn: <span className="fw-bold">7</span></p>
                                    <div className="ms-auto text-warning">
                                        <i className="fa fa-star"></i>
                                        <i className="fas fa-star"></i>
                                        <i className="fas fa-star"></i>
                                        <i className="fas fa-star"></i>
                                        <i className="fas fa-star-half-alt"></i>
                                    </div>
                                </div>

                                <button type="button" class="btn btn-buy-custom">Mua ngay</button>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6 col-lg-3 mb-4 mb-md-0 mt-3">
                        <div className="card">
                            <img src="https://mdbcdn.b-cdn.net/img/Photos/Horizontal/E-commerce/Products/5.webp"
                                className="card-img-top mt-3" alt="Gaming Laptop" />
                            <div className="card-body">
                                <div className="d-flex mb-3">
                                    <h4 className="mb-0">Toshiba B77</h4>
                                </div>

                                <div className="d-flex">
                                    <h5 className="text-danger fw-bold">10.000.000đ</h5>
                                </div>

                                <div className="d-flex">
                                    <p className="small text-secondary"><s>15.000.000đ</s></p>
                                </div>

                                <div className="d-flex justify-content-between mb-2">
                                    <p className="text-muted mb-0">Có sẵn: <span className="fw-bold">5</span></p>
                                    <div className="ms-auto text-warning">
                                        <i className="fa fa-star"></i>
                                        <i className="fas fa-star"></i>
                                        <i className="fas fa-star"></i>
                                        <i className="fas fa-star"></i>
                                        <i className="fas fa-star-half-alt"></i>
                                    </div>
                                </div>

                                <button type="button" class="btn btn-buy-custom">Mua ngay</button>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6 col-lg-3 mb-4 mb-md-0 mt-3">
                        <div className="card">
                            <img src="https://mdbcdn.b-cdn.net/img/Photos/Horizontal/E-commerce/Products/12.webp"
                                className="card-img-top mt-3" alt="Gaming Laptop" />
                            <div className="card-body">
                                <div className="d-flex mb-3">
                                    <h4 className="mb-0">Dell Xtreme 270</h4>
                                </div>

                                <div className="d-flex">
                                    <h5 className="text-danger fw-bold">10.000.000đ</h5>
                                </div>

                                <div className="d-flex">
                                    <p className="small text-secondary"><s>15.000.000đ</s></p>
                                </div>

                                <div className="d-flex justify-content-between mb-2">
                                    <p className="text-muted mb-0">Có sẵn: <span className="fw-bold">5</span></p>
                                    <div className="ms-auto text-warning">
                                        <i className="fa fa-star"></i>
                                        <i className="fas fa-star"></i>
                                        <i className="fas fa-star"></i>
                                        <i className="fas fa-star"></i>
                                        <i className="fas fa-star-half-alt"></i>
                                    </div>
                                </div>

                                <button type="button" class="btn btn-buy-custom">Mua ngay</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Home;