import { AttributeType } from "aws-cdk-lib/aws-dynamodb";

interface ITableAttributes { primaryKey: string, primaryKeyType: AttributeType, tableName: string, serviceName:string }

export const orderTableAttributes: ITableAttributes = {
    tableName: "Orders",
    primaryKey: "id",
    primaryKeyType: AttributeType.STRING,
    serviceName: "OrderTable"
}

export const companyTableAttrs: ITableAttributes = {
    tableName: "Companies",
    primaryKeyType: AttributeType.STRING,
    primaryKey: "id",
    serviceName: "CompanyTable"
}