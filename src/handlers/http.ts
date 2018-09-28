import { Handler, Callback } from 'aws-lambda';
import { Kinesis } from 'aws-sdk';


const kinesis: Kinesis = new Kinesis({
    endpoint: `${process.env.KINESIS_HOST}:${process.env.KINESIS_PORT}`,
    region: process.env.KINESIS_REGION,
    apiVersion: 'latest',
    sslEnabled: false
});


/**
 * listens to /logEvent
 * @param event 
 * @param context 
 * @param callback 
 */
export const logEvent: Handler =  (event: any, context: any, callback: Callback) => {
    kinesis.putRecord({
        Data: event.body,
        PartitionKey: 'US',
        StreamName: process.env.KINESIS_STREAM_NAME_AUDIT_LOG as string
    }, (err) => { 
        if (err) {
            console.error("Error", err);
            callback(err, { statusCode: 500, body: "Error writing to kinesis" } );
        } else { 
            console.log("Return success from http after putting kinesis");
            callback(null, { statusCode: 200, body: JSON.stringify({status: "Success"})} );
        }
    });
};