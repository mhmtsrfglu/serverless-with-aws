import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { DLPDynamodbTables } from './dlp-tables';
import { DLPServices } from './dlp-services';
import { DLPAPIGateway } from './dlp-api-gateway';
import { DLPQueues } from './dlp-queues';
import { DLPEventSchduler } from './dlp-eventbridge-scheduler';

export class DonutLockerPlatformStack extends cdk.Stack {

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const tables = new DLPDynamodbTables(this, "DLPDynamodbTables", {})

    const queues = new DLPQueues(this,"DLPQueues")

    const services = new DLPServices(this, "DLPServices", {
      tables:{
        orderTable: tables.orderTable,
        companyTable: tables.companyTable
      },
      queue: queues.orderQueue
    })

    const gateways = new DLPAPIGateway(this, "DLPAPIGateway", {
      orderService: services.orderService,
      companyService: services.companyService
    })

    const rules = new DLPEventSchduler(this,"DLPEventSchduler",{
      target:services.schedulerService
    })

   

  }
}
