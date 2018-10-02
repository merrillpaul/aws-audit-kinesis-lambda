import * as http from 'http';
import { spawn } from 'child_process';
import { Tail } from 'tail';

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
            process.env.AWS_CBOR_DISABLE= 'true'; // this because kinesalite has issues with CBOR which is what the latest aws sdk uses by default           
            const pr = spawn('java', ['-jar', './kinesis-agent/uber-amazon-kinesis-agent-1.1.jar', '-c', './kinesis-agent/agent.json', '-l', '/tmp/choose-share/kin-agent.log', '-L', 'TRACE'], process.env);
            pr.stdout.on('data', data => {
                console.log(data.toString()); 
            });
            pr.stderr.on('data', data => {
                console.log(data.toString()); 
            });
            console.log("Agent running");
            new Tail('/tmp/choose-share/kin-agent.log').on('line', data => console.log(data));
        });
    })
        .on('error', err => console.log(`Kinesis Not yet!`)).end();
}, 5000);