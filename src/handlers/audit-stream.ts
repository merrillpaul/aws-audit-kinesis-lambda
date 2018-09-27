import { Handler, Callback } from 'aws-lambda';

export const auditLog: Handler = async (event: any, context: any, callback: Callback) => {
    event.Records.forEach((record: any) => {
        const payload = new Buffer(record.kinesis.data, 'base64').toString('ascii');
        console.log("Received an event: " + payload);
    });
    callback(null, `Successfully processed ${event.Records.length} event.`);
};