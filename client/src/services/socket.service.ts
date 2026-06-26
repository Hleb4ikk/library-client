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

    private getSocketUrl(): string {
        const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000/api";
        const baseUrl = apiUrl.replace(/\/api$/, "");
        return baseUrl;
    }

    connect(): Socket {
        if (this.socket?.connected) return this.socket;
        if (this.isConnecting) return this.socket!;

        this.isConnecting = true;
        const socketUrl = this.getSocketUrl();

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

    private setupEventListeners(): void {
        if (!this.socket) return;

        this.socket.on("connect", () => {
            this.reconnectAttempts = 0;
            this.handlers.onConnect?.();
        });

        this.socket.on("disconnect", () => {
            this.handlers.onDisconnect?.();
        });

        this.socket.on("connect_error", (error) => {
            this.reconnectAttempts++;
            this.handlers.onError?.(error);

            if (this.reconnectAttempts >= this.maxReconnectAttempts) {
                this.disconnect();
            }
        });

        this.socket.on("likes:updated", (payload: LikesUpdatedPayload) => {
            this.handlers.onLikesUpdated?.(payload);
        });
    }
    on(handlers: SocketEventHandlers): void {
        this.handlers = { ...this.handlers, ...handlers };
    }

    joinBookRoom(bookOlid: string): void {
        if (!this.socket?.connected) this.connect();
        this.socket?.emit("join_book_channel", bookOlid);
    }

    leaveBookRoom(bookOlid: string): void {
        if (!this.socket) return;
        this.socket.emit("leave_book_channel", bookOlid);
    }

    disconnect(): void {
        if (!this.socket) return;
        this.socket.removeAllListeners();
        this.socket.disconnect();
        this.socket = null;
        this.handlers = {};
        this.reconnectAttempts = 0;
        this.isConnecting = false;
    }

    isConnected(): boolean {
        return this.socket?.connected ?? false;
    }
}

export const socketService = new SocketService();
export type { LikesUpdatedPayload };
