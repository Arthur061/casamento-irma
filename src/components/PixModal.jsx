import { useState, useMemo, useEffect } from 'react';
import { supabase } from '../services/supabase'; 
import { QRCodeCanvas } from "qrcode.react"; 
import { generatePix } from '../utils/pix';

export function PixModal({ product, onClose, onSuccess }) {
  // --- CONFIGURAÇÃO ---
  const CHAVE_PIX_PADRAO = "04825246184"; 
  const NOME_TITULAR = "LETICIA ALVES RIBEIRO"; 
  const CIDADE_TITULAR = "BRASILIA";
  
  const [nomeConvidado, setNomeConvidado] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiado, setCopiado] = useState(false);
  const [valorSelecionado, setValorSelecionado] = useState(0);

  useEffect(() => {
    if (product.opcoes && product.opcoes.length > 0) {
      const opcoesOrdenadas = [...product.opcoes].sort((a, b) => parseFloat(a.preco) - parseFloat(b.preco));
      setValorSelecionado(parseFloat(opcoesOrdenadas[0].preco));
    } else {
      setValorSelecionado(parseFloat(product.preco) || 0);
    }
  }, [product]);

  const pixPayload = useMemo(() => {
    return generatePix({
      chave: product.pix_chave || CHAVE_PIX_PADRAO,
      nome: NOME_TITULAR,
      cidade: CIDADE_TITULAR,
      valor: valorSelecionado,
      txid: 'CASAMENTO'
    });
  }, [product.pix_chave, valorSelecionado]);

  const valorFormatado = valorSelecionado.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  const handleCopyPix = () => {
    navigator.clipboard.writeText(pixPayload);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  };

  const handleConfirmar = async (e) => {
    e.preventDefault();
    if (!nomeConvidado.trim()) return alert("Por favor, digite seu nome.");
    setLoading(true);

    try {
      const { error } = await supabase
        .from('presentes')
        .update({
          status: false,
          comprado_por: nomeConvidado,
          mensagem: mensagem
        })
        .eq('id', product.id);

      if (error) throw error;
      alert("Presente confirmado! Obrigado!");
      onSuccess();
      onClose();
    } catch (error) {
      console.error(error);
      alert("Erro ao confirmar.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.content}>
        <div style={styles.header}>
           <h2 style={{margin: 0}}>Presentear via Pix</h2>
           <button onClick={onClose} style={styles.closeX}>X</button>
        </div>
        
        <p>Item: <strong>{product.nome}</strong></p>
        
        <div style={styles.selectionBox}>
          <p style={{marginBottom:'10px', fontWeight:'bold'}}>Qual opção você quer presentear?</p>
          
          {product.opcoes && product.opcoes.map((opt, index) => {
            const val = parseFloat(opt.preco);
            return (
              <label key={index} style={styles.radioLabel}>
                <input 
                  type="radio" 
                  name="opcaoValor" 
                  value={val}
                  checked={valorSelecionado === val}
                  onChange={() => setValorSelecionado(val)}
                  style={{marginRight: '10px'}}
                />
                <span>{opt.nome} - <strong>R$ {val.toFixed(2).replace('.', ',')}</strong></span>
              </label>
            )
          })}
        </div>
        
        <div style={{textAlign: 'center', margin: '15px 0'}}>
            <p>Valor do Pix: <span style={{color: '#28a745', fontSize: '1.2rem', fontWeight: 'bold'}}>{valorFormatado}</span></p>
        </div>
        
        <div style={styles.pixContainer}>
          <div style={{background: 'white', padding: '10px', display:'inline-block'}}>
             {/* MUDANÇA 2: Usando o novo componente QRCodeCanvas */}
             <QRCodeCanvas value={pixPayload} size={160} />
          </div>
          
          <div style={styles.copyRow}>
            <button onClick={handleCopyPix} style={styles.copyBtn}>
              {copiado ? "Copiado!" : "Copiar Código Pix"}
            </button>
          </div>
        </div>

        <form onSubmit={handleConfirmar} style={styles.form}>
          <input 
              type="text" 
              value={nomeConvidado} 
              onChange={(e) => setNomeConvidado(e.target.value)} 
              placeholder="Seu Nome Completo"
              required
              style={styles.input}
            />
          <textarea 
              value={mensagem} 
              onChange={(e) => setMensagem(e.target.value)} 
              placeholder="Mensagem aos noivos (Opcional)"
              style={styles.input}
            />
          <button type="submit" disabled={loading} style={styles.confirmBtn}>
              {loading ? "Processando..." : "Já fiz o Pix, confirmar"}
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: '10px'
  },
  content: {
    backgroundColor: '#fff', padding: '20px', borderRadius: '10px', width: '100%', maxWidth: '450px',
    maxHeight: '90vh', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '15px'
  },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  closeX: { background:'none', border:'none', fontSize:'1.2rem', cursor:'pointer' },
  selectionBox: {
    backgroundColor: '#f8f9fa', padding: '10px', borderRadius: '8px', border: '1px solid #dee2e6'
  },
  radioLabel: {
    display: 'flex', alignItems: 'center', padding: '8px 0', cursor: 'pointer', borderBottom: '1px solid #eee'
  },
  pixContainer: {
    backgroundColor: '#f1f1f1', padding: '15px', borderRadius: '8px', textAlign: 'center'
  },
  copyRow: { marginTop: '10px' },
  copyBtn: {
    cursor: 'pointer', padding: '8px 16px', backgroundColor: '#007bff', color:'white', border:'none', borderRadius:'4px', fontWeight:'bold'
  },
  form: { display: 'flex', flexDirection: 'column', gap: '10px' },
  input: { width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' },
  confirmBtn: {
    backgroundColor: '#28a745', color: '#fff', padding: '12px', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight:'bold'
  }
};