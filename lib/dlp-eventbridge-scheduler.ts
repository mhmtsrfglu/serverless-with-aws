import { Rule, Schedule } from "aws-cdk-lib/aws-events";
import { LambdaFunction } from "aws-cdk-lib/aws-events-targets";
import { NodejsFunction, NodejsFunctionProps } from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";

interface IDLPEventSchduler{
    target: NodejsFunction
}

export class DLPEventSchduler extends Construct{

    public readonly sqsLambdaEventSchduler:Rule;

    constructor(scope:Construct,id:string,props:IDLPEventSchduler){
        super(scope,id)
        this.sqsLambdaEventSchduler = this.createScheduler(props.target)
    }

    private createScheduler(target:NodejsFunction) {
        const rules = new Rule(this, "dailyRule", {
            schedule: Schedule.cron({ minute: "0/2"}),
        });

        rules.addTarget(new LambdaFunction(target))

        return rules
    }
}