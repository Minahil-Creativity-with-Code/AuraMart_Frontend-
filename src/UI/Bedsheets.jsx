import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { IoIosArrowDown } from "react-icons/io";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const Bedsheets = () => {
  const [bedsheetProducts, setBedsheetProducts] = useState([]);

  useEffect(() => {
    const fetchBedsheets = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/products/search/category/Bedding");
        setBedsheetProducts(res.data);
      } catch (err) {
        console.error("❌ Failed to fetch bedsheet products:", err);
      }
    };

    fetchBedsheets();
  }, []);

  // helper: min–max price range
  const getPriceRange = (prices) => {
    if (!prices) return null;
    const values = Object.values(prices).filter((p) => p != null && !isNaN(p));
    if (values.length === 0) return null;

    const min = Math.min(...values);
    const max = Math.max(...values);

    return min === max ? `Rs ${min} PKR` : `Rs ${min} – ${max} PKR`;
  };

  return (
    <div className="card2">
      <h2><IoIosArrowDown /> Luxury BedSheets Collection 2025</h2>

      <Swiper
        slidesPerView={4}
        spaceBetween={30}
        navigation={true}
        autoplay={{ delay: 3000 }}
        modules={[Navigation, Autoplay]}
        className="product-list"
        breakpoints={{
          320: { slidesPerView: 1 },
          480: { slidesPerView: 2 },
          768: { slidesPerView: 3 },
          1024: { slidesPerView: 4 },
        }}
      >
        {bedsheetProducts.map((product) => (
          <SwiperSlide key={product._id}>
            <Link to={`/product/${product._id}`} className="product-card-link login-route">
              <div className="product-card">
                <img
                  src={`http://localhost:5000/images/${product.image}`}
                  alt={product.name}
                  className="product-image"
                />
                <h3 className="product-brand">{product.brand}</h3>
                <p className="product-name">{product.name}</p>
                <div className="product-prices">
                  {getPriceRange(product.prices) ? (
                    <span className="price-range">
                      {getPriceRange(product.prices)}
                    </span>
                  ) : (
                    <span className="price-range">Price not available</span>
                  )}
                </div>
              </div>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
      <br /> 
    </div>
  );
};

export default Bedsheets;
