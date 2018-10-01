
# Audit log processing with AWS Serverless with Kinesis streams



## Design

Audit events are placed into a Kinesis stream. Every insertion, triggers a `λ` function which processes the payload and adds to a Elastisearch index.
This allows an admin to investigate these events using Kibana or any other tools that can interface with ELastisearch.


## Local Setup

This is primarily for emulating the AWS Elastisearch, Kinesis and Lambda locally before deploying to AWS.

### Elasticsearch

Install Elasticearch as documented in https://www.elastic.co/downloads. Once extracted, add the `bin` to path and test by running 
```sh
elasticsearch
```
OPen a browser and go to http://localhost:9200 to explore the options of elasticsearch

### Kibana


Install Kibana as documented in https://www.elastic.co/downloads. Once extracted, add the `bin` to path and test by running 
```sh
kibana
```
Open a browser and go to http://localhost:5601 to explore the UI

## Offline mode

Allow to run the system locally in offline mode.
`npm run offline`

This:
- Starts **Kinesis** using the kinesalite npm module to emulate kinesis
- Creates the required Kinesis stream for Audit log
- Starts a listener on to the above stream so as to invoke the handler
- Starts a demo http endpoint which can be used to test to insert an object into Kinesis


### Test Publish to Kinesis
```sh
curl -X POST \
  http://localhost:3000/logEvent \
  -H 'Cache-Control: no-cache' \
  -H 'Content-Type: application/json' \
  -H 'Postman-Token: 628ba423-db37-430c-8661-14f3a4bdfb9f' \
  -H 'User-Agent: Assess/Webview' \
  -d '{
    "events": [
        {
            "username": "mpaul",
            "userId": "A1000",
            "eventDate": "20181002T161932+0000",
            "eventType": "sometype1",
            "area": "area1",
            "clientId": "CL0001",
            "clientName": "Jane",
            "deviceId": "asads100",
            "deviceName": "ipAd",
            "entity": "Internal QA",
            "bu": "US BU",
            "offline": true,
            "changes": [
                {
                        "fieldName": "fr",
                        "oldValue": "old",
                        "newValue": "new"
                }
            ]
        },
        {
            "username": "upaulm2",
            "userId": "B1000",
            "eventDate": "20181011T161932+0000",
            "eventType": "sometype2",
            "area": "area2",
            "clientId": "CL0002",
            "clientName": "Joe",
            "deviceId": "asads200",
            "deviceName": "Android",
            "offline": false,
            "entity": "Internal QA1",
            "bu": "CA BU"
        }
    ]
  }'
```

### Unit tests

`npm test`

## AWS Deployment



## Setting travis and coveralls badges
1. Sign in to [travis](https://travis-ci.org/) and activate the build for your project.
2. Sign in to [coveralls](https://coveralls.io/) and activate the build for your project.
3. Replace {{github-user-name}}/{{github-app-name}} with your repo details like: "gitrepo/project name".


 
Project created using Yeoman TypeScript NodeJS Generator (https://github.com/ospatil/generator-node-typescript#readme)
