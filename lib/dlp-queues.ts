import { Duration } from "aws-cdk-lib";
import { IQueue, Queue } from "aws-cdk-lib/aws-sqs";
import { Construct } from "constructs";

export const VISIBILITY_TIMEOUT:number = 20

export class DLPQueues extends Construct{

    public readonly orderQueue:IQueue

    constructor(scope:Construct,id:string){
        super(scope,id)
        this.orderQueue = this.createOrderQueue() 
    }

    private createOrderQueue(){
        return new Queue(this,"OrderQueue",{
            queueName: "OrderQueue.fifo",
            visibilityTimeout: Duration.seconds(VISIBILITY_TIMEOUT),
            fifo:true,
            contentBasedDeduplication:true,
        })
    }
}