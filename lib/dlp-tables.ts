import { RemovalPolicy } from "aws-cdk-lib";
import {
  AttributeType,
  BillingMode,
  ITable,
  Table,
} from "aws-cdk-lib/aws-dynamodb";
import { Construct } from "constructs";
import { companyTableAttrs, orderTableAttributes } from "./attributes";

interface DLPDynamodbTablesProps {}

export class DLPDynamodbTables extends Construct {
  public readonly orderTable: ITable;
  public readonly companyTable: ITable;

  constructor(scope: Construct, id: string, props: DLPDynamodbTablesProps) {
    super(scope, id);
    this.orderTable = this.createOrderTable();
    this.companyTable = this.createCompanyTable();
  }

  private createOrderTable(): ITable {
    const table = new Table(this, orderTableAttributes.serviceName, {
      partitionKey: {
        name: orderTableAttributes.primaryKey,
        type: orderTableAttributes.primaryKeyType,
      },
      tableName: orderTableAttributes.tableName,
      removalPolicy: RemovalPolicy.DESTROY,
      billingMode: BillingMode.PAY_PER_REQUEST,
    });

    table.addGlobalSecondaryIndex({
      indexName: "order-table-company-id-gsi",
      partitionKey:{
        name:"companyId",
        type: AttributeType.STRING
      },
    })

    table.addGlobalSecondaryIndex({
      indexName: "order-table-item-type-gsi",
      partitionKey:{
        name:"recordType",
        type:AttributeType.STRING
      }
    })

    table.addGlobalSecondaryIndex({
      indexName: "order-table-delivery-date-gsi",
      partitionKey:{
        name: "deliveryDate",
        type: AttributeType.STRING
      },
      sortKey:{
        name: "createdAt",
        type: AttributeType.STRING
      }
    })

    return table
  }

  private createCompanyTable(): ITable {
    return new Table(this, companyTableAttrs.serviceName, {
      partitionKey: {
        name: companyTableAttrs.primaryKey,
        type: companyTableAttrs.primaryKeyType,
      },
      tableName: companyTableAttrs.tableName,
      removalPolicy: RemovalPolicy.DESTROY,
      billingMode: BillingMode.PAY_PER_REQUEST,
    });
  }
}
