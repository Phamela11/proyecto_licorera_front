import { useState } from 'react';
import { Search, Filter, Grid, List, Star, ShoppingCart } from 'lucide-react';

export default function Productos() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('todos');
  const [sortBy, setSortBy] = useState('nombre');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const categories = [
    { id: 'todos', name: 'Todos los Productos' },
    { id: 'vinos', name: 'Vinos' },
    { id: 'whiskies', name: 'Whiskies' },
    { id: 'cervezas', name: 'Cervezas' },
    { id: 'licores', name: 'Licores' },
    { id: 'vodkas', name: 'Vodkas' },
    { id: 'rones', name: 'Rones' }
  ];

  const products = [
    {
      id: 1,
      name: "Whisky Jack Daniel's",
      price: 89.99,
      originalPrice: 99.99,
      image: "/api/placeholder/300/300",
      rating: 4.8,
      reviews: 124,
      category: "whiskies",
      description: "Whisky americano premium con sabor suave y ahumado",
      inStock: true,
      discount: 10
    },
    {
      id: 2,
      name: "Vino Tinto Cabernet Sauvignon",
      price: 24.99,
      image: "/api/placeholder/300/300",
      rating: 4.6,
      reviews: 89,
      category: "vinos",
      description: "Vino tinto de cuerpo completo con notas de frutas rojas",
      inStock: true
    },
    {
      id: 3,
      name: "Cerveza Corona Extra",
      price: 3.99,
      image: "/api/placeholder/300/300",
      rating: 4.4,
      reviews: 256,
      category: "cervezas",
      description: "Cerveza mexicana ligera y refrescante",
      inStock: true
    },
    {
      id: 4,
      name: "Vodka Absolut",
      price: 45.99,
      image: "/api/placeholder/300/300",
      rating: 4.7,
      reviews: 178,
      category: "vodkas",
      description: "Vodka premium sueco con destilación continua",
      inStock: false
    },
    {
      id: 5,
      name: "Ron Bacardí Añejo",
      price: 32.99,
      image: "/api/placeholder/300/300",
      rating: 4.5,
      reviews: 95,
      category: "rones",
      description: "Ron añejado con sabor rico y complejo",
      inStock: true
    },
    {
      id: 6,
      name: "Licor Bailey's Irish Cream",
      price: 28.99,
      image: "/api/placeholder/300/300",
      rating: 4.3,
      reviews: 143,
      category: "licores",
      description: "Crema irlandesa con sabor a whisky y vainilla",
      inStock: true
    }
  ];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'todos' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'precio-asc':
        return a.price - b.price;
      case 'precio-desc':
        return b.price - a.price;
      case 'rating':
        return b.rating - a.rating;
      default:
        return a.name.localeCompare(b.name);
    }
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Nuestros Productos</h1>
        
        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar productos..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Category Filter */}
            <select
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>

            {/* Sort */}
            <select
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="nombre">Ordenar por Nombre</option>
              <option value="precio-asc">Precio: Menor a Mayor</option>
              <option value="precio-desc">Precio: Mayor a Menor</option>
              <option value="rating">Mejor Valorados</option>
            </select>

            {/* View Mode */}
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-600'}`}
              >
                <Grid size={20} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-600'}`}
              >
                <List size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Mostrando {sortedProducts.length} de {products.length} productos
          </p>
        </div>

        {/* Products Grid */}
        <div className={`grid gap-6 ${viewMode === 'grid' ? 'md:grid-cols-3 lg:grid-cols-4' : 'grid-cols-1'}`}>
          {sortedProducts.map((product) => (
            <div key={product.id} className={`bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow ${viewMode === 'list' ? 'flex' : ''}`}>
              <div className={`${viewMode === 'list' ? 'w-48 flex-shrink-0' : ''}`}>
                <img 
                  src={product.image} 
                  alt={product.name}
                  className={`w-full object-cover ${viewMode === 'list' ? 'h-48' : 'h-64'}`}
                />
                {product.discount && (
                  <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-lg text-sm font-bold">
                    -{product.discount}%
                  </div>
                )}
              </div>
              
              <div className={`p-6 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold">{product.name}</h3>
                  {!product.inStock && (
                    <span className="text-red-500 text-sm font-medium">Agotado</span>
                  )}
                </div>
                
                <p className="text-gray-600 text-sm mb-3">{product.description}</p>
                
                <div className="flex items-center mb-3">
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="ml-1 text-sm text-gray-600">
                      {product.rating} ({product.reviews} reseñas)
                    </span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex flex-col">
                    <span className="text-2xl font-bold text-purple-600">
                      ${product.price}
                    </span>
                    {product.originalPrice && (
                      <span className="text-sm text-gray-500 line-through">
                        ${product.originalPrice}
                      </span>
                    )}
                  </div>
                  
                  <button 
                    className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                      product.inStock 
                        ? 'bg-purple-600 text-white hover:bg-purple-700' 
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                    disabled={!product.inStock}
                  >
                    <ShoppingCart size={16} />
                    {product.inStock ? 'Agregar' : 'Agotado'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {sortedProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No se encontraron productos con los filtros seleccionados.</p>
          </div>
        )}
      </div>
    </div>
  );
}

