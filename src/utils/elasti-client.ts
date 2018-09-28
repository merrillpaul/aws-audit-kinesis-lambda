import { Client } from "elasticsearch";
import { AssessAuditEvent } from "@audit/models/event";

export class ESClient {
    
    private client: Client;
    private indexCreated: boolean = false;
    
    constructor(private index: string, private type: string) {
        this.client = new Client({
            host: process.env.ELASTIC_SEARCH_HOST,
            log: process.env.ELASTIC_CLIENT_LOG || 'error'
        });        
    }

    public processAssessLogs(logs: AssessAuditEvent[]): void {
        if (!this.indexCreated) {
            const mapping = `
                    {
                        "${this.type}": {
                            "properties": {
                                "eventDate": {
                                    "type":   "date",
                                    "format": "epoch_millis"
                                }
                            }
                        }
                    }
                `;
            this.client.indices.create({
                index: this.index,
                body: {
                    mappings: JSON.parse(mapping)
                }
            }).then (() => {
                
               /* this.client.indices.putMapping({
                    index: this.index,
                    type: this.type,
                    body: JSON.parse(mapping)
                }).then(() => {
                    this.indexCreated = true;
                    this.postLogs(logs);
                }); */  
                this.indexCreated = true;
                this.postLogs(logs);            
            })
            .catch(err => {
                console.warn(`Warning for tryying to create a ES index ${this.index}`, err.body);
            });            
        } else {
            this.postLogs(logs);
        }
    }

    private postLogs(logs: AssessAuditEvent[]): void {
        logs.forEach (l => {
            this.client.index({
                index: this.index,
                type: this.type,
                body: l
            }, (err, resp) => {
                console.warn(err, resp);
            });
        });       
    }
}