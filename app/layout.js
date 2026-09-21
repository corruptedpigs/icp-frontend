import { GoogleAnalytics } from '@next/third-parties/google';
import "../styles/globals.css";
import '../fonts/roboto.css';
import { MuteProvider } from './components/mute_context';
import { WalletProvider } from './context/WalletContext';
import { LanguageProvider } from './components/LanguageContext';

const baseUrl = process.env.HOST_URL
  ? `https://${process.env.HOST_URL}`
  : `http://localhost:${process.env.PORT || 3000}`;

const title = "CPigs — Satire, Games & Technology Against Corruption";
const description = "An artistic and educational project that uses satire, games, and collectible cards to make corruption easier to understand, question, and discuss.";
const imageUrl = `${baseUrl}/image-twitter-CP-launching-soon.jpg`;
const logoUrl = `${baseUrl}/images/favicon.png`

export const metadata = {
  title: title,
  description: description,
  keywords: "satire, social impact, collectible cards, corruption, education, games, burn to donate",
  openGraph: {
    description: description,
    logo: logoUrl,
    type: "website",
    url: baseUrl,
    image: imageUrl
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" style={{ scrollBehavior: 'smooth' }}>
      <head>
        <link rel="shortcut icon" href={metadata.openGraph.logo} sizes="any" />
        <meta name="description" content={description} />
        <meta property="og:image" content={metadata.openGraph.image} />
        <meta property="og:logo" content={metadata.openGraph.logo} />
      </head>
      <body className="roboto">
        <LanguageProvider>
          <WalletProvider>
            <MuteProvider>
              {children}
            </MuteProvider>
          </WalletProvider>
        </LanguageProvider>
      </body>
      {process.env.NODE_ENV === 'production' && (
        <GoogleAnalytics gaId={process.env.GOOGLE_ANALYTICS} />
      )}
    </html>
  );
}
