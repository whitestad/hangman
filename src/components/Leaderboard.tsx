import { useState, useEffect } from "react";
import { db } from "../firebaseConfig";
import { collection, getDocs, orderBy, query } from "firebase/firestore";

// Определите интерфейс для объектов лидерборда
interface LeaderboardEntry {
    id: string;
    nickname: string;
    score: number;
}

const Leaderboard = () => {
    // Укажите тип для состояния leaders
    const [leaders, setLeaders] = useState<LeaderboardEntry[]>([]);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            const usersRef = collection(db, "users");
            const q = query(usersRef, orderBy("score", "desc"));
            const querySnapshot = await getDocs(q);

            const leaderboard: LeaderboardEntry[] = querySnapshot.docs.map(doc => ({
                id: doc.id,
                nickname: doc.data().nickname,
                score: doc.data().score,
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
