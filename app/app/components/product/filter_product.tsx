import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';

function FilterProduct({ categories, filterCategory, setfilterCategory, filterPrice, setfilterPrice, sortBy, setSortBy }) {
  const [openPrice, setOpenPrice] = useState(false);
  const [selectedPrice, setSelectedPrice] = useState<string | null>(filterPrice);
  const [openCategory, setOpenCategory] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(filterCategory);
  const [openSort, setOpenSort] = useState(false);
  const [selectedSort, setSelectedSort] = useState<string | null>(sortBy);
  
  const priceRanges = [
    { label: "Tất cả", value: "" },
    { label: "Dưới 10 triệu", value: "below_10" },
    { label: "Từ 10 - 20 triệu", value: "10_20" },
    { label: "Từ 20 - 30 triệu", value: "20_30" },
    { label: "Trên 30 triệu", value: "above_30" },
  ];

  const categoryOptions = [
    { label: "Tất cả", value: "all" },
    ...categories.map((cat: any) => ({
      label: cat.name,
      value: cat._id,
    })),
  ];

  const sortOptions = [
    { label: "Mới", value: "new_product" },
    { label: "Cũ", value: "old_product" },
    { label: "Giá thấp - cao", value: "price_asc" },
    { label: "Giá cao - thấp", value: "price_desc" },
  ];

  const handlePriceChange = (price_range: any) => {
    setfilterPrice(price_range);
  };

  const handleCategoryChange = (values: string[]) => {
    if (values.includes("all")) {
      setSelectedCategories([])
      setfilterCategory([]); 
    } else {
      setSelectedCategories(values);
      if (JSON.stringify(filterCategory) !== JSON.stringify(values)) {
        setfilterCategory(values);
      }
    }
  };

  const handleSortChange = (value: any) => {
    setSortBy(value);
  };


  return (
    <View style={styles.container}>
      <View style={styles.dropdownWrapper}>
        <DropDownPicker
          open={openPrice}
          value={selectedPrice}
          items={priceRanges}
          setOpen={setOpenPrice}
          setValue={setSelectedPrice}
          onChangeValue={handlePriceChange}
          placeholder="Khoảng giá"
          style={styles.dropdown}
        />
      </View>

      <View style={styles.dropdownWrapper}>
        <DropDownPicker
          multiple={true}
          open={openCategory}
          value={selectedCategories}
          items={categoryOptions}
          setOpen={setOpenCategory}
          setValue={setSelectedCategories}
          onChangeValue={handleCategoryChange}
          placeholder="Danh mục"
          style={styles.dropdown}
        />
      </View>

      <View style={styles.dropdownWrapper}>
        <DropDownPicker
          open={openSort}
          value={selectedSort}
          items={sortOptions}
          setOpen={setOpenSort}
          setValue={setSelectedSort}
          onChangeValue={handleSortChange}
          placeholder="Sắp xếp"
          style={styles.dropdown}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 8,
    gap: 8,
    marginTop: 15,
    marginBottom: 20
  },
  dropdownWrapper: {
    flex: 1, 
    minWidth: 125,
  },
  dropdown: { 
    height: 40,
    borderColor: "grey",
  },
});

export default FilterProduct;
