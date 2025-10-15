import "../styles/globals.scss";
import { Providers } from "./providers";
import Header from "./components/Header";
import Footer from "./components/Footer";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body
        style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
      >
        <Providers>
          <Header />
          <div style={{ flex: 1 }}>{children}</div>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
