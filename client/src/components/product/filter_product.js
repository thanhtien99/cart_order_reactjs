import { useState } from "react";

const FilterProduct = ({ 
  categories,
  filterCategory, 
  setfilterCategory,
  filterPrice,
  setfilterPrice }) => {
  const [isPriceOpen, setIsPriceOpen] = useState(true);
  const [isCategoryOpen, setIsCategoryOpen] = useState(true);

  const handlePriceChange = (price_range) => {
    setfilterPrice(price_range);
  };

  const handleCategoryChange = (category, category_name) => {
    if (category === "all") {
      setfilterCategory([]);
    } else {
      const updatedCategories = filterCategory.includes(category)
        ? filterCategory.filter((c) => c !== category)
        : [...filterCategory, category];
  
      setfilterCategory(updatedCategories);
    }
  };

  return (
    <div className="col-3 p-4 pt-0">
      <div className="p-3 border rounded bg-white text-start" style={{ position: "sticky", top: "20px", minHeight: "40vh", overflowY: "auto" }}>
        <h5 className="fw-bold mb-3">BỘ LỌC TÌM KIẾM</h5>
        <hr />

        {/* Price */}
        <div>
          <p className="fw-bold d-flex justify-content-between align-items-center" style={{ cursor: "pointer" }} onClick={() => setIsPriceOpen(!isPriceOpen)}>
            Khoảng Giá
            <span>{
            isPriceOpen ? 
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chevron-right" viewBox="0 0 16 16">
              <path fillRule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708"/>
            </svg> 
            : 
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chevron-down" viewBox="0 0 16 16">
              <path fillRule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708"/>
            </svg>
            }</span>
          </p>
          <div className={`small ${isPriceOpen ? "" : "collapse"}`}>
            {[
              { id: "all", label: "Tất cả", value: "" },
              { id: "below_10", label: "Dưới 10 triệu", value: "below_10" },
              { id: "10_20", label: "Từ 10 - 20 triệu", value: "10_20" },
              { id: "20_30", label: "Từ 20 - 30 triệu", value: "20_30" },
              { id: "above_30", label: "Trên 30 triệu", value: "above_30" },
            ].map((item) => (
              <div className="form-check" key={item.id}>
                <input 
                  className="form-check-input" 
                  type="radio" 
                  name="price" 
                  id={item.id} 
                  checked={filterPrice === item.value} 
                  onChange={() => handlePriceChange(item.value)} 
                />
                <label className="form-check-label" htmlFor={item.id}>{item.label}</label>
              </div>
            ))}
          </div>
        </div>

        {/* Category */}
        <div className="mt-3">
          <p className="fw-bold d-flex justify-content-between align-items-center" style={{ cursor: "pointer" }} onClick={() => setIsCategoryOpen(!isCategoryOpen)}>
            Theo Danh Mục
            <span>{isCategoryOpen ? 
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chevron-right" viewBox="0 0 16 16">
                <path fillRule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708"/>
              </svg> 
              : 
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chevron-down" viewBox="0 0 16 16">
                <path fillRule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708"/>
              </svg>
            }</span>
          </p>
          <div className={`small ${isCategoryOpen ? "" : "collapse"}`}>
            <div className="form-check">
              <input 
                className="form-check-input" 
                type="checkbox" 
                id="all-categories"
                checked={filterCategory.length === 0}
                onChange={() => handleCategoryChange("all")} 
              />
              <label className="form-check-label" htmlFor="all-categories">Tất cả</label>
            </div>
            {categories.map((category) => (
                <div className="form-check" key={category._id}>
                  <input 
                    className="form-check-input" 
                    type="checkbox" 
                    id={category.name} 
                    checked={filterCategory.includes(category._id)} 
                    onChange={() => handleCategoryChange(category._id, category.name)} 
                  />
                  <label className="form-check-label" htmlFor={category.name}>{category.name}</label>
                </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterProduct;
