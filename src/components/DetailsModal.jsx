import React, { useState } from 'react';
import { supabase } from '../services/supabase'; 

export function DetailsModal({ product, onClose, onOpenPix, onRefresh }) {
  if (!product) return null;

  // Estados para o formulário de confirmação
  const [buyingOption, setBuyingOption] = useState(null); 
  const [buyerName, setBuyerName] = useState('');
  const [buyerMessage, setBuyerMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // Ordena as opções 
  const options = product.opcoes 
    ? [...product.opcoes].sort((a, b) => parseFloat(a.preco) - parseFloat(b.preco)) 
    : [];
  
  const formatMoney = (val) => Number(val).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  // Função chamada ao clicar em "Comprar" (Link Externo)
  const handleClickBuy = (opt) => {
    window.open(opt.link, '_blank');
    setBuyingOption(opt);
  };

  // Função que salva a compra no Supabase
  const handleConfirmPurchase = async () => {
    if (!buyerName.trim()) {
      alert("Por favor, digite seu nome para os noivos saberem quem deu o presente! 😊");
      return;
    }

    setLoading(true);

    try {
      // CORREÇÃO: Comparação rigorosa para evitar marcar todos como vendidos
      const updatedOptions = product.opcoes.map(opt => {
        // Remove espaços em branco antes e depois para comparar
        const nomeBanco = opt.nome ? opt.nome.trim() : "";
        const linkBanco = opt.link ? opt.link.trim() : "";
        const nomeAlvo = buyingOption.nome ? buyingOption.nome.trim() : "";
        const linkAlvo = buyingOption.link ? buyingOption.link.trim() : "";

        // Só atualiza se Nome E Link forem iguais
        if (nomeBanco === nomeAlvo && linkBanco === linkAlvo) {
          return {
            ...opt,
            reservado: true,
            comprado_por: buyerName,
            mensagem: buyerMessage,
            data_compra: new Date().toISOString(),
            tipo_pagamento: 'link_externo'
          };
        }
        return opt;
      });

      // Atualiza no Banco
      const { error } = await supabase
        .from('presentes')
        .update({ opcoes: updatedOptions })
        .eq('id', product.id);

      if (error) throw error;

      alert("Compra confirmada com sucesso! Muito obrigado! ❤️");
      
      setBuyingOption(null);
      setBuyerName('');
      setBuyerMessage('');
      
      // Recarrega os dados na tela principal
      if (onRefresh) await onRefresh();
      
      // OBS: Comentei o onClose() para que você veja a mudança visual (botão ficando cinza)
      // Se preferir fechar o modal logo após o alert, descomente a linha abaixo:
      // onClose(); 

    } catch (error) {
      console.error("Erro ao confirmar:", error);
      alert("Erro ao salvar a confirmação. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

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
        
        <button onClick={onClose} style={{ 
          position: 'absolute', top: '15px', right: '15px', background: 'transparent', fontSize: '1.5rem', cursor: 'pointer', border: 'none' 
        }}>✖</button>

        <img src={product.imagem_url} alt={product.nome} style={{ width: '100%', height: '250px', objectFit: 'contain' }} />

        <h2 style={{ color: '#333', margin: 0 }}>{product.nome}</h2>
        <p style={{ color: '#666', lineHeight: '1.6' }}>
          {product.descricao || "Um presente especial para o casal."}
        </p>

        <hr style={{ border: '0', borderTop: '1px solid #eee', width: '100%' }} />

        <h3 style={{ fontSize: '1.1rem', margin: 0 }}>Opções disponíveis:</h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {options.map((opt, index) => {
            // Verifica se este item específico já foi comprado
            const isReservado = opt.reservado === true;
            
            // Verifica se este é o item que o usuário está tentando confirmar agora
            // Usa a mesma lógica de segurança do .trim()
            const isConfirmingThis = buyingOption && 
                                     buyingOption.nome.trim() === opt.nome.trim() &&
                                     buyingOption.link.trim() === opt.link.trim();

            return (
              <div key={index} style={{
                border: isConfirmingThis ? '2px solid #556B2F' : '1px solid #ddd',
                borderRadius: '8px', padding: '15px',
                backgroundColor: isReservado ? '#f0f0f0' : '#f9f9f9',
                opacity: (isReservado && !isConfirmingThis) ? 0.6 : 1
              }}>
                
                {/* CABEÇALHO DO CARD DA OPÇÃO */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: isConfirmingThis ? '10px' : '0' }}>
                  <div>
                    <strong style={{ display: 'block', color: '#333' }}>{opt.nome}</strong>
                    <span style={{ color: isReservado ? '#999' : '#2ecc71', fontWeight: 'bold', fontSize: '1.1rem' }}>
                      {formatMoney(opt.preco)}
                    </span>
                  </div>

                  {isReservado ? (
                    <span style={{ backgroundColor: '#ccc', color: '#666', padding: '5px 10px', borderRadius: '5px', fontSize: '0.8rem', fontWeight: 'bold' }}>
                      RESERVADO
                    </span>
                  ) : (
                    !isConfirmingThis && (
                      <button 
                        onClick={() => handleClickBuy(opt)}
                        style={{
                          backgroundColor: '#3498db', color: 'white', padding: '10px 15px',
                          borderRadius: '5px', textDecoration: 'none', fontWeight: 'bold', fontSize: '0.9rem', border: 'none', cursor: 'pointer'
                        }}>
                        Comprar
                      </button>
                    )
                  )}
                </div>

                {/* AREA DE CONFIRMAÇÃO (Só aparece se clicou em Comprar neste item) */}
                {isConfirmingThis && (
                  <div style={{ marginTop: '10px', borderTop: '1px dashed #ccc', paddingTop: '10px' }}>
                    <p style={{ fontSize: '0.9rem', color: '#556B2F', fontWeight: 'bold' }}>
                      Você acessou a loja? Se confirmou a compra, preencha abaixo para reservar este item:
                    </p>
                    
                    <input 
                      type="text" 
                      placeholder="Seu Nome (Obrigatório)"
                      value={buyerName}
                      onChange={e => setBuyerName(e.target.value)}
                      style={{ width: '100%', padding: '8px', marginBottom: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                    />
                    
                    <textarea 
                      placeholder="Deixe uma mensagem para os noivos..."
                      value={buyerMessage}
                      onChange={e => setBuyerMessage(e.target.value)}
                      style={{ width: '100%', padding: '8px', marginBottom: '8px', borderRadius: '4px', border: '1px solid #ccc', minHeight: '60px' }}
                    />

                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button 
                        onClick={handleConfirmPurchase}
                        disabled={loading}
                        style={{ flex: 1, backgroundColor: '#2ecc71', color: 'white', padding: '10px', borderRadius: '5px', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>
                        {loading ? 'Salvando...' : '✅ Sim, já comprei!'}
                      </button>
                      
                      <button 
                        onClick={() => setBuyingOption(null)}
                        style={{ flex: 1, backgroundColor: '#e74c3c', color: 'white', padding: '10px', borderRadius: '5px', border: 'none', cursor: 'pointer' }}>
                        Cancelar
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

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