import * as cdk from "aws-cdk-lib";
import { Template } from "aws-cdk-lib/assertions";
import * as DonutLockerPlatform from "../lib/donut-locker-platform-stack";

// example test. To run these tests, uncomment this file along with the
// example resource in lib/donut-locker-platform-stack.ts
describe("Test Lambda Service", () => {
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

  test("Lambda Function Created", () => {
    template.hasResourceProperties("AWS::Lambda::Function", {
    });
  });

  test("Lambda function count should be 3.",() => {
    template.resourceCountIs("AWS::Lambda::Function", 3);
  })

  test("Lambda Function Created Node Version 18", () => {
    template.hasResourceProperties("AWS::Lambda::Function", {
      Runtime: "nodejs18.x",
      Handler: "index.handler"
    });
  });

  test("Lambda Function created for OrderEndpoint", () => {
    template.hasResourceProperties("AWS::Lambda::Function", {
      FunctionName: "ordersEndpoint",
    });
  });

  test("Lambda Function created for CompanyEndpoint", () => {
    template.hasResourceProperties("AWS::Lambda::Function", {
      FunctionName: "companyEndpoint",
    });
  });

  test("Lambda Function created for OrderSchedulerEventFunction", () => {
    template.hasResourceProperties("AWS::Lambda::Function", {
      FunctionName: "orderSchedulerEventFunction",
    });
  });
});
