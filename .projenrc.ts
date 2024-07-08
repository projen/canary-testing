import { cdk } from "projen";
import { MergeQueue } from "./src";

const project = new cdk.JsiiProject({
  author: "AWS",
  authorAddress: "aws-cdk-dev@amazon.com",
  defaultReleaseBranch: "main",
  name: "@projen/canary-package",
  projenrcTs: true,
  release: true,
  repositoryUrl: "https://github.com/projen/canary-testing.git",
  prettier: true,
  jsiiVersion: "5.4.x",
  typescriptVersion: "5.4.x",
  jestOptions: {
    jestVersion: "^29",
  },
  autoApproveUpgrades: true,
  autoApproveOptions: {
    allowedUsernames: ['cdklabs-automation', 'dependabot[bot]'],
  },
  githubOptions: {
    mergify: false,
  },
  peerDeps: ["constructs@^10.0.0", "projen@0.x >=0.75.0"],
  peerDependencyOptions: {
    pinnedDevDependency: false,
  },
  publishToMaven: {
    javaPackage: "io.github.cdklabs.projen_canary_package",
    mavenGroupId: "io.github.cdklabs",
    mavenArtifactId: "projen_canary_package",
    mavenEndpoint: "https://s01.oss.sonatype.org",
  },
});

new MergeQueue(project, {
  mergeBranch: "main",
  autoMergeOptions: {
    labels: ['auto-approve']
  }
});

project.synth();
