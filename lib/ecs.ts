import * as cdk from 'aws-cdk-lib';
import * as ecs from "aws-cdk-lib/aws-ecs";
import * as ecsPatterns from "aws-cdk-lib/aws-ecs-patterns";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as s3 from "aws-cdk-lib/aws-s3";

export interface EcsStackProps extends cdk.StackProps {
    logBucket : s3.Bucket;
    vpc: ec2.Vpc;
};

export class ECSStack extends cdk.Stack {

    public readonly cluster : ecs.Cluster;

    constructor(scope : cdk.App, id : string, props : EcsStackProps) {
        super(scope, id, props);

        //ECS cluster definition
        const cluster = new ecs.Cluster(this, "cluster", {
            clusterName: this.node.tryGetContext("-cluster"),
            vpc: props.vpc
        }
    );

    this.cluster = cluster;

    const loadBalancedFargateService = new ecsPatterns.ApplicationLoadBalancedFargateService(this, 'loadBalancedFargateService', {
        cluster,
        memoryLimitMiB: this.node.tryGetContext("taskMemoryMB"),
        desiredCount: this.node.tryGetContext("taskCount"),
        cpu: this.node.tryGetContext("taskCPU"),
        taskImageOptions: {
          image: ecs.ContainerImage.fromRegistry(this.node.tryGetContext("registryHelloImage"))
        },
        loadBalancerName: this.node.tryGetContext("namePrefix") + "-alb",
      });

    }
}