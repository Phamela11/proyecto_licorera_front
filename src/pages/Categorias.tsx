import { useParams, Link } from 'react-router-dom';
import { Wine, Grape, Beer, Martini, ArrowLeft } from 'lucide-react';

export default function Categorias() {
  const { categoria } = useParams<{ categoria: string }>();

  const categoryInfo = {
    vinos: {
      name: 'Vinos',
      icon: Wine,
      description: 'Descubre nuestra selección de vinos tintos, blancos, rosados y espumosos de las mejores bodegas del mundo.',
      subcategories: ['Tintos', 'Blancos', 'Rosados', 'Espumosos', 'Dulces'],
      products: [
        {
          id: 1,
          name: 'Cabernet Sauvignon Reserva',
          price: 34.99,
          image: '/api/placeholder/300/300',
          origin: 'Chile',
          year: 2020
        },
        {
          id: 2,
          name: 'Chardonnay Premium',
          price: 28.99,
          image: '/api/placeholder/300/300',
          origin: 'Francia',
          year: 2021
        },
        {
          id: 3,
          name: 'Malbec Argentino',
          price: 26.99,
          image: '/api/placeholder/300/300',
          origin: 'Argentina',
          year: 2019
        }
      ]
    },
    whiskies: {
      name: 'Whiskies',
      icon: Martini,
      description: 'Explora nuestra colección de whiskies escoceses, irlandeses, americanos y japoneses de las destilerías más prestigiosas.',
      subcategories: ['Escocés', 'Irlandés', 'Americano', 'Japonés', 'Canadiense'],
      products: [
        {
          id: 4,
          name: "Jack Daniel's Old No. 7",
          price: 89.99,
          image: '/api/placeholder/300/300',
          origin: 'Estados Unidos',
          age: '4 años'
        },
        {
          id: 5,
          name: 'Johnnie Walker Black Label',
          price: 95.99,
          image: '/api/placeholder/300/300',
          origin: 'Escocia',
          age: '12 años'
        },
        {
          id: 6,
          name: 'Jameson Irish Whiskey',
          price: 78.99,
          image: '/api/placeholder/300/300',
          origin: 'Irlanda',
          age: '5 años'
        }
      ]
    },
    cervezas: {
      name: 'Cervezas',
      icon: Beer,
      description: 'Refréscate con nuestra amplia variedad de cervezas nacionales, importadas y artesanales.',
      subcategories: ['Lager', 'IPA', 'Stout', 'Wheat', 'Artesanales'],
      products: [
        {
          id: 7,
          name: 'Corona Extra',
          price: 3.99,
          image: '/api/placeholder/300/300',
          origin: 'México',
          alcohol: '4.5%'
        },
        {
          id: 8,
          name: 'Heineken',
          price: 4.49,
          image: '/api/placeholder/300/300',
          origin: 'Holanda',
          alcohol: '5.0%'
        },
        {
          id: 9,
          name: 'Stella Artois',
          price: 4.99,
          image: '/api/placeholder/300/300',
          origin: 'Bélgica',
          alcohol: '5.2%'
        }
      ]
    },
    licores: {
      name: 'Licores',
      icon: Grape,
      description: 'Disfruta de nuestra selección de licores premium, cremas y digestivos para cada ocasión.',
      subcategories: ['Cremas', 'Digestivos', 'Aperitivos', 'Licores de Fruta', 'Amargos'],
      products: [
        {
          id: 10,
          name: "Bailey's Irish Cream",
          price: 28.99,
          image: '/api/placeholder/300/300',
          origin: 'Irlanda',
          alcohol: '17%'
        },
        {
          id: 11,
          name: 'Kahlúa Coffee Liqueur',
          price: 24.99,
          image: '/api/placeholder/300/300',
          origin: 'México',
          alcohol: '20%'
        },
        {
          id: 12,
          name: 'Grand Marnier',
          price: 45.99,
          image: '/api/placeholder/300/300',
          origin: 'Francia',
          alcohol: '40%'
        }
      ]
    }
  };

  const currentCategory = categoria ? categoryInfo[categoria as keyof typeof categoryInfo] : null;

  if (!currentCategory) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Categoría no encontrada</h1>
          <p className="text-gray-600 mb-6">La categoría que buscas no existe.</p>
          <Link 
            to="/productos" 
            className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
          >
            Ver Todos los Productos
          </Link>
        </div>
      </div>
    );
  }

  const CategoryIcon = currentCategory.icon;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-6">
          <Link to="/productos" className="text-purple-600 hover:text-purple-800 flex items-center gap-1">
            <ArrowLeft size={16} />
            Productos
          </Link>
          <span className="text-gray-500">/</span>
          <span className="text-gray-800">{currentCategory.name}</span>
        </div>

        {/* Category Header */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <div className="flex items-center gap-4 mb-4">
            <CategoryIcon className="w-12 h-12 text-purple-600" />
            <h1 className="text-4xl font-bold text-gray-800">{currentCategory.name}</h1>
          </div>
          <p className="text-gray-600 text-lg mb-6">{currentCategory.description}</p>
          
          {/* Subcategories */}
          <div className="flex flex-wrap gap-3">
            {currentCategory.subcategories.map((sub) => (
              <span 
                key={sub}
                className="bg-purple-100 text-purple-800 px-4 py-2 rounded-full text-sm font-medium hover:bg-purple-200 cursor-pointer transition-colors"
              >
                {sub}
              </span>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
          {currentCategory.products.map((product) => (
            <div key={product.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <img 
                src={product.image} 
                alt={product.name}
                className="w-full h-64 object-cover"
              />
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
                
                <div className="space-y-1 mb-4 text-sm text-gray-600">
                  <p><span className="font-medium">Origen:</span> {product.origin}</p>
                  {'year' in product && (
                    <p><span className="font-medium">Año:</span> {product.year}</p>
                  )}
                  {'age' in product && (
                    <p><span className="font-medium">Añejamiento:</span> {product.age}</p>
                  )}
                  {'alcohol' in product && (
                    <p><span className="font-medium">Alcohol:</span> {product.alcohol}</p>
                  )}
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

        {/* All Categories Link */}
        <div className="mt-12 text-center">
          <h2 className="text-2xl font-bold mb-6">Explorar Otras Categorías</h2>
          <div className="grid md:grid-cols-4 gap-4">
            {Object.entries(categoryInfo).map(([key, info]) => {
              if (key === categoria) return null;
              const Icon = info.icon;
              return (
                <Link
                  key={key}
                  to={`/categorias/${key}`}
                  className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow text-center group"
                >
                  <Icon className="w-8 h-8 text-purple-600 mx-auto mb-3 group-hover:scale-110 transition-transform" />
                  <h3 className="font-semibold">{info.name}</h3>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

