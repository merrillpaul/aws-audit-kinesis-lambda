import { Kinesis, Request, AWSError } from 'aws-sdk';

import { yaml2env } from '@audit/utils/yaml-reader';

import { runner } from './kinesis';

/**
 * This is to bind the kinesis stream locally to a local lambda. Here we fake the real 
 * AWS lambda env for handling kinesis streams
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

const functions = [
    { funName: 'EventProcessor', handlerPath: '../handlers/audit-stream', handlerName: 'auditLog', kinesisStreamName: process.env.KINESIS_STREAM_NAME_AUDIT_LOG }
];


const getLog = (name: string) => {
    return {
        log: (m: string) => console.log(`\n${name}: ${m}`),
        error: (e: Error) => console.error(`\n${name}:`, e.message, e.stack)
    };
};

// borrowed from serverless-offline
const createHandler = (funOptions: any, options: any) => {
    if (!options.skipCacheInvalidation) {
      //console.log('Invalidating cache...');

      for (const key in require.cache) {
        // Require cache invalidation, brutal and fragile.
        // Might cause errors, if so please submit an issue.
        if (!key.match('node_modules')) delete require.cache[key];
      }
    }

    //console.log(`Loading handler... (${funOptions.handlerPath})`);
    const handler = require(funOptions.handlerPath)[funOptions.handlerName];

    if (typeof handler !== 'function') {
      throw new Error(`Serverless-offline: handler for '${funOptions.funName}' is not a function`);
    }

    return handler;
}

const cacheInvalidated = (funOptions: any) => { 
    return (kinesisEvent: any, context: any, callback: Function) => { 
        const handler = createHandler(funOptions, {});
        handler(kinesisEvent, context, callback);
    };
}

const initialize = (fns: any[]) => {
    fns.forEach((f) => { 
        runner(cacheInvalidated(f), { kinesis: kinesis, streamName: f.kinesisStreamName, console: getLog(f.funName) });
    });
};

initialize(functions);