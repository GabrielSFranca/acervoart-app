import "./styles/globals.css";
import { cormorant, montserrat } from "./styles/fonts";
import { BottomNavMui } from '@/components/bottomnavmui';

export const metadata = {
  title: "mosai | Acervo ArtÍstico UFSM",
  description: "Portal de exposições e obras do Acervo Artístico da UFSM",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body className={`${cormorant.variable} ${montserrat.variable}`}>
        {children}
        <BottomNavMui />
      </body>
    </html>
  );
}

/*
const futura = localFont({
  src: "/public/FuturaCyrillicBook.woff",
  //display: "swap",
  variable: "--futura-text-font",
});*/