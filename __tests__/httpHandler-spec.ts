import { logEvent } from '@audit/handlers/http';

import { Context } from 'aws-lambda';

test('Should invoke the callback', () => {
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
    status: "Success",
    body: {
      params: {
        name: "Tester"
      }
    }
  }));
});
