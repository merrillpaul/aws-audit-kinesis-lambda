import { Handler, Callback } from 'aws-lambda';

export const auditLog: Handler = async (event: any, context: any, callback: Callback) => {
    event.Records.forEach((record: any) => {
        const payload = new Buffer(record.kinesis.data, 'base64').toString('utf-8');
        console.log("Received a Kinesis event: ", JSON.parse(payload));
    });
    callback(null, `Successfully processed ${event.Records.length} event.`);
};