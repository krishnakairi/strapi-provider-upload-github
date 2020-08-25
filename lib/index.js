'use strict';

/**
 * Module dependencies
 */
const uuid = require('uuid');
const Git = require('./services/git');
const GitHub = require('./services/github');

module.exports = {
    init(config) {
        // Init Git Bash Client
        const git = new Git({
            user: config.user,
            token: config.token,
            repo: config.repo,
            publicBaseUrl: config.publicBaseUrl,
            sizeLimit: config.sizeLimit
        });

        // Init GitHub Rest Client
        const github = new GitHub({
            user: config.user, 
            token: config.token, 
            repo: config.repo, 
            base: config.base
        })

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
                } catch (err) {
                    return console.log(err)
                    throw strapi.errors.badRequest('GitHubUploader', {
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
                    const branch = uuid.v4();
                    await git.remove(branch, file);
                    await github.merge(branch);
                } catch (err) {
                    throw strapi.errors.badRequest('GitHubUploader', {
                        errors: [err],
                    });
                }
            },
        };
    },
};