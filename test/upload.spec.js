const { expect } = require('chai');
const Provider = require('./../lib')

describe('Upload File', () => {

    jest.setTimeout(1000000000);

    it('should upload file to GitHub', async () => {
        const provider = Provider.init({
            user: process.env.GITHUB_USER_NAME,
            token: process.env.GITHUB_AUTH_TOKEN,
            repo: process.env.GITHUB_REPO,
            publicBaseUrl: process.env.GITHUB_PUBLIC_URL,
            sizeLimit: 10000
        });

        const file = await provider.upload({
            name: 'test.jpg',
            buffer: Buffer.from("Test Image Content", "utf-8"),
            hash: 'TEST-HASH',
            ext: '.jpg'
        })

        expect(process.env.GITHUB_USER_NAME).to.not.equal('');
    });
})