import { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { supabase } from './services/supabase'; 
import { ProductCard } from './components/ProductCard';
import { DetailsModal } from './components/DetailsModal';
import { PixModal } from './components/PixModal';
import { Footer } from './components/Footer'; 

function App() {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [pixProduct, setPixProduct] = useState(null);

  const fetchProducts = async () => {
    // Busca dados atualizados do banco
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

  // --- CORREÇÃO PRINCIPAL: Sincronia de Estado ---
  // Isso procura o produto dentro da lista atualizada 'products' usando o ID.
  // Assim, se o banco mudar, o Modal atualiza instantaneamente.
  const activeProduct = selectedProduct 
    ? products.find(p => p.id === selectedProduct.id) || selectedProduct 
    : null;

  // --- FUNÇÃO GERADORA DE RELATÓRIO PDF ---
  const generateAdminPDF = () => {
    const doc = new jsPDF();
    const linhas = [];
    let totalArrecadado = 0;

    products.forEach(prod => {
      if (prod.opcoes) {
        prod.opcoes.forEach(opt => {
          if (opt.reservado) {
            totalArrecadado += Number(opt.preco);
            linhas.push([
              new Date(opt.data_compra || Date.now()).toLocaleDateString('pt-BR'),
              opt.comprado_por || 'Anônimo',
              `${prod.nome} - ${opt.nome} (${opt.tipo_pagamento === 'pix' ? 'PIX' : 'Site'})`,
              Number(opt.preco).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
              opt.mensagem || '-'
            ]);
          }
        });
      }
    });

    doc.setFontSize(18);
    doc.text("Relatório de Presentes - Casamento", 14, 22);
    doc.setFontSize(12);
    doc.text(`Total Confirmado: ${totalArrecadado.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`, 14, 30);

    autoTable(doc, {
      startY: 35,
      head: [['Data', 'Convidado', 'Item', 'Valor', 'Mensagem']],
      body: linhas,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [85, 107, 47] }
    });

    doc.save('relatorio_casamento.pdf');
  };

  return (
    <div style={appStyles.pageBackground}>
      
      {/* CABEÇALHO */}
      <div style={appStyles.headerBanner}>
        <h1 style={appStyles.headerTitle}>Lista de sugestões de presentes</h1>
        <p style={appStyles.headerSubtitle}>Sejam bem-vindos à nossa lista de presentes virtual!</p>
      </div>

      <div style={appStyles.container}>
        <div style={appStyles.grid}>
          {products.map(prod => (
            <div key={prod.id} style={{ width: '300px', flex: '0 0 auto' }}>
              <ProductCard 
                product={prod} 
                onClick={handleOpenDetails} 
              />
            </div>
          ))}
        </div>
      </div>

      <Footer />

      {/* Botão Admin Secreto */}
      <button 
        onClick={generateAdminPDF}
        style={{
          position: 'fixed', bottom: '10px', right: '10px', 
          opacity: 0.3, fontSize: '10px', padding: '5px'
        }}
        title="Gerar Relatório PDF"
      >
        Admin PDF
      </button>

      {/* MODAIS */}
      {/* Aqui usamos activeProduct ao invés de selectedProduct */}
      {activeProduct && (
        <DetailsModal 
          product={activeProduct} 
          onClose={() => setSelectedProduct(null)} 
          onOpenPix={() => handleSwitchToPix(activeProduct)}
          onRefresh={fetchProducts} 
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

const appStyles = {
  pageBackground: {
    backgroundColor: '#F1F3EB', 
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
  },
  headerBanner: {
    backgroundColor: '#556B2F',
    color: 'white',
    padding: '30px 20px',
    textAlign: 'center',
    marginBottom: '40px',
    boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
    borderBottom: '4px solid #3b4d1e'
  },
  headerTitle: {
    fontFamily: "'Great Vibes', cursive",
    fontSize: '3.5rem',
    fontWeight: '400',
    margin: '0 0 10px 0',
    textShadow: '1px 1px 3px rgba(0,0,0,0.2)',
    letterSpacing: '1px'
  },
  headerSubtitle: {
    fontFamily: "'Lato', sans-serif",
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
    width: '100%', 
  },
  grid: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: '30px',
    paddingBottom: '50px',
  }
};

export default App;