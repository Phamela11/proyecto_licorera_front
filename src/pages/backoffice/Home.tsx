import { Link } from 'react-router-dom';
import { ShoppingCart, Wine, Star, Truck, Shield } from 'lucide-react';

export default function Home() {
  const featuredProducts = [
    {
      id: 1,
      name: "Whisky Premium",
      price: 89.99,
      image: "/api/placeholder/300/300",
      rating: 4.8,
      category: "Whisky"
    },
    {
      id: 2,
      name: "Vino Tinto Reserva",
      price: 24.99,
      image: "/api/placeholder/300/300",
      rating: 4.6,
      category: "Vinos"
    },
    {
      id: 3,
      name: "Cerveza Artesanal",
      price: 3.99,
      image: "/api/placeholder/300/300",
      rating: 4.4,
      category: "Cervezas"
    }
  ];

  const categories = [
    { name: "Vinos", icon: Wine, count: 120 },
    { name: "Whiskies", icon: Wine, count: 85 },
    { name: "Cervezas", icon: Wine, count: 200 },
    { name: "Licores", icon: Wine, count: 150 }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-purple-900 to-indigo-900 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">
            Bienvenido a Nuestra Licorera
          </h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Descubre la mejor selección de vinos, whiskies, cervezas y licores premium
            con entrega rápida y segura a domicilio.
          </p>
          <Link 
            to="/productos" 
            className="bg-white text-purple-900 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center gap-2"
          >
            <ShoppingCart size={20} />
            Explorar Productos
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <Truck className="w-16 h-16 text-purple-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Entrega Rápida</h3>
              <p className="text-gray-600">Recibe tus productos en menos de 2 horas</p>
            </div>
            <div className="text-center">
              <Shield className="w-16 h-16 text-purple-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Productos Auténticos</h3>
              <p className="text-gray-600">Garantizamos la autenticidad de todos nuestros productos</p>
            </div>
            <div className="text-center">
              <Star className="w-16 h-16 text-purple-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Calidad Premium</h3>
              <p className="text-gray-600">Solo las mejores marcas y productos seleccionados</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Nuestras Categorías</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {categories.map((category) => (
              <Link
                key={category.name}
                to={`/categorias/${category.name.toLowerCase()}`}
                className="bg-gray-50 p-6 rounded-lg text-center hover:shadow-lg transition-shadow group"
              >
                <category.icon className="w-12 h-12 text-purple-600 mx-auto mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-xl font-semibold mb-2">{category.name}</h3>
                <p className="text-gray-600">{category.count} productos</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Productos Destacados</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {featuredProducts.map((product) => (
              <div key={product.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-64 object-cover"
                />
                <div className="p-6">
                  <span className="text-sm text-purple-600 font-medium">{product.category}</span>
                  <h3 className="text-xl font-semibold mt-2 mb-2">{product.name}</h3>
                  <div className="flex items-center mb-3">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="ml-1 text-sm text-gray-600">{product.rating}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-purple-600">${product.price}</span>
                    <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors">
                      Agregar al Carrito
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

