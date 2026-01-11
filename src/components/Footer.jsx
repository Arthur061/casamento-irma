import React from 'react';

export function Footer() {
  return (
    <footer style={styles.footer}>
      <p style={styles.text}>
        Desenvolvido com ❤️ por <strong>Arthur Alves</strong>
      </p>
      <div style={styles.links}>
        <a href="https://www.linkedin.com/in/arthur-alves-600aa31b0/" target="_blank" rel="noreferrer" style={styles.link}>
          LinkedIn
        </a>
        <span style={{color: '#888'}}>|</span>
        <a href="https://github.com/Arthur061" target="_blank" rel="noreferrer" style={styles.link}>
          GitHub
        </a>
        <span style={{color: '#888'}}>|</span>
        <a href="(61) 99308-3616" target="_blank" rel="noreferrer" style={styles.link}>
          Contato
        </a>
      </div>
      <p style={styles.small}>Aceito encomendas de projetos web e sistemas.</p>
    </footer>
  );
}

const styles = {
  footer: {
    marginTop: '50px',
    padding: '30px 20px',
    backgroundColor: '#384628', // Verde Oliva bem escuro para o rodapé
    color: '#f4f4f9',
    textAlign: 'center',
    borderRadius: '15px 15px 0 0', // Arredondado só em cima
  },
  text: { margin: '0 0 10px 0', fontSize: '1rem' },
  links: { display: 'flex', justifyContent: 'center', gap: '15px', marginBottom: '10px' },
  link: { color: '#a4c639', textDecoration: 'none', fontWeight: 'bold' }, // Um verde mais claro nos links
  small: { fontSize: '0.8rem', opacity: 0.7 }
};