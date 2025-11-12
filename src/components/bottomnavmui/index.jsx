"use client";
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
//import { Collections } from '@mui/icons-material';
import PaletteIcon from '@mui/icons-material/Palette';  //import { Event } from '@mui/icons-material';

export function BottomNavMui() {     
    const pathname = usePathname(); // determinar item ativo, ajuste conforme as rotas
    const isHome = pathname === '/'; // Considera '/' como rota ativa para home/obras

    const actvCor = '#ff5b04';
    const inativCor = '#bbb';
    return (
        <nav className="bt-nav">
            <Link
                href="/"
                className={`nav-item${isHome ? ' nav-item--active' : ''}`}
                aria-current={isHome ? 'page' : undefined}
                aria-label="Ir para home"
            >
                <PaletteIcon
                    className='icon'
                    style={{ color: isHome ? actvCor : inativCor }}
                />
            </Link>
        </nav>
    );
}


/*
<Link href="/profile" className={`bottom-nav__item ${active === 'profile' ? 'bottom-nav__item--active' : ''}`} aria-label="Perfil">
  <PersonIcon className="bottom-nav__icon" fontSize="medium" aria-hidden="true" />
  <span className="bottom-nav__label">perfil</span>
</Link>

*/
// "use client";

// import React from 'react';
// import Link from 'next/link';
// import { usePathname } from 'next/navigation';
// import { Collections } from '@mui/icons-material';
// import PaletteIcon from '@mui/icons-material/Palette';

// //import { Event } from '@mui/icons-material';
// //import styles from '@/app/styles/page.module.css';

// export function BottomNavMui(){
    
//     const pathname = usePathname();
//     // determinar item ativo, ajuste conforme as rotas
//     const active = pathname === '/profile' ? 'profile' : 'home';

//     return (
//         <nav className="bt-nav">
//             <Link
//                 href="/home"
//                 className={`nav-item ${active === 'home' ? 'nav-item--active' : ''}`}
//                 aria-current={active === 'home' ? 'page' : undefined}
//                 aria-label="Ir para home"
//             >
//                 <Collections className="icon" fontSize='medium' aria-hidden='true' />
//                 <span className='lbl-icon'>home</span>
//             </Link>
//         </nav>
//     );
// }
