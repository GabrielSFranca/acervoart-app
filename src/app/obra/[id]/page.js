// "use client";
// import React, { useState, useEffect } from "react";
// import { useRouter, useParams } from "next/navigation";

// import CloseIcon from "@mui/icons-material/Close";
// import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
// import ShareIcon from "@mui/icons-material/Share";

// import { buscaObraPorId } from "@/app/lib/tainacan-api";
// import styles from './page.module.css';

// function Header() {
//   const router = useRouter();
//   //const [liked, setLiked] = useState(false);

//   function handleBack() {
//     router.push("/");
//   } 

//   return (
//     <header className={styles.topbar}>
//       <button onClick={handleBack} aria-label="voltar" className={styles.actionbtn}>
//         <CloseIcon style={{ color: 'white', fontSize: 28 }} />
//       </button>
//       <button onClick={handleBack} aria-label="voltar" className={styles.actionbtn}>
//         <FavoriteBorderIcon style={{ fontSize: 28 }} />
//       </button>
//       <button onClick={handleBack} aria-label="voltar" className={styles.actionbtn}>
//         <ShareIcon style={{ fontSize: 26 }} />
//       </button>
//     </header>
//   );
// }

// export default function ObraDetalhe() {
//   const { id } = useParams();
//   const [obra, setObra] = useState(null);
//   const [carregando, setCarregando] = useState(true);

//   useEffect(() => {
//     async function fetchObra() {
//       try {
//         // const URL = `https://${UFSM_ACERV}/wp-json/tainacan/v2/items/${id}`;
//         // const res = await fetch(URL);
//         // if (!res.ok) throw new Error("Erro ao buscar obra");
//         // const dados = await res.json();
//         const normalizedObra = await buscaObraPorId(id);
//         setObra(normalizedObra);
//       } catch (e) {
//         setObra(null);
//       } finally {
//         setCarregando(false);
//       }
//     }
//     fetchObra();
//   }, [id]);

//   if (carregando) {
//     return (
//       <div className={styles.page}>
//         <Header />
//         <main className={styles.appcontainer}>
//           <p>Carregando...</p>
//         </main>
//       </div>
//     );
//   }

//   if (!obra) {
//     return (
//       <div className={styles.page}>
//         <Header />
//         <main className={styles.appcontainer}>
//           <p>Obra não encontrada</p>
//         </main>
//       </div>
//     );
//   }

//   return (
//     <div className={styles.page}>
//       <Header />
//         <main className={styles.appcontainer}>
//             <div className={styles.containerobra}>
//                 {obra.imgSrc ? (
//                   <img 
//                     src={obra.imgSrc} 
//                     alt={obra.titulo}
//                     className={styles.image}
//                   />
//                 ) : (
//                   <div className={styles.obraimgph}>🖼️</div>
//                 )}
//                 <div className={styles.info}>
//                     <h1>{obra.titulo}</h1>
//                     <h3>{obra.artista}</h3>
//                     {/* <p><strong>Dimensoes: </strong>{obra.dimensoes}</p> */}
//                     {/* <p><strong>descript: </strong>{obra.desc}</p> */}
//                     <p><strong>Ano: </strong>{obra.ano}</p>
//                     {/* <p><strong>Suporte: </strong>{obra.suport}</p> */}
//                     {/* <p><strong>Material: </strong>{obra.material}</p> */}
//                 </div>
//             </div>
//         </main>
//     </div>

//   );
// }


// // async function buscaObraPorId(id) {
// //   const BASE_URL = `https://${UFSM_ACERV}/wp-json/tainacan/v2/items/${id}`;
// //   try {
// //     const resposta = await fetch(BASE_URL);
// //     if (!resposta.ok) throw new Error("Erro HTTP " + resposta.status);
// //     const dados = await resposta.json();
// //     // A resposta para 1 item não vem em 'items', mas sim como objeto direto
// //     return dados;
// //   } catch (erro) {
// //     console.error("Erro ao buscar obra:", erro);
// //     throw erro;
// //   }
// // }

// // function Button() {
// //   return <x>xxxx</x>;
// // }


// // export default function DetailObra() {
// //   return <div>xxx</div>;
// // }
