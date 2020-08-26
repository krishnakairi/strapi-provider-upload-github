const normalizeUrl = require('normalize-url');

/**
 * remove .git extenstion if exists
 * @param {*} repo string
 */
function removeGitExt(repo) {
    const ext = '.git'
    if (repo.endsWith(ext)) {
        return repo.substring(0, repo.length - ext.length)
    }   
    return repo;
}

/**
 * returns github repo url with user and token
 * @param {*} user string
 * @param {*} token string
 * @param {*} repo string
 */
function getRepoUrl(user, token, repo) {
    const repoUrl = removeGitExt(repo);
    return repoUrl.replace('https://github.com', `https://${user}:${token}@github.com`);
}

/**
 * return repo name from url
 * @param {*} repo string
 */
function getRepoName(repo){
    const repoUrl = removeGitExt(repo);
    return repoUrl.split('/').pop();
}

/**
 * return public accessable file url
 * @param {*} baseUrl string
 * @param {*} branch string
 * @param {*} file strapi file
 */
function publicUrl(baseUrl, branch, file) {
    return normalizeUrl(`${baseUrl}/${branch}/${file.hash}${file.ext}`);
}

/**
 * returns branch name and file name
 * @param {*} fileUrl string
 */
function getDataFromUrl(fileUrl) {
    const urlElements = fileUrl.split('/');
    const fileName = urlElements.pop();
    const branch = urlElements.pop();
    return { fileName, branch }
}

module.exports = {
    removeGitExt,
    getRepoUrl,
    getRepoName,
    publicUrl,
    getDataFromUrl
}