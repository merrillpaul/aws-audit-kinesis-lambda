import { Handler, Context, Callback } from 'aws-lambda';

/**
 * listens to /logEvent
 * @param event 
 * @param context 
 * @param callback 
 */
export const logEvent: Handler = async (event: any, context: Context, callback: Callback) => {
    console.log("You POSTed an event!");
    console.log(event.body);
    callback(null, { statusCode: 200, body: JSON.stringify({status: "Success", body: event.body})});
};