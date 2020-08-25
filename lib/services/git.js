const os = require('os');
const _ = require('lodash');
const fs = require('fs-extra')
const path = require('path');
const uuid = require('uuid');
const simpleGit = require('simple-git');
const { getRepoUrl } = require('./../uilts');

class Git {
    constructor({ user, token, repo, publicBaseUrl, sizeLimit }) {
        this.user = user;
        this.password = token;
        this.repo = getRepoUrl(user, token, repo);
        this.publicBaseUrl = publicBaseUrl;
        this.sizeLimit = sizeLimit;

        this.repoName = uuid.v4();
        this.path = path.resolve(os.tmpdir());
        this.git = this.gitInstance();
    }


    gitInstance() {
        fs.ensureDirSync(path.join(this.path, `/${this.repoName}`))
        return simpleGit({
            baseDir: path.join(this.path, `/${this.repoName}`),
            binary: 'git',
            maxConcurrentProcesses: 6,
        });
    }


    async add(branch, file) {
        try {
            await this.git.init()
            await this.git.addRemote('origin', this.repo);
            await this.git.fetch('origin', 'upload')
            await this.git.checkout('upload')
            await this.git.checkoutLocalBranch(branch)

            this.verifySize(file);
            await this.writeFileToLocal(branch, file);

            await this.git.add('./*')
            await this.git.commit(`add-file:: ${file.name}`)
            await this.git.push('origin', branch);
        } catch (err) {
            throw {
                id: _.get(err, 'id', 'Upload.status.unableToAdd'),
                message: _.get(err, 'message', `unable to add ${file.name} file to git.`),
                values: { 
                    file: file.name, 
                    ..._.get(error, 'values', {})
                },
            }
        }

        /**
         * finally remove created folder
         */
        await fs
            .remove(path.join(this.path, `/${this.repoName}`))
            .catch(() => Promise.resolve());
    }

    async writeFileToLocal(branch, file) {
        try {
            await fs.ensureDir(path.join(this.path, `/${this.repoName}/${branch}`));
            const filePath = path.join(this.path, `/${this.repoName}/${branch}/${file.hash}${file.ext}`)
            await fs.writeFile(filePath, file.buffer);
        } catch (err) {
            throw {
                id: 'Upload.status.writeFileFailure',
                message: `unable to write temp ${file.name} file!`,
                values: { ...err },
            }
        }
    }

    verifySize(file) {
        if (file.size > this.sizeLimit) {
            throw {
                id: 'Upload.status.sizeLimit',
                message: `${file.name} file is bigger than limit size!`,
                values: {},
            };
        }
    }

    async remove(branch, file) {
        try {
            await this.git.init()
                .rmKeepLocal('./*')
                .commit(`remove-file:: ${file.name}`)
                .addRemote('origin', this.repo)
                .push('-f', 'origin', branch);
        }
        catch (error) {
            throw {
                id: 'Upload.status.unableToRemove',
                message: `unable to remove ${file.name} file to git.`,
                values: { file: file.name, ...error },
            }
        }
    }
}

module.exports = Git;
