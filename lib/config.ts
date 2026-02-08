// lib/config.ts
export const accounts = {
  dev: {
    account: '026885593400',
    region: 'ap-northeast-1',
  },
    stg: {
    account: '026885593400',
    region: 'ap-northeast-3',
  },
};

export const github = {
  owner: 'koiruTarou',
  repo: 'cdk-pipeline-sample',
  branch: 'main',
  tokenSecretName: 'github-token-cdk-pipeline-sample-key',
  tokenkey:'token'
};