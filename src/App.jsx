import { useEffect, useState } from 'react';
import { supabase } from './services/supabase';
import { Header } from './components/Header';
import { ProductCard } from './components/ProductCard';
import { DetailsModal } from './components/DetailsModal'; // Novo Import
import './styles/global.css';

function App() {
  const [presentes, setPresentes] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null); // Produto aberto no detalhes

  async function fetchPresentes() {
    const { data } = await supabase.from('presentes').select('*').order('id');
    setPresentes(data || []);
  }

  useEffect(() => { fetchPresentes(); }, []);

  // Abre o Pix (ainda vamos fazer o modal de pix real depois)
  function handleOpenPix(produto) {
    alert(`PIX para: ${produto.nome}. \nImplementaremos o QR Code no próximo passo!`);
  }

  return (
    <div>
      <Header />
      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '30px' }}>
        {presentes.map(item => (
          <ProductCard 
            key={item.id} 
            product={item} 
            onClick={setSelectedProduct} // Ao clicar, define este produto como selecionado
          />
        ))}
      </main>

      {/* Se tiver um produto selecionado, mostra o Modal de Detalhes */}
      {selectedProduct && (
        <DetailsModal 
          product={selectedProduct} 
          onClose={() => setSelectedProduct(null)} // Fecha o modal
          onOpenPix={handleOpenPix}
        />
      )}
    </div>
  );
}

export default App;