import { useEffect, useState } from "react";

// Mock data and services for demo
const mockProducts = [
  { id: 1, title: "Wireless Headphones", category: "electronics", price: 89.99, image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop" },
  { id: 2, title: "Smart Watch", category: "electronics", price: 199.99, image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop" },
  { id: 3, title: "Leather Jacket", category: "clothing", price: 149.99, image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop" },
  { id: 4, title: "Running Shoes", category: "clothing", price: 79.99, image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop" },
  { id: 5, title: "Coffee Maker", category: "home", price: 69.99, image: "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=400&h=400&fit=crop" },
  { id: 6, title: "Desk Lamp", category: "home", price: 39.99, image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400&h=400&fit=crop" },
];

const fetchProducts = () => Promise.resolve(mockProducts);
const isRecommended = (product, avg) => product.price < avg * 0.9;

// Loader Component
const Loader = () => (
  <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
    <div className="relative">
      <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
      <div className="mt-4 text-purple-600 font-semibold">Loading products...</div>
    </div>
  </div>
);

// ProductCard Component
const ProductCard = ({ product, isFavorite, toggleFavorite, recommended }) => (
  <div className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
    {/* Recommended Badge */}
    {recommended && (
      <div className="absolute top-4 left-4 z-10 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg animate-pulse">
        ⭐ Best Deal
      </div>
    )}
    
    {/* Favorite Button */}
    <button
      onClick={() => toggleFavorite(product.id)}
      className="absolute top-4 right-4 z-10 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110"
    >
      <span className={`text-2xl transition-all ${isFavorite ? 'scale-125' : 'scale-100'}`}>
        {isFavorite ? '❤️' : '🤍'}
      </span>
    </button>

    {/* Image */}
    <div className="relative h-64 overflow-hidden bg-gradient-to-br from-purple-100 to-blue-100">
      <img
        src={product.image}
        alt={product.title}
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
    </div>

    {/* Content */}
    <div className="p-6">
      <div className="inline-block px-3 py-1 mb-3 text-xs font-semibold text-purple-600 bg-purple-100 rounded-full">
        {product.category}
      </div>
      
      <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2 group-hover:text-purple-600 transition-colors">
        {product.title}
      </h3>
      
      <div className="flex items-center justify-between mt-4">
        <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
          ${product.price}
        </div>
        <button className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300">
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

  useEffect(() => {
    fetchProducts()
      .then(setProducts)
      .catch(() => setError("Failed to load products"))
      .finally(() => setLoading(false));
  }, []);

  const toggleFavorite = (id) => {
    setFavorites(prev =>
      prev.includes(id)
        ? prev.filter(f => f !== id)
        : [...prev, id]
    );
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

  if (loading) return <Loader />;
  if (error) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-pink-50">
      <div className="text-center">
        <div className="text-6xl mb-4">😕</div>
        <p className="text-red-600 text-xl font-semibold">{error}</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-lg sticky top-0 z-20 backdrop-blur-lg bg-opacity-90">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600">
              🛍️ Premium Store
            </h1>
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-purple-100 rounded-full">
                <span className="text-purple-600 font-semibold">{filteredProducts.length}</span>
                <span className="text-gray-600 text-sm">Products</span>
              </div>
              {favorites.length > 0 && (
                <div className="flex items-center gap-2 px-4 py-2 bg-pink-100 rounded-full">
                  <span className="text-xl">❤️</span>
                  <span className="text-pink-600 font-semibold">{favorites.length}</span>
                </div>
              )}
            </div>
          </div>

          {/* Controls */}
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="🔍 Search amazing products..."
                className="w-full px-6 py-3 pl-12 rounded-2xl border-2 border-purple-200 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200 transition-all"
                onChange={e => setSearch(e.target.value)}
              />
              <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-xl">🔍</span>
            </div>

            <select
              className="px-6 py-3 rounded-2xl border-2 border-purple-200 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200 bg-white font-semibold text-gray-700 cursor-pointer transition-all hover:shadow-md"
              onChange={e => setCategory(e.target.value)}
            >
              {categories.map(c => (
                <option key={c} value={c}>
                  {c === 'all' ? '📦 All Categories' : `${c.charAt(0).toUpperCase() + c.slice(1)}`}
                </option>
              ))}
            </select>

            <select
              className="px-6 py-3 rounded-2xl border-2 border-purple-200 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200 bg-white font-semibold text-gray-700 cursor-pointer transition-all hover:shadow-md"
              onChange={e => setSort(e.target.value)}
            >
              <option value="">💰 Sort by price</option>
              <option value="low">📈 Low → High</option>
              <option value="high">📉 High → Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-8xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-gray-700 mb-2">No products found</h3>
            <p className="text-gray-500">Try adjusting your filters or search term</p>
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
              />
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="bg-white mt-12 py-8 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-gray-600">Made with 💜 for your interview</p>
        </div>
      </div>
    </div>
  );
}

export default ProductList;