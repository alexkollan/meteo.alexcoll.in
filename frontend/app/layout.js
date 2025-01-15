import './globals.css';
import ThemeProvider from './components/ThemeProvider';

export const metadata = {
  title: 'My Next.js App',
  description: 'An application with MUI dark theme',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
