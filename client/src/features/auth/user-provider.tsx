import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";
import type { Dispatch, ReactNode, SetStateAction } from "react";

import { tokenStorage } from "../../api/tokenStorage";
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

const USER_STORAGE_KEY = "user";

const UserContext = createContext<UserContextType | null>(null);

export function useUser() {
    const context = useContext(UserContext);

    if (!context) {
        throw new Error("useUser must be used within a UserProvider");
    }

    return context;
}

function getStoredUser(): User | null {
    const storedUser = localStorage.getItem(USER_STORAGE_KEY);

    if (!storedUser) {
        return null;
    }

    try {
        return JSON.parse(storedUser) as User;
    } catch {
        localStorage.removeItem(USER_STORAGE_KEY);
        return null;
    }
}

export function saveUser(user: User) {
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
}

export function removeUser() {
    localStorage.removeItem(USER_STORAGE_KEY);
}

export default function UserProvider({ children }: UserProviderProps) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchUser = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            const token = tokenStorage.get();
            const storedUser = getStoredUser();

            if (token && storedUser) {
                setUser(storedUser);
            } else {
                tokenStorage.remove();
                removeUser();
                setUser(null);
            }
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
        [user, isLoading, error, fetchUser],
    );

    return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}