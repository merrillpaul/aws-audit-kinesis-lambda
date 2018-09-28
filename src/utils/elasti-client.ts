import { Client } from "elasticsearch";
import { AssessAuditEvent } from "@audit/models/event";

export class ESClient {
    
    private client: Client;
    
    constructor() {
        this.client = new Client({
            host: process.env.ELASTIC_SEARCH_HOST,
            log: process.env.ELASTIC_CLIENT_LOG || 'error'
        });
    }

    public processAssessLogs(logs: AssessAuditEvent[]): void {
        
    }
}