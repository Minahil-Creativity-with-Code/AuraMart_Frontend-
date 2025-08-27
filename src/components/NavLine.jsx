import React, { useRef, useEffect, useCallback, useState, useMemo } from 'react';
import { FaSearch, FaFacebookF, FaInstagram, FaPinterest, FaRegUserCircle } from "react-icons/fa";
import { IoMail } from "react-icons/io5";
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const NavLine = () => {
  const inputRef = useRef(null);
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  // ✅ useMemo so this object is stable and won't recreate every render
  const searchToCategoryMapping = useMemo(() => ({
    'summer': 'summer',
    'summer collection': 'summer',
    'summer lawn': 'summer',
    'winter': 'winter',
    'winter collection': 'winter',
    'winter lawn': 'winter',
    'lawn': 'lawn',
    'embroidered lawn': 'embroidered-lawn',
    'embroidered': 'embroidered-lawn',
    'linen': 'linen',
    'silk': 'silk',
    'organza': 'organza',
    'gents': 'gents',
    'gents collection': 'gents',
    'party': 'party',
    'party wear': 'party',
    'home decor': 'home-decor',
    'home': 'home-decor',
    'bedding': 'bedding',
    'clothing': 'clothing',
    'clutch bag': 'clutch-bag',
    'clutch': 'clutch-bag',
    'mattress covers': 'mattress-covers',
    'mattress': 'mattress-covers',
    'sofa covers': 'sofa-covers',
    'sofa': 'sofa-covers',
    'washing machine covers': 'washing-machine-covers',
    'washing machine': 'washing-machine-covers',
    'featured': 'featured',
    'featured products': 'featured'
  }), []); // empty deps → stays constant

  const handleSearch = useCallback(async () => {
    const value = inputRef.current.value.trim();
    if (!value) return;

    const lowerValue = value.toLowerCase();
    const categorySlug = searchToCategoryMapping[lowerValue];
    
    if (categorySlug) {
      navigate(`/category/${categorySlug}`);
      setSearchValue('');
      setShowSuggestions(false);
      inputRef.current.value = '';
      return;
    }

    try {
      const catRes = await axios.get(`http://localhost:5000/api/products/search/category/${value}`);
      if (catRes.data && catRes.data.length > 0) {
        navigate(`/category/${value.toLowerCase().replace(/\s+/g, '-')}`);
        setSearchValue('');
        setShowSuggestions(false);
        inputRef.current.value = '';
        return;
      }
    } catch {
      // Category not found → continue to product search
    }

    try {
      const prodRes = await axios.get(`http://localhost:5000/api/products/search/name/${value}`);
      if (prodRes.data && prodRes.data.length > 0) {
        navigate(`/product/${prodRes.data[0]._id}`);
        setSearchValue('');
        setShowSuggestions(false);
        inputRef.current.value = '';
        return;
      }
    } catch {
      // Product not found → continue
    }

    toast.error(`No products or categories found for "${value}"`);
  }, [navigate, searchToCategoryMapping]); // ✅ now stable

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'Enter') handleSearch();
    };
    const input = inputRef.current;
    if (input) input.addEventListener('keypress', handleKeyPress);
    return () => input?.removeEventListener('keypress', handleKeyPress);
  }, [handleSearch]);

  const getSearchSuggestions = (value) => {
    if (!value) return [];
    const lowerValue = value.toLowerCase();
    return Object.keys(searchToCategoryMapping).filter(term => 
      term.includes(lowerValue)
    ).slice(0, 5);
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchValue(value);
    setShowSuggestions(value.length > 0);
  };

  const handleSuggestionClick = (suggestion) => {
    const categorySlug = searchToCategoryMapping[suggestion];
    if (categorySlug) {
      navigate(`/category/${categorySlug}`);
      setSearchValue('');
      setShowSuggestions(false);
      inputRef.current.value = '';
    }
  };

  return (
    <div className='navline'>
      <div className='search search-container'>
        <input
          ref={inputRef}
          name='search'
          type='text'
          placeholder='Search categories, products...'
          value={searchValue}
          onChange={handleInputChange}
          onFocus={() => setShowSuggestions(searchValue.length > 0)}
        />
        <FaSearch onClick={handleSearch} className="search-icon" />
        
        {/* Search Suggestions */}
        {showSuggestions && (
          <div className="search-suggestions">
            {getSearchSuggestions(searchValue).map((suggestion, index) => (
              <div
                key={index}
                className="suggestion-item"
                onClick={() => handleSuggestionClick(suggestion)}
                style={{ cursor: 'pointer' }}
              >
                {suggestion}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Social Icons */}
      <div className='Sicons'>
        <span>
          <a href="https://www.auramart.com/" target="_blank" rel="noopener noreferrer"><FaFacebookF /></a>
          <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer"><FaInstagram /></a>
          <a href="mailto:minahil@purelogics.net" target="_blank" rel="noopener noreferrer"><IoMail /></a>
          <a href="https://www.pinterest.com/" target="_blank" rel="noopener noreferrer"><FaPinterest /></a>
        </span>
      </div>

      {/* User Section */}
      <div className='user-section'>
        {user ? (
          <Link to='/user-profile' className='logout-link'>
            <div className='user-info' style={{ textAlign: 'center' }}>
              <span
                className='username-icon'
                style={{ cursor: 'pointer', fontSize: '25px', margin: '40px 0px' }}
                title="View Profile"
              >
                <FaRegUserCircle />
              </span>
              <div
                className='username-text'
                style={{ fontSize: '12px', marginTop: '4px' }}
              >
                {user.name || user.username || "User"}
              </div>
            </div>
          </Link>
        ) : (
          <Link to="/login" className='login login-route'>Login</Link>
        )}
      </div>
    </div>
  );
};

export default NavLine;
