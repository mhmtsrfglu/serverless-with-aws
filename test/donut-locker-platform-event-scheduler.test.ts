import * as cdk from "aws-cdk-lib";
import { Template } from "aws-cdk-lib/assertions";
import * as DonutLockerPlatform from "../lib/donut-locker-platform-stack";

// example test. To run these tests, uncomment this file along with the
// example resource in lib/donut-locker-platform-stack.ts
describe("Test Event Scheduler", () => {
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

  test("AWS Events Rule", () => {
    template.hasResourceProperties("AWS::Events::Rule", {
      ScheduleExpression: "cron(0/2 * * * ? *)",
    });
  });
});
