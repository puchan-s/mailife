import Head from 'next/head';
//import styles from '../styles/Home.module.css';
import { ReactNode } from 'react';
import CustomMenuBar from './CustomMenuBar'

export const appName = 'Sample App';

interface LayoutProps {
  children: ReactNode;
}

//<main className={styles.main}>
function Layout({ children }: LayoutProps) {
  return (
    <div>
      <Head>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <header>
        <CustomMenuBar></CustomMenuBar>
        <h1>{appName}</h1>
        <p>ここにはLayout.jsの内容が表示されています。</p>
      </header>
      <main>
        {children}
      </main>
    </div>
  );
}

export default Layout;
