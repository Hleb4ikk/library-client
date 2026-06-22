import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";
import type { Dispatch, ReactNode, SetStateAction } from "react";

import { MOCK_CURRENT_USER } from "./mock-user";
import type { User } from "./user";

type UserContextType = {
    user: User | null;
    isLoading: boolean;
    error: string | null;
    fetchUser: () => Promise<void>;
    setUser: Dispatch<SetStateAction<User | null>>;
};

type UserProviderProps = {
    children: ReactNode;
};

const UserContext = createContext<UserContextType | null>(null);

export function useUser() {
    const context = useContext(UserContext);

    if (!context) {
        throw new Error("useUser must be used within a UserProvider");
    }

    return context;
}

export default function UserProvider({ children }: UserProviderProps) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchUser = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            const user = MOCK_CURRENT_USER;

            setUser(user);
        } catch {
            setUser(null);
            setError("Не удалось загрузить пользователя");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        void fetchUser();
    }, [fetchUser]);

    const value = useMemo(
        () => ({
            user,
            isLoading,
            error,
            fetchUser,
            setUser,
        }),
        [user, isLoading, error, fetchUser]
    );

    return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}