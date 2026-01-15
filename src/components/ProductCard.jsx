export function ProductCard({ product, onClick }) {
  // Verifica se o status global está true
  const isActive = product.status;
  
  // Verifica se TODAS as opções dentro do JSON estão reservadas
  const todasOpcoesEsgotadas = product.opcoes && product.opcoes.length > 0 
    ? product.opcoes.every(op => op.reservado === true)
    : false;

  // Se estiver inativo ou tudo esgotado, bloqueia
  const isAvailable = isActive && !todasOpcoesEsgotadas;

  // Lógica para encontrar o preço mais barato disponível
  let melhorOpcao = null;
  let imagemCapa = product.imagem_url;
  let precoDisplay = product.preco;

  if (product.opcoes && product.opcoes.length > 0) {
    // Tenta pegar apenas as NÃO reservadas para mostrar o preço "A partir de"
    // Se tudo estiver reservado, pega qualquer uma só para não quebrar
    const disponiveis = product.opcoes.filter(op => !op.reservado);
    const listaParaOrdenar = disponiveis.length > 0 ? disponiveis : product.opcoes;

    const opcoesOrdenadas = [...listaParaOrdenar].sort((a, b) => a.preco - b.preco);
    melhorOpcao = opcoesOrdenadas[0];

    // Se tiver opção, atualiza a capa. Se não (erro de dados), mantém original.
    if (melhorOpcao) {
        imagemCapa = melhorOpcao.imagem || product.imagem_url;
        precoDisplay = `A partir de ${melhorOpcao.preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`;
    }
  }

  return (
    <div 
      onClick={() => isAvailable && onClick(product)}
      style={{
        background: 'white', borderRadius: '15px', padding: '15px',
        boxShadow: '0 4px 10px rgba(0,0,0,0.05)', width: '280px',
        display: 'flex', flexDirection: 'column', cursor: isAvailable ? 'pointer' : 'default',
        transition: 'transform 0.2s',
        opacity: isAvailable ? 1 : 0.7,
        position: 'relative', // Necessário para a faixa de esgotado
        filter: isAvailable ? 'none' : 'grayscale(100%)'
      }}
      onMouseOver={e => isAvailable && (e.currentTarget.style.transform = 'translateY(-5px)')}
      onMouseOut={e => (e.currentTarget.style.transform = 'translateY(0)')}
    >
      
      {/* FAIXA DE ESGOTADO (Só aparece se acabou tudo) */}
      {!isAvailable && isActive && (
        <div style={{
            position: 'absolute', top: '15px', right: '-10px', 
            backgroundColor: '#c0392b', color: 'white', fontWeight: 'bold',
            padding: '5px 15px', transform: 'rotate(5deg)', 
            boxShadow: '2px 2px 5px rgba(0,0,0,0.3)', zIndex: 10
        }}>
            ESGOTADO
        </div>
      )}

      <img 
        src={imagemCapa} 
        alt={product.nome} 
        style={{
          width: '100%', height: '220px', objectFit: 'contain', 
          borderRadius: '10px', marginBottom: '15px'
        }} 
      />

      <h3 style={{ fontSize: '1.1rem', marginBottom: '5px', color: '#333' }}>
        {product.nome}
      </h3>
      
      <p style={{ color: '#2ecc71', fontWeight: 'bold', fontSize: '1rem' }}>
        {isAvailable ? precoDisplay : 'Indisponível'}
      </p>

      <button disabled={!isAvailable} style={{
        marginTop: '15px', 
        backgroundColor: isAvailable ? '#d4a373' : '#999',
        color: 'white', border: 'none', padding: '10px', borderRadius: '8px', fontWeight: 'bold',
        cursor: isAvailable ? 'pointer' : 'not-allowed'
      }}>
        {isAvailable ? 'Ver Opções & Comprar' : 'Já Presenteado'}
      </button>

    </div>
  );
}