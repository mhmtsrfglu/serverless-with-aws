import { Duration } from "aws-cdk-lib";
import { IFunction } from "aws-cdk-lib/aws-lambda";
import { SqsEventSource } from "aws-cdk-lib/aws-lambda-event-sources";
import { IQueue, Queue } from "aws-cdk-lib/aws-sqs";
import { Construct } from "constructs";

interface DLPQueuesProps{
}

export class DLPQueues extends Construct{

    public readonly orderQueue:IQueue

    constructor(scope:Construct,id:string){
        super(scope,id)
        this.orderQueue = this.createOrderQueue() 
    }

    private createOrderQueue(){
        return new Queue(this,"OrderQueue",{
            queueName: "OrderQueue.fifo",
            visibilityTimeout: Duration.seconds(30),
            fifo:true,
            contentBasedDeduplication:true,
        })
    }
}