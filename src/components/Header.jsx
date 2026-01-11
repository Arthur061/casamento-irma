import styles from '../styles/App.module.css'; 

export function Header() {
  return (
    <header style={{ 
      textAlign: 'center', 
      padding: '60px 20px', 
      backgroundColor: 'var(--secondary)',
      marginBottom: '40px'
    }}>
      <h1 style={{ fontSize: '3.5rem', marginBottom: '10px' }}>Leticia & Diogo</h1>
      <p style={{ fontSize: '1.2rem', letterSpacing: '2px', textTransform: 'uppercase' }}>
        Lista de Presentes
      </p>
      <p style={{ marginTop: '10px', fontStyle: 'italic' }}>
        08 de março de 2026
      </p>
    </header>
  );
}