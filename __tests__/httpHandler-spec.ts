import { logEvent } from '@audit/handlers/http';

jest.mock('aws-sdk');

import { Kinesis, AWSError } from 'aws-sdk';

beforeEach(() => {
  // Clear all instances and calls to constructor and all methods:
  //Kinesis.mockClear();
});

describe("Http Handler", () => {

  it("should call success with 200 if kinesis put is successful", () => {
    process.env['KINESIS_STREAM_NAME_AUDIT_LOG'] = 'MY_AUDIT_STREAM';
    let params: any = {};
    Kinesis.prototype.putRecord = jest.fn().mockImplementationOnce((_params: Kinesis.Types.PutRecordInput, callback: (err: any, data: any) => void) => {
      params = _params;
      callback(null, {});

    });
    let called = false;
    let passedContent: any = {};
    let context: any = {};
    logEvent({ body: { params: { name: 'Tester' } } }, context, (arg1: any, content: any) => {
      called = true;
      passedContent = content;
    });
    expect(called).toBeTruthy();
    expect(passedContent.statusCode).toBe(200);
    expect(passedContent.body).toEqual(JSON.stringify({
      status: "Success"
    }));
    expect(params.PartitionKey).toBe("US");
    expect(params.StreamName).toBe("MY_AUDIT_STREAM");
  });

  it("should call error with 500 if kinesis put is failed", () => {
    Kinesis.prototype.putRecord = jest.fn().mockImplementationOnce((_params: Kinesis.Types.PutRecordInput, callback: (err: any, data: any) => void) => {
      callback("BAD", {});
    });

    let passedContent: any = {};
    let context: any = {};
    logEvent({ body: { params: { name: 'Tester' } } }, context, (arg1: any, content: any) => {
      passedContent = content;
    });
    expect(passedContent.statusCode).toBe(500);
    expect(passedContent.body).toEqual("Error writing to kinesis");
  });
});
