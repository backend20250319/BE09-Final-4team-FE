import Header from '../../components/Header/Header';
import Sidebar from '../../components/Sidebar/Sidebar';

export default function DashboardLayout({ children }) {
  return (
    <>
      <Header />
      <div style={{ 
        display: 'flex', 
        minWidth: '1440px',
        maxWidth: '100vw'
      }}>
        <Sidebar />
        <main style={{ 
          flexGrow: 1, 
          padding: '0',
          minWidth: '1160px',
          maxWidth: 'calc(100vw - 280px)'
        }}>
          {children}
        </main>
      </div>
    </>
  );
} 