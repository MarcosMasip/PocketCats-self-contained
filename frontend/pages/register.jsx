import Head from 'next/head';
import styles from '../styles/Home_old.module.css';

export default function Register() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Register - PocketCats</title>
      </Head>
      <main className={styles.main}>
        <h1 className={styles.title}>Register</h1>
        <p className={styles.subtitle}>
          Registration is handled via GitHub OAuth when you click “Sign In”.
          If your account doesn’t exist yet, it will be created on first login.
        </p>
        <p>
          To proceed, go back and click <a href="/login_page">Sign In</a> and choose “Login with Github”.
        </p>
      </main>
    </div>
  );
}
