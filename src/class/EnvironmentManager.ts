import * as dotenv from 'dotenv';
dotenv.config();
/**
 *Manages the environment variables necessary for the application. Loads environment  variables from the .env file and checks that all required variables are defined.
 */
export class EnvironmentManager {
  private requiredVariables: string[] = [];
  private missingVariables: string[];
  /**
   * Add a list of variables that your application needs, when starting the class, it will check if all your variables exist, if not, an error will appear showing which variables should be added
   * @param requiredVariables list of necessary variables.
   * @type {requiredVariables:string[]}
   * @example  const environmentManager = new EnvironmentManager(['API_KEY']);

   */
  constructor(requiredVariables: string[] = []) {
    if (requiredVariables) this.requiredVariables = requiredVariables;
    this.missingVariables = [];

    this.loadVariables();
  }
  /**
   * Gets the value of an environment variable.
   * @param key The environment variable key.
   * @returns The value of the environment variable.
   * @example EnvironmentManager.getValue('API_KEY')
   */
  static getValue(key: string): string {
    return process.env[key] ?? '';
  }
  private loadVariables(): void {
    dotenv.config();

    this.requiredVariables.forEach((variable: any) => {
      if (!(variable in process.env)) {
        this.missingVariables.push(variable);
      }
    });
    if (!this.checkRequiredVariables()) {
      throw new Error(
        `Required environment variables were not set: ${this.missingVariables}`
      );
    }
    console.log('Loaded environment variables');
  }

  private checkRequiredVariables(): boolean {
    return this.missingVariables.length === 0;
  }
}
