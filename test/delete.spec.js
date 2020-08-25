const { expect } = require('chai');
const provider = require('./../lib')

describe('Delete File', () => {

    it('should remove file to GitHub', async () => {
        provider.init({

        });
        expect(process.env.GITHUB_USER_NAME).to.equal('awareness-admin');
    });
})