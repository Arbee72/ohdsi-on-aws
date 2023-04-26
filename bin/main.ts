#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import {VPCStack} from "../lib/vpc";
import {S3Stack} from "../lib/s3";
import {ECSStack} from "../lib/ecs";
import {RDSStack} from "../lib/rds";
//import { OhdsiOnAwsStack } from '../lib/ohdsi-on-aws-stack';

import console = require("console");

const app = new cdk.App();

const account = app.node.tryGetContext("account");
const region = app.node.tryGetContext("region");
const tagname = app.node.tryGetContext("tagName");
const tagvalue = app.node.tryGetContext("tagValue");


const myVPCStack = new VPCStack(app, "myVPCStack", {
  env: { account: account, region: region },
  stackName: "ohdsi-VPCStack"
});
cdk.Tags.of(myVPCStack).add(tagname,tagvalue);

const myS3Stack = new S3Stack(app, "myS3Stack", {
  env: { account: account, region: region },
  stackName: "ohdsi-S3Stack"
});
cdk.Tags.of(myS3Stack).add(tagname,tagvalue);

const myRDSStack = new RDSStack(app, "myRDSStack", {
  env: { account: account, region: region },
  stackName: "ohdsi-RDSStack",
  logBucket: myS3Stack.logBucket, //dependent on S3Stack
  vpc: myVPCStack.VPC, //dependent on VPCStack
});
cdk.Tags.of(myRDSStack).add(tagname, tagvalue);

const myECSStack = new ECSStack(app, "myECSStack", {
  env: { account: account, region: region },
  stackName: "ohdsi-ECSStack",
  logBucket: myS3Stack.logBucket, //dependent on S3Stack
  vpc: myVPCStack.VPC, //dependent on VPCStack
});
cdk.Tags.of(myECSStack).add(tagname, tagvalue);

const currentdate = new Date();
var datetime = currentdate.getDate() + "/"
                + (currentdate.getMonth()+1)  + "/" 
                + currentdate.getFullYear() + " @ "  
                + currentdate.getHours() + ":"  
                + currentdate.getMinutes() + ":" 
                + currentdate.getSeconds();

console.log("DEPLOY START TIME: " + datetime);
