import * as cdk from "aws-cdk-lib";
import { Template } from "aws-cdk-lib/assertions";
import * as DonutLockerPlatform from "../lib/donut-locker-platform-stack";

// example test. To run these tests, uncomment this file along with the
// example resource in lib/donut-locker-platform-stack.ts
describe("Test SQS Queue", () => {
  let app;
  let stack: cdk.Stack;
  let template: Template;

  beforeAll(() => {
    app = new cdk.App();
    stack = new DonutLockerPlatform.DonutLockerPlatformStack(
      app,
      "DonutLockerPlatformStack"
    );
    template = Template.fromStack(stack);
  });

  test("SQS Queue Created", () => {
    template.hasResourceProperties("AWS::SQS::Queue", {});
  });

  test("SQS is FIFO", () => {
    template.hasResourceProperties("AWS::SQS::Queue", {
      FifoQueue: true,
    });
  });

  test("SQS is visibilityTimeout is 30", () => {
    template.hasResourceProperties("AWS::SQS::Queue", {
      VisibilityTimeout: 30,
    });
  });

  test("SQS is name OrderQueue.fifo", () => {
    template.hasResourceProperties("AWS::SQS::Queue", {
      QueueName: "OrderQueue.fifo",
    });
  });
});
