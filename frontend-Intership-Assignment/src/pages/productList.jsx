import { useEffect, useState } from "react";
import { fetchProducts } from "../services/productService";
import ProductCard from "../components/ProductCard";
import Loader from "../components/Loader";
import useLocalStorage from "../hooks/useLocalStorage";
import { isRecommended } from "../utils/recommendation";

function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState("");
  const [favorites, setFavorites] = useLocalStorage("favorites", []);

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
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Product Listing</h1>

      {/* CONTROLS */}
      <div className="flex flex-col md:flex-row gap-3 mb-5">
        <input
          type="text"
          placeholder="Search products..."
          className="border p-2"
          onChange={e => setSearch(e.target.value)}
        />

        <select
          className="border p-2"
          onChange={e => setCategory(e.target.value)}
        >
          {categories.map(c => (
            <option key={c}>{c}</option>
          ))}
        </select>

        <select
          className="border p-2"
          onChange={e => setSort(e.target.value)}
        >
          <option value="">Sort by price</option>
          <option value="low">Low → High</option>
          <option value="high">High → Low</option>
        </select>
      </div>

      {/* PRODUCTS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
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
    </div>
  );
}

export default ProductList;
