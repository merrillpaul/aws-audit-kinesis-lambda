import { Handler, Callback } from 'aws-lambda';

import { AssessAuditEvent } from '@audit/models/event';
import { ESClient } from '@audit/utils/elasti-client';

let esClient: ESClient;
/**
 * This processes either list of audit events where it will be in the following format
 * <code>
 * [
 *  {
 *      username: "mpaul",
 *      userId: "A1000",
 *      eventDate:  epoch,
 *      eventType: 'sometype',
 *      area: 'area',
 *      clientId: 'CL0001',
 *      clientName: 'Jane',
 *      deviceId: 'asads,
 *      deviceName: 'ipAd',
 *      entity: 'Internal QA',
 *      bu: 'US BU',
 *      offline: true/false,
 *      changes: [
 *          {
 *              fieldName: 'fr',
 *              oldValue: 'old',
 *              newValue: 'new'
 *          }
 *      ]
 *  },
 *  {
 *      username: "upaulm2",
 *      userId: "A1000",
 *      eventDate:  epoch,
 *      eventType: 'sometype',
 *      area: 'area',
 *      clientId: 'CL0001',
 *      clientName: 'Jane',
 *      deviceId: 'asads,
 *      deviceName: 'ipAd',
 *      offline: true/false,
 *      entity: 'Internal QA',
 *      bu: 'US BU',
 *      changes: [
 *          {
 *              fieldName: 'fr',
 *              oldValue: 'old',
 *              newValue: 'new'
 *          }
 *      ]
 *  }
 * ]
 * </code>
 * @param event 
 * @param context 
 * @param callback 
 */
export const auditLog: Handler = (event: any, context: any, callback: Callback) => {
    if(!esClient) {
        esClient = new ESClient();
    }

    event.Records.forEach((record: any) => {
        const payload = new Buffer(record.kinesis.data, 'base64').toString('utf-8');
        const events: AssessAuditEvent[] = JSON.parse(payload);
        console.log("Received a Kinesis event: ", events);
        esClient.processAssessLogs(events);
    });
    callback(null, `Successfully processed ${event.Records.length} event.`);
};