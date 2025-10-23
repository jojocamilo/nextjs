import { DarkModeProvider } from './contexts/DarkModeContext';
import ClientLayout from './components/ClientLayout/ClientLayout';
import Footer from './components/Footer/Footer';
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary';
import './fonts/fonts.css';
import './styles/globals.css';

export const metadata = {
  title: 'ACMIT - Conference',
  description:
    'ACMIT Conference',
  keywords: 'Conference,Swiss German University,SGU',
  authors: [{ name: 'Portify' }],
  viewport: 'width=device-width, initial-scale=1',
  robots: 'index, follow',
  openGraph: {
    title: 'Portify - Portfolio & Blog',
    description:
      'Professional portfolio and blog showcasing modern development skills',
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="de" suppressHydrationWarning={true}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" type="image/png" href="/logo.png" />
      </head>
      <body>
        <DarkModeProvider>
          <ErrorBoundary>
            <ClientLayout>{children}</ClientLayout>
          </ErrorBoundary>
        </DarkModeProvider>
        <Footer />
      </body>
    </html>
  );
}
