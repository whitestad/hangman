import { useState, useEffect } from "react";
import { db } from "../firebaseConfig";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import style from './../styles/Leaderboard.module.css';
import Spinner from "./Spinner.tsx";

// Определите интерфейс для объектов лидерборда
interface LeaderboardEntry {
    id: string;
    nickname: string;
    score: number;
}

const Leaderboard = () => {
    // Укажите тип для состояния leaders
    const [leaders, setLeaders] = useState<LeaderboardEntry[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            const usersRef = collection(db, "users");
            const q = query(usersRef, orderBy("score", "desc"));
            const querySnapshot = await getDocs(q);

            const leaderboard: LeaderboardEntry[] = querySnapshot.docs.slice(0, 10).map(doc => ({
                id: doc.id,
                nickname: doc.data().nickname,
                score: doc.data().score,
            }));

            setLeaders(leaderboard);
            setLoading(false); // Установите загрузку в false после получения данных
        };

        fetchLeaderboard();
    }, []);

    if (loading) {
        return <Spinner/>;
    }

    return (
        <div className={style.board}>
            <h2 className={style.h2}>Leaderboard</h2>
            <div className={style.list}>
                {leaders.map((leader, index) => (
                    <div className={style.item} key={leader.id}>
                        {index + 1}. {leader.nickname}: {leader.score}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Leaderboard;
