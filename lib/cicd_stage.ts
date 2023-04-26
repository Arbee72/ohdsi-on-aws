import * as cdk from 'aws-cdk-lib';
import { Construct } from "constructs";

export class PipelineStage extends cdk.Stage {
    
    constructor(scope : Construct, id : string, stageName: string, props? : cdk.StackProps) {
        super(scope, id, props);

        //const myVPCStack = new VPCStack(this, "VPCStack", stageName);
    }

}