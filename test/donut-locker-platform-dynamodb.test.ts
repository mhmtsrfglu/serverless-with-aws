import * as cdk from "aws-cdk-lib";
import { Template } from "aws-cdk-lib/assertions";
import * as DonutLockerPlatform from "../lib/donut-locker-platform-stack";
import { BillingMode } from "aws-cdk-lib/aws-dynamodb";

describe("Test DynamoDB", () => {
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

  test("Table count should be 2.",() => {
    template.resourceCountIs("AWS::DynamoDB::Table", 2);
  })

  test("Table Companies created.",() => {
    template.hasResourceProperties("AWS::DynamoDB::Table", {
      TableName: "Companies",
    });
  })

  test("Table Orders created.",() => {
    template.hasResourceProperties("AWS::DynamoDB::Table", {
      TableName: "Orders",
    });
  })

  test("Table Orders BillingMode Per Request.",() => {
    template.hasResourceProperties("AWS::DynamoDB::Table", {
      BillingMode: BillingMode.PAY_PER_REQUEST,
    });
  })
  
});
