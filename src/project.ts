import { typescript } from "projen";

/**
 * Creates a custom TypeScript Project
 *
 * @pjid custom-ts-project
 */
export class CustomTypeScriptProject extends typescript.TypeScriptProject {
  constructor(options: typescript.TypeScriptProjectOptions) {
    super({
      prettier: true,
      ...options,
    });
  }
}
