import { cdk, JsonPatch } from "projen";
import { JsiiProjectOptions } from "projen/lib/cdk";
import { NpmAccess } from "projen/lib/javascript";
import { MergeQueue } from "./projenrc/merge-queue";

const project = new cdk.JsiiProject({
  author: "AWS",
  authorAddress: "aws-cdk-dev@amazon.com",
  defaultReleaseBranch: "main",
  name: "@projen/canary-package",
  projenrcTs: true,
  release: true,
  repositoryUrl: "https://github.com/projen/canary-testing.git",
  prettier: true,
  jsiiVersion: "5.9.x",
  typescriptVersion: "5.9.x",
  workflowNodeVersion: "24.x",
  autoApproveUpgrades: true,
  autoApproveOptions: {
    allowedUsernames: ["cdklabs-automation", "dependabot[bot]"],
  },
  githubOptions: {
    mergify: false,
    pullRequestBackport: true,
    pullRequestBackportOptions: {
      branches: ["v1"],
    },
  },
  peerDeps: ["constructs@^10.0.0"],
  peerDependencyOptions: {
    pinnedDevDependency: false,
  },
  releaseEnvironment: "npm",
  npmAccess: NpmAccess.PUBLIC,
  publishToPypi: {
    trustedPublishing: true,
    distName: "projen.canary-package",
    module: "projen.canary_package",
    githubEnvironment: "release",
  },
  // publishToMaven: {
  //   javaPackage: "io.github.cdklabs.projen_canary_package",
  //   mavenGroupId: "io.github.cdklabs",
  //   mavenArtifactId: "projen_canary_package",
  //   mavenEndpoint: "https://s01.oss.sonatype.org",
  // },
} satisfies JsiiProjectOptions);

new MergeQueue(project, {
  mergeBranch: "main",
  autoMergeOptions: {
    labels: ["auto-approve"],
  },
});

// remove npm token
project.github
  ?.tryFindWorkflow("release")
  ?.file?.patch(JsonPatch.remove("/jobs/release_npm/steps/9/env/NPM_TOKEN"));

// fix java version
// const javaVersion = "11";
// project.github?.tryFindWorkflow("build")?.file?.patch(
//   JsonPatch.replace("/jobs/package-java/steps/0/with", {
//     distribution: "corretto",
//     "java-version": javaVersion,
//   }),
// );
// project.github?.tryFindWorkflow("release")?.file?.patch(
//   JsonPatch.replace("/jobs/release_maven/steps/0/with", {
//     distribution: "corretto",
//     "java-version": javaVersion,
//   }),
// );

project.gitignore?.addPatterns("!vendor/*");

project.synth();
