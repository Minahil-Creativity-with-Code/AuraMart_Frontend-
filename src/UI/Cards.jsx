import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { FaShoppingCart } from "react-icons/fa";
import { IoIosArrowDown } from "react-icons/io"; // ✅ Added missing import
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";


const Card = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/products/search/category/Featured"
        );
        setProducts(res.data);
      } catch (err) {
        console.error("❌ Failed to fetch featured products:", err);
      }
    };

    fetchFeatured();
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
      <h2>
        <IoIosArrowDown /> Shop Featured Products 2025</h2>

      <Swiper
        slidesPerView={4}
        spaceBetween={30}
        navigation={true}
        autoplay={{ delay: 3000 }}
        modules={[Navigation, Autoplay]} // ✅ Properly included all required modules
        className="product-list"
        breakpoints={{
          320: { slidesPerView: 1 },
          480: { slidesPerView: 2 },
          768: { slidesPerView: 3 },
          1024: { slidesPerView: 4 },
        }}
      >
        {products.map((product) => (
          <SwiperSlide key={product._id}>
            <Link to={`/product/${product._id}`} className="product-card-link login-route">
              <div className="product-card">
                <img
                  src={`http://localhost:5000/images/${product.image}`}
                  alt={product.name}
                  className="product-image"
                />
                <h3 className="product-brand">  {product.attributes?.brand}</h3>
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

      <div className="section1">
        <img src="/section1.jpg" alt="section-img" />
      </div>
    </div>
  );
};

export default Card;
