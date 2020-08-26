const uuid = require("uuid");
const Git = require("./services/git");
const GitHub = require("./services/github");
const { publicUrl, getDataFromUrl } = require("./uilts");

module.exports = {
  init(config) {
    // Init Git Bash Client
    const git = new Git({
      user: config.user,
      token: config.token,
      repo: config.repo,
      emptyBranch: config.emptyBranch,
      publicBaseUrl: config.publicBaseUrl,
      sizeLimit: config.sizeLimit,
    });

    // Init GitHub Rest Client
    const github = new GitHub({
      user: config.user,
      token: config.token,
      repo: config.repo,
      base: config.baseBranch,
    });

    return {
      /**
       * Upload file to GitHub
       * @param {*} file
       * @param {*} customParams
       */
      async upload(file, customParams = {}) {
        try {
          const branch = uuid.v4();
          await git.add(branch, file);
          await github.merge(branch);
          file.url = publicUrl(config.publicBaseUrl, branch, file);
        } catch (err) {
          throw strapi.errors.badRequest("GitHubProvider", {
            errors: [err],
          });
        }
      },

      /**
       * Delete file from GitHub
       * @param {*} file
       * @param {*} customParams
       */
      async delete(file, customParams = {}) {
        try {
          const { branch, fileName } = getDataFromUrl(file.url); 
          await git.remove(branch, fileName);
          await github.merge(branch);
          return true;
        } catch (err) {
          throw strapi.errors.badRequest("GitHubProvider", {
            errors: [err],
          });
        }
      },
    };
  }
};
