import { Handler, Callback } from 'aws-lambda';

/**
 * listens to /logEvent
 * @param event 
 * @param context 
 * @param callback 
 */
export const logEvent: Handler = async (event: any, context: any, callback: Callback) => {
    console.log("You POSTed an event!");
    console.log(event.body);
    console.log(`kin`, process.env.KINESIS_STREAM_NAME_AUDIT_LOG);
    callback(null, { statusCode: 200, body: JSON.stringify({status: "Success", body: event.body})});
};