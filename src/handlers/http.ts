import { Handler, Callback } from 'aws-lambda';
import { Kinesis } from 'aws-sdk';
import clientConfig from  '@audit/utils/kinesis-client';

const kinesis: Kinesis = new Kinesis(clientConfig);


/**
 * listens to /logEvent
 * @param event 
 * @param context 
 * @param callback 
 */
export const logEvent: Handler =  (event: any, context: any, callback: Callback) => {
    /*kinesis.putRecord({
        Data: event.body,
        PartitionKey: 'US',
        StreamName: process.env.KINESIS_STREAM_NAME_ASSESS_LOG as string
    }, (err) => { 
        if (err) {
            console.error("Error", err);
            callback(err, { statusCode: 500, body: "Error writing to kinesis" } );
        } else { 
            console.log("Return success from http after putting kinesis");
            callback(null, { statusCode: 200, body: JSON.stringify({status: "Success"})} );
        }
    });*/
    //local-qi-audit-assess-log-stream
    console.log(`Http logevent`, process.env);
    callback(null, { statusCode: 200, body: JSON.stringify({status: "Success"})} );
};