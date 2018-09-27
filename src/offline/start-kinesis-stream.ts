import { Kinesis, Request, AWSError } from 'aws-sdk';

import { yaml2env } from '@audit/utils/yaml-reader';

/**
 * This is to bootstrap a kinesis stream in local env. Obviously this doesnt happen in 
 * real AWS as a kinesis server will be already setup with a stream.
 * 
 * This is strictly for OFFLINE mode.
 */


// load all offline env properties
yaml2env('./src/config/env.yml', 'offline');

const kinesis: Kinesis = new Kinesis({
    endpoint: `${process.env.KINESIS_HOST}:${process.env.KINESIS_PORT}`,
    region: process.env.KINESIS_REGION,
    apiVersion: 'latest',
    sslEnabled: false
});

const createStream = () => {
    const streamName = process.env.KINESIS_STREAM_NAME_AUDIT_LOG as string;
    const request: Request<{}, AWSError> =
        kinesis.createStream({ ShardCount: 1, StreamName: streamName});
    request.send ((err: AWSError, data) => {
        if (err) {
            if (err.code === "ResourceInUseException") { // already exists in local, we just continue
                console.log(`Bootstrap: Success - Kinesis stream '${streamName}' already exists`);
                process.exit(0);
            } else {
                // something bad happened and we just cant create the stream locally
                console.error(`Bootstrap: Failed - Create Kinesis stream '${streamName}' failed with error ${err.stack}`);
                process.exit(1);
            }
        } else {
            console.log(`Bootstrap: Success - Kinesis stream '${streamName}' created`);
            process.exit(0);
        }
    });
};

createStream();
