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
export const logEvent: Handler = async (event: any, context: any, callback: Callback) => {
    console.log("You POSTed an event!");
    kinesis.putRecord({
        Data: JSON.stringify(event.body),
        PartitionKey: 'US',
        StreamName: process.env.KINESIS_STREAM_NAME_AUDIT_LOG as string
    }, function (err) { 
        if (err) {
            callback(err, { statusCode: 500, body: "Error writing to kinesis" } );
        }
        else { 
            callback(null, { statusCode: 200, body: JSON.stringify({status: "Success", body: event.body})} );
        }
    });
};