import * as cdk from 'aws-cdk-lib';
import * as s3 from "aws-cdk-lib/aws-s3";
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment';

export class S3Stack extends cdk.Stack {

    public readonly logBucket : s3.Bucket;

    constructor(scope : cdk.App, id : string, props : cdk.StackProps) {
        super(scope, id, props);

    //the bucket used for logging
    const logBucket = new s3.Bucket(
        this, 
        "logBucket", {
        bucketName: this.node.tryGetContext("namePrefix") + "-log-bucket-" + genRandonString(10),
        versioned: false,
        removalPolicy: cdk.RemovalPolicy.DESTROY,
        autoDeleteObjects: true,
        accessControl: s3.BucketAccessControl.PRIVATE,
        eventBridgeEnabled: true,
        encryption: s3.BucketEncryption.S3_MANAGED
    });
    
    this.logBucket = logBucket;

    }
}

function genRandonString(length: number) {
   var chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
   var charLength = chars.length;
   var result = '';
   for ( var i = 0; i < length; i++ ) {
      result += chars.charAt(Math.floor(Math.random() * charLength));
   }
   return result;
}