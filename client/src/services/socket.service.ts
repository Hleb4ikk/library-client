import { io, Socket } from "socket.io-client";

type LikesUpdatedPayload = {
    book_olid: string;
    count: number;
};

type SocketEventHandlers = {
    onLikesUpdated?: (payload: LikesUpdatedPayload) => void;
    onConnect?: () => void;
    onDisconnect?: () => void;
    onError?: (error: Error) => void;
};

class SocketService {
    private socket: Socket | null = null;
    private handlers: SocketEventHandlers = {};
    private reconnectAttempts = 0;
    private maxReconnectAttempts = 5;
    private isConnecting = false;

    /**
     * Получить URL WebSocket сервера из переменной окружения
     */
    private getSocketUrl(): string {
        const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000/api";
        // Извлекаем базовый URL без /api
        const baseUrl = apiUrl.replace(/\/api$/, "");
        return baseUrl;
    }

    /**
     * Инициализация подключения к WebSocket серверу
     */
    connect(): Socket {
        if (this.socket?.connected) {
            console.log("[WS] Уже подключен");
            return this.socket;
        }

        if (this.isConnecting) {
            console.log("[WS] Подключение уже в процессе");
            return this.socket!;
        }

        this.isConnecting = true;

        const socketUrl = this.getSocketUrl();
        console.log(`[WS] Подключение к ${socketUrl}...`);

        this.socket = io(socketUrl, {
            transports: ["websocket", "polling"],
            reconnection: true,
            reconnectionDelay: 1000,
            reconnectionDelayMax: 5000,
            reconnectionAttempts: this.maxReconnectAttempts,
        });

        this.setupEventListeners();
        this.isConnecting = false;

        return this.socket;
    }

    /**
     * Настройка обработчиков событий WebSocket
     */
    private setupEventListeners(): void {
        if (!this.socket) return;

        this.socket.on("connect", () => {
            console.log("[WS] Подключено успешно", this.socket?.id);
            this.reconnectAttempts = 0;
            this.handlers.onConnect?.();
        });

        this.socket.on("disconnect", (reason) => {
            console.log("[WS] Отключено:", reason);
            this.handlers.onDisconnect?.();
        });

        this.socket.on("connect_error", (error) => {
            console.error("[WS] Ошибка подключения:", error.message);
            this.reconnectAttempts++;
            this.handlers.onError?.(error);

            if (this.reconnectAttempts >= this.maxReconnectAttempts) {
                console.error("[WS] Превышен лимит попыток переподключения");
                this.disconnect();
            }
        });

        this.socket.on("likes:updated", (payload: LikesUpdatedPayload) => {
            console.log("[WS] Получено обновление лайков:", payload);
            this.handlers.onLikesUpdated?.(payload);
        });
    }

    /**
     * Регистрация обработчиков событий
     */
    on(handlers: SocketEventHandlers): void {
        this.handlers = { ...this.handlers, ...handlers };
    }

    /**
     * Присоединение к комнате книги
     */
    joinBookRoom(bookOlid: string): void {
        if (!this.socket?.connected) {
            console.warn("[WS] Не подключено. Попытка подключения...");
            this.connect();
        }

        const roomName = `book:${bookOlid}`;
        console.log(`[WS] Присоединение к комнате: ${roomName}`);
        this.socket?.emit("join_book_channel", bookOlid);
    }

    /**
     * Покидание комнаты книги
     */
    leaveBookRoom(bookOlid: string): void {
        if (!this.socket) return;

        const roomName = `book:${bookOlid}`;
        console.log(`[WS] Покидание комнаты: ${roomName}`);
        this.socket.emit("leave_book_channel", bookOlid);
    }

    /**
     * Отключение от WebSocket сервера
     */
    disconnect(): void {
        if (!this.socket) return;

        console.log("[WS] Отключение...");
        this.socket.removeAllListeners();
        this.socket.disconnect();
        this.socket = null;
        this.handlers = {};
        this.reconnectAttempts = 0;
        this.isConnecting = false;
    }

    /**
     * Проверка состояния подключения
     */
    isConnected(): boolean {
        return this.socket?.connected ?? false;
    }

    /**
     * Получение экземпляра сокета
     */
    getSocket(): Socket | null {
        return this.socket;
    }
}

// Экспортируем singleton instance
export const socketService = new SocketService();

// Экспортируем тип для использования в компонентах
export type { LikesUpdatedPayload };
