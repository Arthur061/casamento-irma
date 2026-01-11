import { useState, useEffect } from 'react';
import { supabase } from './services/supabase';
import { ProductCard } from './components/ProductCard';
import { DetailsModal } from './components/DetailsModal';
import { PixModal } from './components/PixModal';
import { Footer } from './components/Footer'; 

// import './styles/global.css'; 

function App() {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [pixProduct, setPixProduct] = useState(null);

  const fetchProducts = async () => {
    const { data } = await supabase.from('presentes').select('*').order('id');
    setProducts(data || []);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleOpenDetails = (product) => {
    setPixProduct(null);
    setSelectedProduct(product);
  };

  const handleSwitchToPix = (product) => {
    setSelectedProduct(null);
    setPixProduct(product);
  };

  return (
    <div style={appStyles.pageBackground}>
      
      {/* CABEÇALHO */}
      <div style={appStyles.headerBanner}>
        <h1 style={appStyles.headerTitle}>Lista de Casamento Leticia & Diogo</h1>
        <p style={appStyles.headerSubtitle}>Sejam bem-vindos à nossa lista de presentes virtual!</p>
      </div>

      <div style={appStyles.container}>
        <div style={appStyles.grid}>
          {products.map(prod => (
            // --- AQUI ESTÁ O TRUQUE PARA FICAR LADO A LADO ---
            // Envolvemos o card numa div de tamanho fixo (300px)
            <div key={prod.id} style={{ width: '300px', flex: '0 0 auto' }}>
              <ProductCard 
                product={prod} 
                onClick={handleOpenDetails} 
              />
            </div>
            // -------------------------------------------------
          ))}
        </div>
      </div>

      <Footer />

      {/* MODAIS */}
      {selectedProduct && (
        <DetailsModal 
          product={selectedProduct} 
          onClose={() => setSelectedProduct(null)} 
          onOpenPix={() => handleSwitchToPix(selectedProduct)} 
        />
      )}

      {pixProduct && (
        <PixModal 
          product={pixProduct}
          onClose={() => setPixProduct(null)}
          onSuccess={() => fetchProducts()}
        />
      )}
    </div>
  );
}

// --- ESTILOS ATUALIZADOS ---
const appStyles = {
  pageBackground: {
    backgroundColor: '#F1F3EB', 
    minHeight: '100vh',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    display: 'flex',
    flexDirection: 'column',
  },
  headerBanner: {
    backgroundColor: '#556B2F',
    color: 'white',
    padding: '25px 20px',
    textAlign: 'center',
    marginBottom: '40px',
    boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
    borderBottom: '4px solid #3b4d1e'
  },
  headerTitle: {
    fontSize: '2.2rem',
    fontWeight: '700',
    margin: '0 0 5px 0',
  },
  headerSubtitle: {
    fontSize: '1.1rem',
    opacity: 0.9,
    margin: 0,
    fontWeight: '300'
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 20px',
    flex: 1,
    width: '100%', // Garante que use a largura toda
  },
  // --- MUDANÇA PRINCIPAL NO GRID ---
  grid: {
    display: 'flex',           // Flexbox: coloca itens lado a lado
    flexWrap: 'wrap',          // Wrap: se faltar espaço, joga pra linha de baixo
    justifyContent: 'center',  // Center: centraliza tudo na tela
    gap: '30px',               // Espaço entre eles
    paddingBottom: '50px',
  }
};

export default App;