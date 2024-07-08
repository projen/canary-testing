import { CustomTypeScriptProject } from "../src";

test("CustomTypeScriptProject", () => {
  const project = new CustomTypeScriptProject({
    name: "test",
    defaultReleaseBranch: "main",
  });

  expect(project.prettier).toBeDefined();
});
