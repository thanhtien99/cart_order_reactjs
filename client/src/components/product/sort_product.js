import styles from "../../static/css/product.module.css";

const SortProduct = ({ 
  categories,
  filterCategory, 
  setfilterCategory, 
  filterPrice, 
  setfilterPrice, 
  totalProducts,
  sortBy,
  setSortBy
}) => {
  const handleSortChange = (e) => {
    const newSort = e.target.value;
    setSortBy(newSort);
  };

  const filters = {
    category: filterCategory || [],
    price_range: filterPrice || "",
    sort: sortBy || "",
  };

  const price_option = [
    { name: "below_10", value: "Dưới 10 triệu"},
    { name: "10_20", value: "Từ 10 - 20 triệu"},
    { name: "20_30", value: "Từ 20 - 30 triệu"},
    { name: "above_30", value: "Trên 30 triệu"}
  ]
  
  return (
    <>
      <div className="d-flex justify-content-between align-items-center flex-wrap mb-3">
        <span className="fw-semibold me-3 text-nowrap">Tìm thấy {totalProducts} sản phẩm</span>

        <div className="d-flex align-items-center">
          <label className="fw-semibold me-2 text-nowrap">Sắp xếp theo</label>
          <select 
            className="form-select" 
            style={{ minWidth: "150px", borderRadius: "10px" }} 
            value={sortBy} 
            onChange={handleSortChange}
          >
            <option value="new_product">Mới</option>
            <option value="old_product">Cũ</option>
            <option value="price_asc">Giá thấp - cao</option>
            <option value="price_desc">Giá cao - thấp</option>
          </select>
        </div>
      </div>

      <div className="d-flex align-items-center flex-wrap">
        {(filters.category.length > 0 || filters.price_range) && (
          <>
            <span 
              className={`badge rounded-pill text-secondary me-2 ${styles["tab-filter"]} ${styles["tab-filter-close"]}`} 
              onClick={() => {
                setfilterCategory([]);
                setfilterPrice("");
                setSortBy("");
              }}
            >
              Xoá tất cả
            </span>

            {filters.category.map((category, index) => (
              <span 
                key={index} 
                className={`badge rounded-pill me-2 d-flex align-items-center ${styles["tab-filter"]} ${styles["tab-filter-choose"]}`}
              >
                {
                  categories.find(option => option._id === category)?.name || category
                }
                <button 
                  type="button" 
                  className={`btn-close btn-close-sm ms-2 ${styles["btn-close-blue"]}`} 
                  onClick={() => setfilterCategory(filters.category.filter((c) => c !== category))}
                  style={{ fontSize: "8px", width: "10px", height: "10px" }}
                ></button>
              </span>
            ))}

            {filters.price_range && (
              <span 
                className={`badge rounded-pill me-2 d-flex align-items-center ${styles["tab-filter"]} ${styles["tab-filter-choose"]}`}
              >
                {
                  price_option.find(option => option.name === filters.price_range)?.value || filters.price_range
                }
                <button 
                  type="button" 
                  className={`btn-close btn-close-sm ms-2 ${styles["btn-close-blue"]}`} 
                  onClick={() => setfilterPrice("")}
                  style={{ fontSize: "8px", width: "10px", height: "10px" }}
                ></button>
              </span>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default SortProduct;
