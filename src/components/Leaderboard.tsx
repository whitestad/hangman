// components/Leaderboard.tsx
import { useState, useEffect } from "react";
import { db } from "../firebaseConfig";
import { collection, getDocs, orderBy, query } from "firebase/firestore";

const Leaderboard = () => {
    const [leaders, setLeaders] = useState([]);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            const usersRef = collection(db, "users");
            const q = query(usersRef, orderBy("score", "desc"));
            const querySnapshot = await getDocs(q);

            const leaderboard = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));

            setLeaders(leaderboard);
        };

        fetchLeaderboard();
    }, []);

    return (
        <div>
            <h2>Leaderboard</h2>
            <ul>
                {leaders.map((leader, index) => (
                    <li key={leader.id}>
                        {index + 1}. {leader.nickname}: {leader.score}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Leaderboard;
