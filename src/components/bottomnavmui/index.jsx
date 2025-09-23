"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Collections } from '@mui/icons-material';
//import { Event } from '@mui/icons-material';
//import styles from '@/app/styles/page.module.css';

export function BottomNavMui(){
    
    const pathname = usePathname();
    // determinar item ativo, ajuste conforme as rotas
    const active = pathname === '/profile' ? 'profile' : 'home';

    return (
        <nav className="bt-nav">
            <Link
                href="/home"
                className={`nav-item ${active === 'home' ? 'nav-item--active' : ''}`}
                aria-current={active === 'home' ? 'page' : undefined}
                aria-label="Ir para home"
            >
                <Collections className="icon" fontSize='medium' aria-hidden='true' />
                <span className='lbl-icon'>home</span>
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