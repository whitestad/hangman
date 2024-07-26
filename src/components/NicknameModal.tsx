import { useState } from "react";
import { db } from "../firebaseConfig";
import { collection, getDocs, query, where, addDoc } from "firebase/firestore";

import styles from "../styles/NicknameModal.module.css"

interface NicknameModalProps {
    setUser: (nickname: string) => void;
}

const NicknameModal: React.FC<NicknameModalProps> = ({ setUser }) => {
    const [nickname, setNickname] = useState<string>("");
    const [error, setError] = useState<string>("");

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const usersRef = collection(db, "users");
        const q = query(usersRef, where("nickname", "==", nickname));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            setError("Nickname already exists. Please choose another one.");
            return;
        }

        await addDoc(usersRef, { nickname, score: 0 });
        setUser(nickname);
        localStorage.setItem("nickname", nickname);
    };

    return (
        <div className={styles.modal}>
            <form className={styles.form} onSubmit={handleSubmit}>
                <label className={styles.label}>
                    Enter Username:

                </label>
                <input
                    className={styles.input}
                    type="text"
                    value={nickname}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNickname(e.target.value)}

                    required
                />
                <br></br>
                <button className={styles.button} type="submit">Submit</button>
                {error && <p className={styles.error}>{error}</p>}
            </form>
        </div>
    );
};

export default NicknameModal;
