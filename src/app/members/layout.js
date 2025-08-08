import Header from '../../components/Header/Header';
import Sidebar from '../../components/Sidebar/Sidebar';

export default function MembersLayout({ children }) {
  return (
    <>
      <Header />
      <div style={{ 
        display: 'flex', 
        minWidth: '1440px',
        maxWidth: '100vw',
        height: 'calc(100vh - 64px)'
      }}>
        <Sidebar />
        <main style={{ 
          flexGrow: 1, 
          padding: '0',
          minWidth: '1160px',
          maxWidth: 'calc(100vw - 280px)',
          overflow: 'hidden'
        }}>
          {children}
        </main>
      </div>
    </>
  );
} 