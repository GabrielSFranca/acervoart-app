import { Cormorant_Garamond } from "next/font/google"; 
// importando o pacote de fontes do Google no Next.js

// configura as fontes
// import localfont
import { localFont } from 'next/font/local';
// 2. Configure a fonte local (Futura)
export const futura = localFont({
  src: [
    {
      path: '../fonts/futuraRegularFont.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../fonts/futuraBoldFont.ttf',
      weight: '700',
      style: 'normal',
    },
    // Adicione mais arquivos aqui (ex: Italic)
  ],
  display: 'swap',
  variable: '--font-text-futura', // 3. Defina a variável CSS
});

export const cormorant = Cormorant_Garamond({
    subsets: ['latin'],
    weight: ['400', '500', '600', '700'],
    variable: '--font-titulo-cormorant'
});
