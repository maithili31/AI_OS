export interface Workflow {
    id: string;
    trigger: string;
    conditions: any[];
    actions: string[];
    enabled: boolean;
    createdAt: number;
}