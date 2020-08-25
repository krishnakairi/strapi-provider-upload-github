const { Octokit } = require("@octokit/rest");
const { getRepoUrl } = require('./../uilts');

class GitHub {
    constructor({ user, token, repo, base = 'master' }) {
        this.user = user;
        this.base = base;
        this.repo = 'awareness-assets'; // [TODO]
        this.github = new Octokit({
            auth: token
        });
    }

    async merge(branch) {
        try {
            const { data } = await this.github.pulls.create({
                owner: this.user,
                repo: this.repo,
                title: `Merge:: ${branch}`,
                head: branch,
                base: 'master',
            });
            await this.github.pulls.merge({
                owner: this.user,
                repo: this.repo,
                pull_number: data.number,
            });
        } catch (error) {
            throw {
                id: 'Upload.status.gitMergeFailure',
                message: `unable to merge ${branch} to git.`,
                values: { ...error },
            }
        }
    }
}

module.exports = GitHub;
