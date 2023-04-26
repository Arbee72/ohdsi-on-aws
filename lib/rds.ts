import * as cdk from 'aws-cdk-lib';
import * as rds from "aws-cdk-lib/aws-rds";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as s3 from "aws-cdk-lib/aws-s3";
import { version } from 'os';
import { ClusterParameterGroup } from 'aws-cdk-lib/aws-docdb';

export interface RdsStackProps extends cdk.StackProps {
    logBucket : s3.Bucket;
    vpc: ec2.Vpc;
};

export class RDSStack extends cdk.Stack {

    public readonly rds_cluster : rds.DatabaseCluster;

    constructor(scope : cdk.App, id : string, props : RdsStackProps) {
        super(scope, id, props);

        //ECS cluster definition
        const clusterPassword = rds.Credentials.fromGeneratedSecret(this.node.tryGetContext("auroraClusterAdmin"));
        const rdsCluster = new rds.DatabaseCluster(this, "rdsCluster", {
            engine: rds.DatabaseClusterEngine.auroraPostgres({version: rds.AuroraPostgresEngineVersion.VER_12_11 }),
            credentials: clusterPassword,
            defaultDatabaseName: this.node.tryGetContext("auroraDefaultDatabase"),
            instanceProps: {
                instanceType: ec2.InstanceType.of(ec2.InstanceClass.R6G, ec2.InstanceSize.LARGE),
                vpcSubnets: {
                    subnetType: ec2.SubnetType.PUBLIC,
                },
                vpc: props.vpc
            }         
        });

        new cdk.CfnOutput(this, 'DB-CLuster-Name', { value: rdsCluster.clusterIdentifier });
        new cdk.CfnOutput(this, 'DB-CLuster-Endpoint', { value: rdsCluster.clusterEndpoint.hostname });
        new cdk.CfnOutput(this, 'DB-CLuster-Port', { value: rdsCluster.clusterEndpoint.port.toString() });
        new cdk.CfnOutput(this, 'DB-CLuster-Password', { value: JSON.stringify(clusterPassword) });
        

        this.rds_cluster= rdsCluster;

        

    }
}