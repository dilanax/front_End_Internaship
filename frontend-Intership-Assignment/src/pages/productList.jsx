import { useEffect, useState } from "react";

// API Service
const fetchProducts = async () => {
  const response = await fetch('https://fakestoreapi.com/products');
  if (!response.ok) throw new Error('Failed to fetch products');
  return response.json();
};

// Utility functions
const isRecommended = (product, avgPrice) => {
  return product.rating.rate > 4 || product.price < avgPrice;
};

const saveFavoritesToStorage = (favorites) => {
  localStorage.setItem('favorites', JSON.stringify(favorites));
};

const loadFavoritesFromStorage = () => {
  const stored = localStorage.getItem('favorites');
  return stored ? JSON.parse(stored) : [];
};

// Loader Component
const Loader = ({ darkMode }) => (
  <div className={`flex items-center justify-center min-h-screen ${darkMode ? 'bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900' : 'bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50'}`}>
    <div className="relative">
      <div className={`w-16 h-16 border-4 ${darkMode ? 'border-purple-400 border-t-purple-600' : 'border-purple-200 border-t-purple-600'} rounded-full animate-spin`}></div>
      <div className={`mt-4 ${darkMode ? 'text-purple-400' : 'text-purple-600'} font-semibold`}>Loading products...</div>
    </div>
  </div>
);

