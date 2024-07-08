import { cdk } from "projen";
const project = new cdk.JsiiProject({
  author: "AWS",
  authorAddress: "aws-cdk-dev@amazon.com",
  defaultReleaseBranch: "main",
  name: "@projen/canary-testing",
  projenrcTs: true,
  release: false,
  repositoryUrl: "https://github.com/projen/canary-testing.git",
  prettier: true,
  jsiiVersion: "5.4.x",
  typescriptVersion: "5.4.x",
  jestOptions: {
    jestVersion: "^29",
  },
  peerDeps: ["constructs@^10.0.0", "projen@0.x >=0.75.0"],
  peerDependencyOptions: {
    pinnedDevDependency: false,
  },
  publishToMaven: {
    javaPackage: "io.github.cdklabs.projen_canary_testing",
    mavenGroupId: "io.github.cdklabs",
    mavenArtifactId: "projen_canary_testing",
    mavenEndpoint: "https://s01.oss.sonatype.org",
  },
});
project.synth();
