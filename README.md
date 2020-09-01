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
          "publicUrl": "https://user-name.github.io/site-assets",
          "sizeLimit": 1000000
      },
}
```

## Parameters
- repo - github repo link
- user - github user name
- token - github user token [(Creating a personal access token - GitHub Docs)](https://docs.github.com/en/github/authenticating-to-github/creating-a-personal-access-token)
- emptyBranch - branch name with no files (Empty branch used to auto merge uploaded files without any conflicts).
- baseBranch - branch name pointed to github pages.
- publicUrl - github pages public url. (alternatively you can use public urls from [vercel](https://vercel.com/), [surge](https://surge.sh/), [netlify](https://www.netlify.com/))
- sizeLimit - upload file size limit.

## Resources

- [MIT License](LICENSE.md)

## Links

- [Strapi website](http://strapi.io/)
- [Strapi community on Slack](http://slack.strapi.io)
- [Strapi news on Twitter](https://twitter.com/strapijs)