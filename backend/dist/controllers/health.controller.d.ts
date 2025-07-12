export declare class HealthController {
    healthCheck(): Promise<{
        status: string;
        timestamp: string;
        uptime: number;
        environment: string;
    }>;
}
