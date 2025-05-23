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
  jsiiVersion: "5.4.x",
  typescriptVersion: "5.4.x",
  jestOptions: {
    jestVersion: "^29",
  },
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
  npmAccess: NpmAccess.PUBLIC,
  publishToMaven: {
    javaPackage: "io.github.cdklabs.projen_canary_package",
    mavenGroupId: "io.github.cdklabs",
    mavenArtifactId: "projen_canary_package",
    mavenEndpoint: "https://s01.oss.sonatype.org",
  },
} satisfies JsiiProjectOptions);

const label = "backport-to-";
const cond =
  "github.event.pull_request.merged && !(contains(github.event.pull_request.labels.*.name, 'backport'))";
project.github?.tryFindWorkflow("backport")?.file?.patch(
  JsonPatch.add("/jobs/backport/if", cond),
  JsonPatch.add("/jobs/backport/steps/0", {
    id: "check_labels",
    name: "Check for backport labels",
    run: [
      "labels='${{ toJSON(github.event.pull_request.labels.*.name) }}'",
      `matched=$(echo $labels | jq '.|map(select(startswith("${label}"))) | length')`,
      'echo "matched=$matched"',
      'echo "matched=$matched" >> $GITHUB_OUTPUT',
    ].join("\n"),
  }),
  JsonPatch.add(
    "/jobs/backport/steps/1/if",
    "fromJSON(steps.check_labels.outputs.matched) > 0",
  ),
);

new MergeQueue(project, {
  mergeBranch: "main",
  autoMergeOptions: {
    labels: ["auto-approve"],
  },
});

// fix java version
const javaVersion = "11";
project.github?.tryFindWorkflow("build")?.file?.patch(
  JsonPatch.replace("/jobs/package-java/steps/0/with", {
    distribution: "corretto",
    "java-version": javaVersion,
  }),
);
project.github?.tryFindWorkflow("release")?.file?.patch(
  JsonPatch.replace("/jobs/release_maven/steps/0/with", {
    distribution: "corretto",
    "java-version": javaVersion,
  }),
);

project.gitignore?.addPatterns("!vendor/*");

project.synth();
