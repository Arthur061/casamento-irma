export function ProductCard({ product, onClick }) {
  const isAvailable = product.status;

  // 1. LÓGICA MÁGICA: Encontrar a opção mais barata
  let melhorOpcao = null;
  let imagemCapa = product.imagem_url; // Começa com a imagem padrão do banco
  let precoDisplay = product.preco; // Começa com o preço padrão do banco ("A partir de...")

  // Se tiver opções cadastradas no JSON...
  if (product.opcoes && product.opcoes.length > 0) {
    // Cria uma cópia da lista e ordena pelo preço (do menor para o maior)
    const opcoesOrdenadas = [...product.opcoes].sort((a, b) => a.preco - b.preco);
    
    // Pega a vencedora (a primeira da lista)
    melhorOpcao = opcoesOrdenadas[0];

    // Substitui a imagem e o preço pelos dados dessa opção vencedora
    imagemCapa = melhorOpcao.imagem;
    precoDisplay = `A partir de ${melhorOpcao.preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`;
  }

  return (
    <div 
      onClick={() => isAvailable && onClick(product)}
      style={{
        background: 'white', borderRadius: '15px', padding: '15px',
        boxShadow: '0 4px 10px rgba(0,0,0,0.05)', width: '280px',
        display: 'flex', flexDirection: 'column', cursor: 'pointer',
        transition: 'transform 0.2s',
        opacity: isAvailable ? 1 : 0.6,
        filter: isAvailable ? 'none' : 'grayscale(100%)'
      }}
      onMouseOver={e => isAvailable && (e.currentTarget.style.transform = 'translateY(-5px)')}
      onMouseOut={e => (e.currentTarget.style.transform = 'translateY(0)')}
    >
      
      {/* AQUI ESTÁ O SEGREDOS: Usamos a variável 'imagemCapa' calculada acima */}
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
      
      {/* Mostra o preço calculado da opção mais barata */}
      <p style={{ color: '#2ecc71', fontWeight: 'bold', fontSize: '1rem' }}>
        {precoDisplay}
      </p>

      <button style={{
        marginTop: '15px', backgroundColor: isAvailable ? '#d4a373' : '#ccc',
        color: 'white', border: 'none', padding: '10px', borderRadius: '8px', fontWeight: 'bold'
      }}>
        {isAvailable ? 'Ver Opções & Comprar' : 'Já Presenteado'}
      </button>

    </div>
  );
}