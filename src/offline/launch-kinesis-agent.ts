import * as http from 'http';
import { spawn } from 'child_process';

let s = setInterval(() => {
    console.log('Checking if Local Kinesis is up');
    http.get({
        host: 'localhost',
        port: 4567,
        path: '/'
    }, resp => {
        resp.on('data', () => {
           // ignored
        });
        resp.on('end', () => {
            console.log(`Kinesis agent launching`);            
            clearInterval(s);            
            const pr = spawn('java', ['-jar', './kinesis-agent/uber-amazon-kinesis-agent-1.1.jar'])
            pr.stdout.on('data', data => {
                console.log(data.toString()); 
            });
            pr.stderr.on('data', data => {
                console.log(data.toString()); 
            });
        });
    })
        .on('error', err => console.log(`Kinesis Not yet!`)).end();
}, 5000);