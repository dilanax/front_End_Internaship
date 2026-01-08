function ProductCard({ product, isFavorite, toggleFavorite, recommended }) {
  return (
    <div className="border rounded-lg p-4 shadow hover:shadow-lg transition">
      <img
        src={product.image}
        alt={product.title}
        className="h-40 mx-auto object-contain"
      />

      <h2 className="font-semibold mt-2 text-sm">
        {product.title}
      </h2>

      <p className="text-gray-500 text-xs">{product.category}</p>

      <p className="font-bold mt-1">${product.price}</p>

      <p className="text-sm">⭐ {product.rating.rate}</p>

      {recommended && (
        <span className="inline-block text-green-600 text-xs mt-1">
          Recommended
        </span>
      )}

      <button
        onClick={() => toggleFavorite(product.id)}
        className="block mt-3 text-sm text-blue-600"
      >
        {isFavorite ? "Remove Favorite" : "Add Favorite"}
      </button>
    </div>
  );
}

export default ProductCard;
