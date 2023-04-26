import * as cdk from 'aws-cdk-lib';
import * as ec2 from "aws-cdk-lib/aws-ec2";


export class VPCStack extends cdk.Stack {

    public readonly VPC : ec2.Vpc;
    public readonly rdsEP : ec2.InterfaceVpcEndpoint;

    constructor(scope : cdk.App, id : string, props : cdk.StackProps) {
        super(scope, id, props);

        const subnetPrivate: ec2.SubnetConfiguration = {
            name: this.node.tryGetContext("namePrefix") + "-Private",
            subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
            cidrMask: 24
        }

        const subnetPublic: ec2.SubnetConfiguration = {
            name: this.node.tryGetContext("namePrefix") + "-Public",
            subnetType: ec2.SubnetType.PUBLIC,
            cidrMask: 24
        }


        const vpc = new ec2.Vpc(
            this, 
            this.node.tryGetContext("namePrefix") + "-vpc",
            {
                maxAzs: 3,
                ipAddresses: ec2.IpAddresses.cidr(this.node.tryGetContext("cidrRange")),
                subnetConfiguration: [subnetPrivate, subnetPublic],
                natGatewayProvider: ec2.NatProvider.gateway(),
                natGateways: 1
            }
        )

        new cdk.CfnOutput(this, 'ServiceAccountIamRole', { value: ("VPC ARN: " + vpc.vpcArn) });

        this.VPC = vpc;

        //RDS Endpoint
        const rdsEndpoint = new ec2.InterfaceVpcEndpoint(this, "rdsEndpoint", {
            vpc: vpc,
            service: ec2.InterfaceVpcEndpointAwsService.RDS,
            privateDnsEnabled: true,
            subnets: {
                availabilityZones: vpc.availabilityZones
            }
        });

        this.rdsEP = rdsEndpoint;

    }

}
