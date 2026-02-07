import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { CodePipeline, CodePipelineSource, ShellStep } from 'aws-cdk-lib/pipelines';
import * as secretsmanager from 'aws-cdk-lib/aws-secretsmanager';
import { AppStack } from './app-stack';
import { accounts } from './config';
import { github } from './config';

export class PipelineStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    const githubToken = secretsmanager.Secret.fromSecretNameV2(this, 'GitHubToken', github.tokenSecretName);

    const pipeline = new CodePipeline(this, 'Pipeline', {
      pipelineName: 'CdkPipelineSample',
      synth: new ShellStep('Synth', {
        input: CodePipelineSource.gitHub(`${github.owner}/${github.repo}`,
          github.branch, {
          authentication: githubToken.secretValueFromJson('token'),
        }),

        commands: [
          'npm ci',
          'npm run build',
          'npx cdk synth',
        ],
      }),
    });


    class AppStage extends cdk.Stage {
      constructor(scope: Construct, id: string, props?: cdk.StageProps) {
        super(scope, id, props);

        new AppStack(this, 'AppStack', {
          stageName: id,   // ← ステージ名をそのまま渡す
          env: props?.env,
        });
      }
    }
    pipeline.addStage(new AppStage(this, 'Dev', {
      env: accounts.dev,
    }));
  }
}

