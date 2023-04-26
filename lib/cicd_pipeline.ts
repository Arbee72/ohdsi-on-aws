import * as cdk from 'aws-cdk-lib';
import * as pipelines from "aws-cdk-lib/pipelines";
import { PipelineStage } from './cicd_stage';

export class CICDPipelineStack extends cdk.Stack {

    //public readonly VPC : ec2.Vpc;
    //public readonly rdsEP : ec2.InterfaceVpcEndpoint;

    constructor(scope : cdk.App, id : string, props : cdk.StackProps) {
        super(scope, id, props);

        
        const pipeline = new pipelines.CodePipeline(this, "Pipeline", {
            pipelineName: "CDK-Pipeline",
            synth: new pipelines.ShellStep('Synth', {
                input: pipelines.CodePipelineSource.gitHub('Arbee72/ohdsi-on-aws','main'),
                commands:[
                    'npm ci',
                    'npm run build',
                    'npx cdk synth'
                ]
            })
        });

        const testingStage = pipeline.addStage(new PipelineStage(this, "testingStage", "test", {
            env: { account: this.node.tryGetContext("account"), region: this.node.tryGetContext("region")}
        }));
        //cdk.Tags.of(testingStage).add(this.node.tryGetContext("tagName"),this.node.tryGetContext("tagValue"));

        //testingStage.addPost(new pipelines.ManualApprovalStep('Manual approval before deploying in Production'));

        /*const prodStage = pipeline.addStage(new PipelineStage(this, "prodStage", "prod", {
            env: { account: this.node.tryGetContext("account"), region: this.node.tryGetContext("region")}
        })); */
        
    }
}