// ProductCard Component
const ProductCard = ({ product, isFavorite, toggleFavorite, recommended, darkMode }) => (
  <div className={`group relative ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2`}>
    {recommended && (
      <div className="absolute top-4 left-4 z-10 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg animate-pulse">
        ⭐ Recommended
      </div>
    )}
    
    <button
      onClick={() => toggleFavorite(product.id)}
      className={`absolute top-4 right-4 z-10 w-10 h-10 ${darkMode ? 'bg-gray-700' : 'bg-white'} rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110`}
    >
      <span className={`text-2xl transition-all ${isFavorite ? 'scale-125' : 'scale-100'}`}>
        {isFavorite ? '❤️' : '🤍'}
      </span>
    </button>

    <div className={`relative h-64 overflow-hidden ${darkMode ? 'bg-gray-700' : 'bg-gradient-to-br from-purple-100 to-blue-100'}`}>
      <img
        src={product.image}
        alt={product.title}
        className="w-full h-full object-contain p-4 transition-transform duration-700 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
    </div>

    <div className="p-6">
      <div className={`inline-block px-3 py-1 mb-3 text-xs font-semibold ${darkMode ? 'text-purple-300 bg-purple-900' : 'text-purple-600 bg-purple-100'} rounded-full`}>
        {product.category}
      </div>
      
      <h3 className={`text-lg font-bold ${darkMode ? 'text-gray-100' : 'text-gray-800'} mb-2 line-clamp-2 group-hover:text-purple-600 transition-colors min-h-[3.5rem]`}>
        {product.title}
      </h3>
      
      <div className="flex items-center gap-1 mb-3">
        <span className="text-yellow-400">⭐</span>
        <span className={`text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
          {product.rating.rate}
        </span>
        <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          ({product.rating.count} reviews)
        </span>
      </div>
      
      <div className="flex items-center justify-between mt-4">
        <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
          ${product.price}
        </div>
        <button className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300 text-sm">
          Add to Cart
        </button>
      </div>
    </div>
  </div>
);

function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState("");
  const [favorites, setFavorites] = useState([]);
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    fetchProducts()
      .then(setProducts)
      .catch(() => setError("Failed to load products"))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    setFavorites(loadFavoritesFromStorage());
  }, []);

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  const toggleFavorite = (id) => {
    setFavorites(prev => {
      const newFavorites = prev.includes(id)
        ? prev.filter(f => f !== id)
        : [...prev, id];
      saveFavoritesToStorage(newFavorites);
      return newFavorites;
    });
  };

  const toggleDarkMode = () => {
    setDarkMode(prev => !prev);
  };

  const categories = ["all", ...new Set(products.map(p => p.category))];

  const averagePrice =
    products.reduce((sum, p) => sum + p.price, 0) / products.length || 0;

  let filteredProducts = products
    .filter(p =>
      p.title.toLowerCase().includes(search.toLowerCase())
    )
    .filter(p => category === "all" || p.category === category);

  if (sort === "low") {
    filteredProducts.sort((a, b) => a.price - b.price);
  } else if (sort === "high") {
    filteredProducts.sort((a, b) => b.price - a.price);
  }

  if (loading) return <Loader darkMode={darkMode} />;
  if (error) return (
    <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'bg-gradient-to-br from-gray-900 to-red-900' : 'bg-gradient-to-br from-red-50 to-pink-50'}`}>
      <div className="text-center">
        <div className="text-6xl mb-4">😕</div>
        <p className={`${darkMode ? 'text-red-400' : 'text-red-600'} text-xl font-semibold`}>{error}</p>
      </div>
    </div>
  );

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900' : 'bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50'} transition-colors duration-300`}>
      <div className={`${darkMode ? 'bg-gray-800 bg-opacity-95' : 'bg-white bg-opacity-90'} shadow-lg sticky top-0 z-20 backdrop-blur-lg transition-colors duration-300`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className={`text-4xl font-bold ${darkMode ? 'text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400' : 'text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600'}`}>
              🛍️ Premium Store
            </h1>
            <div className="flex items-center gap-4">
              <button
                onClick={toggleDarkMode}
                className={`p-3 rounded-full ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-purple-100 hover:bg-purple-200'} transition-all duration-300 transform hover:scale-110`}
                title="Toggle dark mode"
              >
                <span className="text-2xl">{darkMode ? '☀️' : '🌙'}</span>
              </button>
              <div className={`hidden md:flex items-center gap-2 px-4 py-2 ${darkMode ? 'bg-purple-900' : 'bg-purple-100'} rounded-full`}>
                <span className={`${darkMode ? 'text-purple-300' : 'text-purple-600'} font-semibold`}>{filteredProducts.length}</span>
                <span className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} text-sm`}>Products</span>
              </div>
              {favorites.length > 0 && (
                <div className={`flex items-center gap-2 px-4 py-2 ${darkMode ? 'bg-pink-900' : 'bg-pink-100'} rounded-full`}>
                  <span className="text-xl">❤️</span>
                  <span className={`${darkMode ? 'text-pink-300' : 'text-pink-600'} font-semibold`}>{favorites.length}</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="🔍 Search amazing products..."
                className={`w-full px-6 py-3 pl-12 rounded-2xl border-2 ${darkMode ? 'bg-gray-700 border-purple-500 text-gray-100 placeholder-gray-400' : 'bg-white border-purple-200 text-gray-900'} focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200 transition-all`}
                onChange={e => setSearch(e.target.value)}
                value={search}
              />
              <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-xl">🔍</span>
            </div>

            <select
              className={`px-6 py-3 rounded-2xl border-2 ${darkMode ? 'bg-gray-700 border-purple-500 text-gray-100' : 'bg-white border-purple-200 text-gray-700'} focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200 font-semibold cursor-pointer transition-all hover:shadow-md`}
              onChange={e => setCategory(e.target.value)}
              value={category}
            >
              {categories.map(c => (
                <option key={c} value={c}>
                  {c === 'all' ? '📦 All Categories' : `${c.charAt(0).toUpperCase() + c.slice(1)}`}
                </option>
              ))}
            </select>

            <select
              className={`px-6 py-3 rounded-2xl border-2 ${darkMode ? 'bg-gray-700 border-purple-500 text-gray-100' : 'bg-white border-purple-200 text-gray-700'} focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200 font-semibold cursor-pointer transition-all hover:shadow-md`}
              onChange={e => setSort(e.target.value)}
              value={sort}
            >
              <option value="">💰 Sort by price</option>
              <option value="low">📈 Low → High</option>
              <option value="high">📉 High → Low</option>
            </select>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-8xl mb-4">🔍</div>
            <h3 className={`text-2xl font-bold ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>No products found</h3>
            <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Try adjusting your filters or search term</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                isFavorite={favorites.includes(product.id)}
                toggleFavorite={toggleFavorite}
                recommended={isRecommended(product, averagePrice)}
                darkMode={darkMode}
              />
            ))}
          </div>
        )}
      </div>

      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} mt-12 py-8 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'} transition-colors duration-300`}>
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Built with React + Vite + Tailwind CSS
          </p>
        </div>
      </div>
    </div>
  );
}

export default ProductList;