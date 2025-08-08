// src/app/layout.js
import Header from '../components/Header/Header';
import Sidebar from '../components/Sidebar/Sidebar';
import './globals.css';

export const metadata = {
  title: 'Hermes HR System',
  description: 'Welcome to Hermes HR System',
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body>
        {children}
      </body>
    </html>
  );
}
