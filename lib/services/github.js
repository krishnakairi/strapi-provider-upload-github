const { Octokit } = require("@octokit/rest");
const { getRepoName } = require("./../uilts");

class GitHub {
  constructor({ user, token, repo, base = "master" }) {
    this.user = user;
    this.base = base;
    this.repo = getRepoName(repo);
    this.github = new Octokit({
      auth: token,
    });
  }

  /**
   * create pull request branch -> base
   * merge created pull request
   * @param {*} branch string
   */
  async merge(branch) {
    try {
      const { data } = await this.github.pulls.create({
        owner: this.user,
        repo: this.repo,
        title: `Merge:: ${branch}`,
        head: branch,
        base: this.base,
      });
      await this.github.pulls.merge({
        owner: this.user,
        repo: this.repo,
        pull_number: data.number,
      });
    } catch (error) {
      throw {
        id: "Upload.status.gitMergeFailure",
        message: `unable to merge ${branch} to git.`,
        values: { ...error },
      };
    }
  }
}

module.exports = GitHub;
