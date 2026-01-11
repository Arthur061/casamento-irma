import React from 'react';

export function DetailsModal({ product, onClose, onOpenPix }) {
  if (!product) return null;

  // AJUSTE 1: Cria uma cópia com [...array] antes de ordenar para não alterar o original
  const options = product.opcoes 
    ? [...product.opcoes].sort((a, b) => parseFloat(a.preco) - parseFloat(b.preco)) 
    : [];
  
  // Formata dinheiro
  const formatMoney = (val) => Number(val).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
      backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 1000,
      display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px'
    }} onClick={onClose}>
      
      <div style={{
        backgroundColor: 'white', padding: '30px', borderRadius: '15px',
        maxWidth: '500px', width: '100%', maxHeight: '90vh', overflowY: 'auto',
        position: 'relative', display: 'flex', flexDirection: 'column', gap: '15px'
      }} onClick={e => e.stopPropagation()}>
        
        {/* Botão Fechar */}
        <button onClick={onClose} style={{ 
          position: 'absolute', top: '15px', right: '15px', background: 'transparent', fontSize: '1.5rem', cursor: 'pointer', border: 'none' 
        }}>✖</button>

        {/* Imagem Grande */}
        <img src={product.imagem_url} alt={product.nome} style={{ width: '100%', height: '250px', objectFit: 'contain' }} />

        {/* Título e Descrição */}
        <h2 style={{ color: '#333', margin: 0 }}>{product.nome}</h2>
        <p style={{ color: '#666', lineHeight: '1.6' }}>
          {product.descricao || "Um presente especial para o casal."}
        </p>

        <hr style={{ border: '0', borderTop: '1px solid #eee', width: '100%' }} />

        {/* Lista de Opções de Compra */}
        <h3 style={{ fontSize: '1.1rem', margin: 0 }}>Escolha uma opção para comprar:</h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {options.map((opt, index) => (
            <div key={index} style={{
              border: '1px solid #ddd', borderRadius: '8px', padding: '15px',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              backgroundColor: '#f9f9f9'
            }}>
              <div>
                <strong style={{ display: 'block', color: '#333' }}>{opt.nome}</strong>
                <span style={{ color: '#2ecc71', fontWeight: 'bold', fontSize: '1.1rem' }}>
                  {formatMoney(opt.preco)}
                </span>
              </div>
              <a href={opt.link} target="_blank" rel="noreferrer" style={{
                backgroundColor: '#3498db', color: 'white', padding: '10px 15px',
                borderRadius: '5px', textDecoration: 'none', fontWeight: 'bold', fontSize: '0.9rem'
              }}>
                Comprar
              </a>
            </div>
          ))}
        </div>

        {}
        {/* Botão para abrir o modal de Pix */}
        <button onClick={() => onOpenPix(product)} style={{
          width: '100%', padding: '15px', backgroundColor: '#e74c3c', color: 'white', border: 'none', cursor: 'pointer',
          borderRadius: '8px', fontWeight: 'bold', fontSize: '1rem', marginTop: '10px'
        }}>
          Prefiro enviar o valor via Pix
        </button>

      </div>
    </div>
  );
}