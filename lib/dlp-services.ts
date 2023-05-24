import { ITable } from "aws-cdk-lib/aws-dynamodb";
import { Runtime } from "aws-cdk-lib/aws-lambda";
import {
  NodejsFunction,
  NodejsFunctionProps,
} from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";
import { join } from "path";
import { companyTableAttrs, orderTableAttributes } from "./attributes";
import { IQueue } from "aws-cdk-lib/aws-sqs";
import { Effect, PolicyStatement } from "aws-cdk-lib/aws-iam";

interface DLPTableProps {
  companyTable: ITable;
  orderTable: ITable;
}

interface DLPServicesProps {
  tables: DLPTableProps;
  queue: IQueue;
}

export class DLPServices extends Construct {
  public readonly orderService: NodejsFunction;
  public readonly companyService: NodejsFunction;
  public readonly schedulerService: NodejsFunction;

  public readonly commonEnv;
  constructor(scope: Construct, id: string, props: DLPServicesProps) {
    super(scope, id);

    this.commonEnv = {
      ORDER_TABLE_PRIMARY_KEY: orderTableAttributes.primaryKey,
      ORDER_TABLE: orderTableAttributes.tableName,
      COMPANY_TABLE: companyTableAttrs.tableName,
      COMPANY_TABLE_PRIMARY_KEY: companyTableAttrs.primaryKey,
      QUEUE_URL: props.queue.queueUrl,
    };

    this.orderService = this.createOrderFunction(props.tables, this.commonEnv);
    this.companyService = this.createCompanyService(
      props.tables,
      this.commonEnv
    );
    this.schedulerService = this.createOrderSchedulerFunction(
      props.tables,
      this.commonEnv
    );

    this.orderService.addToRolePolicy(
      new PolicyStatement({
        effect: Effect.ALLOW,
        resources: [props.queue.queueArn],
        actions: ["*"],
      })
    );

    this.schedulerService.addToRolePolicy(
      new PolicyStatement({
        effect: Effect.ALLOW,
        resources: [props.queue.queueArn],
        actions: ["*"],
      })
    );
  }

  private createOrderFunction(tables: DLPTableProps, env: any): NodejsFunction {
    const nodeJsFunctionProps: NodejsFunctionProps = {
      bundling: {
        externalModules: ["aws-sdk"],
      },
      environment: {
        ...env,
      },
      runtime: Runtime.NODEJS_18_X,
    };

    const orderFunction = new NodejsFunction(this, "ordersLambdaFunction", {
      entry: join(__dirname, `../src/orders/handlers/order.ts`),
      ...nodeJsFunctionProps,
      functionName: "ordersEndpoint",
    });

    tables.companyTable.grantReadWriteData(orderFunction);
    tables.orderTable.grantReadWriteData(orderFunction);

    return orderFunction;
  }

  private createCompanyService(
    tables: DLPTableProps,
    env: any
  ): NodejsFunction {
    const nodeJsFunctionProps: NodejsFunctionProps = {
      bundling: {
        externalModules: ["aws-sdk"],
      },
      environment: {
        ...env,
      },
      runtime: Runtime.NODEJS_18_X,
    };

    const companyFunction = new NodejsFunction(this, "companyLambdaFunction", {
      entry: join(__dirname, `../src/companies/handlers/index.ts`),
      ...nodeJsFunctionProps,
      functionName: "companyEndpoint",
    });

    tables.companyTable.grantReadWriteData(companyFunction);
    tables.orderTable.grantReadWriteData(companyFunction);

    return companyFunction;
  }

  private createOrderSchedulerFunction(
    tables: DLPTableProps,
    env: any
  ): NodejsFunction {
    const nodeJsFunctionProps: NodejsFunctionProps = {
      bundling: {
        externalModules: ["aws-sdk"],
      },
      environment: {
        ...env,
      },
      runtime: Runtime.NODEJS_18_X,
    };

    const orderSchedulerFunction = new NodejsFunction(
      this,
      "orderSchedulerFunction",
      {
        entry: join(__dirname, `../src/orders/handlers/eventScheduler.ts`),
        ...nodeJsFunctionProps,
        functionName: "orderSchedulerEventFunction",
      }
    );

    tables.companyTable.grantReadWriteData(orderSchedulerFunction);
    tables.orderTable.grantReadWriteData(orderSchedulerFunction);

    return orderSchedulerFunction;
  }
}
