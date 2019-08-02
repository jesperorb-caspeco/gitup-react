import { exec } from "child_process";
import { Extension, extensions, workspace } from "vscode";

interface IGit {
  readonly path: string;
}

export interface IGitAPI {
  readonly git: IGit;
  readonly repositories: any;
  readonly onDidOpenRepository: any;
  readonly onDidCloseRepository: any;
}

export class Git {
  public static PRETTY_LOG = `log --since="1 day" dev --pretty="format:{ \\"author\\": \\"%an\\", \\"date\\": \\"%ad\\", \\"body\\": \\"%f\\" },"`;
  public static NUM_LOG = `log --numstat --since="7 days" --pretty="format:SEPARATOR" dev`;
  public static CURRENT_USER = `config user.name`;

  public static async run(gitCommand: string): Promise<string> {
    const workspacePath = workspace.rootPath || "";
    const cmd = `git -C "${workspacePath}" ${gitCommand}`;
    return new Promise((resolve, reject) => {
      exec(
        cmd,
        { maxBuffer: 1024 * 50 * 1000 },
        (err: any, stdout: string, stderr: string) => {
          if (err) {
            return reject(err);
          }
          if (stderr) {
            return reject(stderr);
          }
          return resolve(stdout);
        }
      );
    });
  }

  public static async getBuiltInGitApi(): Promise<IGitAPI | undefined> {
    try {
      const extension = extensions.getExtension("vscode.git") as Extension<any>;
      if (extension !== undefined) {
        const gitExtension = extension.isActive
          ? extension.exports
          : await extension.activate();

        return gitExtension.getAPI(1);
      }
    } catch {
      return undefined;
    }
    return undefined;
  }
}
