import { GoogleAnalytics } from '@next/third-parties/google';
import "../styles/globals.css";
import '../fonts/roboto.css';
import { MuteProvider } from './components/mute_context';

const baseUrl = process.env.HOST_URL
  ? `https://${process.env.HOST_URL}`
  : `http://localhost:${process.env.PORT || 3000}`;

const title = "CorruptedPigs - NFT Collection & Social Game";
const description = "Welcome to the official home of Corrupted Pigs. Join us to explore our unique NFT collection and engaging social game. Log in to access exclusive perks, participate in the burning pigs game, and discover the benefits of holding our NFTs and $COINK tokens.";
const imageUrl = `${baseUrl}/image-twitter-CP-launching-soon.jpg`;
const logoUrl = `${baseUrl}/images/favicon.png`

export const metadata = {
  title: title,
  description: description,
  keywords: "NFT game, social good, donate to institutions, crowdfunding, animal farm, fight corruption",
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
        <MuteProvider>
          {children}
        </MuteProvider>
      </body>
      {process.env.NODE_ENV === 'production' && (
        <GoogleAnalytics gaId={process.env.GOOGLE_ANALYTICS} />
      )}
    </html>
  );
}
