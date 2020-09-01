const os = require('os');
const _ = require('lodash');
const fs = require('fs-extra');
const path = require('path');
const uuid = require('uuid');
const simpleGit = require('simple-git');
const { getRepoUrl } = require('../uilts');

class Git {
  constructor({
    user,
    token,
    repo,
    emptyBranch,
    sizeLimit = 1000000,
  }) {
    this.user = user;
    this.repo = getRepoUrl(user, token, repo);
    this.emptyBranch = emptyBranch;
    this.sizeLimit = sizeLimit;
  }

  /**
   * Create temp dir - to checkout git branch
   * return simple-git instance
   */
  gitInstance() {
    this.repoName = uuid.v4();
    this.path = path.resolve(os.tmpdir());
    fs.ensureDirSync(path.join(this.path, `/${this.repoName}`));
    return simpleGit({
      baseDir: path.join(this.path, `/${this.repoName}`),
      binary: 'git',
      maxConcurrentProcesses: 6,
    });
  }

  /**
   * add file and push to given branch
   * @param {*} branch string
   * @param {*} file strapi file
   */
  async add(branch, file) {
    try {
      this.git = this.gitInstance();
      await this.git.init();
      await this.git.addRemote('origin', this.repo);
      await this.git.fetch('origin', this.emptyBranch);
      await this.git.checkout(this.emptyBranch);
      await this.git.checkoutLocalBranch(branch);

      this.verifySize(file);
      await this.writeFileToLocal(branch, file);

      await this.git.add('./*');
      await this.git.commit(`add-file:: ${file.name}`);
      await this.git.push('origin', branch);
    } catch (err) {
      throw {
        id: _.get(err, 'id', 'Upload.status.unableToAdd'),
        message: _.get(err, 'message', `unable to add ${file.name} file to git.`),
        values: { file: file.name, ..._.get(error, 'values', {}) },
      };
    }
    // finally remove temp folder
    await this.removeTempPath();
  }

  /**
   * writes file to temp dir
   * @param {*} branch string
   * @param {*} file strapi file
   */
  async writeFileToLocal(branch, file) {
    try {
      await fs.ensureDir(path.join(this.path, `/${this.repoName}/${branch}`));
      const filePath = path.join(
        this.path,
        `/${this.repoName}/${branch}/${file.hash}${file.ext}`
      );
      await fs.writeFile(filePath, file.buffer);
    } catch (err) {
      throw {
        id: 'Upload.status.writeFileFailure',
        message: `unable to write temp ${file.name} file!`,
        values: { ...err },
      };
    }
  }

  /**
   * file size verification
   * @param {*} file strapi file
   */
  verifySize(file) {
    if (file.size > this.sizeLimit) {
      throw {
        id: 'Upload.status.sizeLimit',
        message: `${file.name} file is bigger than limit size!`,
        values: {},
      };
    }
  }

  /**
   * remove file from branch
   * @param {*} branch string
   * @param {*} fileName string
   */
  async remove(branch, fileName) {
    try {
      this.git = this.gitInstance();
      await this.git.init();
      await this.git.addRemote('origin', this.repo);
      await this.git.fetch('origin', branch);
      await this.git.checkout(branch);
      await this.git.rm(`./${branch}/${fileName}`);
      await this.git.commit(`rm-file:: ${fileName}`);
      await this.git.push('origin', branch);
    } catch (error) {
      throw {
        id: 'Upload.status.unableToRemove',
        message: `unable to remove ${fileName} file to git.`,
        values: { file: fileName, ...error },
      };
    }
    // finally remove temp folder
    await this.removeTempPath();
  }

  /**
   * remove temp root path
   */
  async removeTempPath() {
    await fs
      .remove(path.join(this.path, `/${this.repoName}`))
      .then(() => fs.rmdir(path.join(this.path, `/${this.repoName}`)))
      .catch(() => Promise.resolve());
  }
}

module.exports = Git;
