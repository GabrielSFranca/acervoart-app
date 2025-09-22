import "./styles/globals.css";
import { cormorant } from "./styles/fonts";

export const metadata = {
  title: "mosai | Acervo ArtÍstico UFSM",
  description: "Portal de exposições e obras do Acervo Artístico da UFSM",
};

/*
const futura = localFont({
  src: "/public/FuturaCyrillicBook.woff",
  //display: "swap",
  variable: "--futura-text-font",
});*/


export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body className={`${cormorant.variable}`}>
        {children}
      </body>
    </html>
  );
}

