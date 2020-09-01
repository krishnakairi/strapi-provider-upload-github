# strapi-provider-upload-github

Github/Github-Pages provider for Strapi CMS file upload.


## Installation

```
npm install strapi-provider-upload-github
```

## Config

`./extensions/upload/config/config.json`

```json
{
      "provider": "github",
      "providerOptions": {
          "repo": "https://github.com/user-name/site-assets",
          "user": "user-name",
          "token": "***token***",
          "emptyBranch": "upload",
          "baseBranch": "master",
          "publicBaseUrl": "https://user-name.github.io/site-assets",
          "sizeLimit": 1000000
      },
}
```

## Parameters
- repo: Github repo link
- user: Github user name
- token: Github user token [Creating a personal access token - GitHub Docs](https://docs.github.com/en/github/authenticating-to-github/creating-a-personal-access-token)
- emptyBranch: Branch name with no files.
- baseBranch: Branch pointed to github pages.
- publicBaseUrl: Github pages public link
- sizeLimit: file size limit

## Resources

- [MIT License](LICENSE.md)

## Links

- [Strapi website](http://strapi.io/)
- [Strapi community on Slack](http://slack.strapi.io)
- [Strapi news on Twitter](https://twitter.com/strapijs)