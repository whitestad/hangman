import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyDXPSpqYMUaq-6H0lhdrzJnofRVfqWoPhA",
    authDomain: "hangmancrypto-b2a0d.firebaseapp.com",
    projectId: "hangmancrypto-b2a0d",
    storageBucket: "hangmancrypto-b2a0d.appspot.com",
    messagingSenderId: "857576148184",
    appId: "1:857576148184:web:c448381966e3641bba1bad"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
