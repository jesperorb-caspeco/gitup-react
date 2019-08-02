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
  public static PRETTY_LOG = `log --since="1 week ago" dev --pretty="format:{ \\"author\\": \\"%an\\", \\"date\\": \\"%ad\\", \\"body\\": \\"%f\\" },"`;
  public static NUM_LOG = `log --numstat --since="1 week ago" --pretty="format:SEPARATOR"`;
  public static CURRENT_USER = `config user.name`;
  public static DEFAULT_BRANCH = `dev`;

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

  public static async getStats(){
    const userStats = await Git.getCurrentUserStats();
    const totalStats = await Git.getTotalStats();
    const devTotalStats = await Git.getDevBranchTotalStats();
    const devUserStats = await Git.getDevBranchUserStats();
    return {
      devTotalStats,
      devUserStats,
      totalStats,
      userStats,
    }
  }

  public static async getCurrentUserStats() {
    const currentUser = await Git.run(Git.CURRENT_USER);
    const trimmedUser = currentUser.replace(/\n/g, "");
    const userCmd = `${Git.NUM_LOG} --author="${trimmedUser}"`;
    const userStats = await Git.run(userCmd);
    return userStats;
  }

  public static async getTotalStats() {
    const totalStats = await Git.run(Git.NUM_LOG);
    return totalStats;
  }

  public static async getDevBranchTotalStats(){
    const devCmd = `${Git.NUM_LOG} ${Git.DEFAULT_BRANCH}`;
    const devTotalStats = await Git.run(devCmd);
    return devTotalStats;
  }

  public static async getDevBranchUserStats(){
    const currentUser = await Git.run(Git.CURRENT_USER);
    const trimmedUser = currentUser.replace(/\n/g, "");
    const devCmd = `${Git.NUM_LOG} --author="${trimmedUser}" ${Git.DEFAULT_BRANCH}`;
    const devTotalStats = await Git.run(devCmd);
    return devTotalStats;
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
