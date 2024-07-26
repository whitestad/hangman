// components/NicknameModal.tsx
import { useState } from "react";
import { db } from "../firebaseConfig";
import { collection, getDocs, query, where, addDoc } from "firebase/firestore";

function NicknameModal({ setUser }) {
    const [nickname, setNickname] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
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
        <div className="modal">
            <form onSubmit={handleSubmit}>
                <label>
                    Enter Nickname:
                    <input
                        type="text"
                        value={nickname}
                        onChange={(e) => setNickname(e.target.value)}
                        required
                    />
                </label>
                <button type="submit">Submit</button>
                {error && <p>{error}</p>}
            </form>
        </div>
    );
}

export default NicknameModal;
