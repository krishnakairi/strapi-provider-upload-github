const fs = require('fs-extra');
const path = require('path');
const Chance = require('chance');
const { expect } = require('chai');
const Provider = require('./../lib');

const chance = new Chance();
const provider = Provider.init({
    repo: process.env.GITHUB_REPO,
    user: process.env.GITHUB_USER_NAME,
    token: process.env.GITHUB_AUTH_TOKEN,
    emptyBranch: process.env.GITHUB_EMPTY_BRANCH,
    baseBranch: process.env.GITHUB_BASE_BRANCH,
    publicBaseUrl: process.env.GITHUB_PUBLIC_URL,
    sizeLimit: 10000
});
const file = {
    name: `${chance.animal()}.jpg`,
    buffer: Buffer.from(fs.readFileSync(path.join(__dirname, 'test.jpg'))),
    hash: chance.string({ length: 8, alpha: true, numeric: true }),
    ext: '.jpg'
}

describe('GitHub Provider', () => {

    jest.setTimeout(1000000);

    it('should upload file to GitHub', async () => {
        await provider.upload(file);
        expect(file.url).to.not.equal('');
    });

    it('should delete file form GitHub', async () => {
        console.log(file.url);
        const result = await provider.delete(file);
        expect(result).to.equal(true);
    });
})