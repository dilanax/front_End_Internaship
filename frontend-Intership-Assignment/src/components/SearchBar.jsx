const [search, setSearch] = useState("");

const filteredProducts = products.filter(p =>
  p.title.toLowerCase().includes(search.toLowerCase())
);
