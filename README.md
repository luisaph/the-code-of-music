# The Code of Music (magicbook)

https://codeofmusic-16a81.web.app/

### Setup

0. Install [nvm](https://github.com/nvm-sh/nvm) and [Yarn](https://yarnpkg.com/)
1. `nvm install; nvm use;` to install and activate the correct Node version.
2. Install [Prince](https://www.princexml.com/) on your computer (`brew install prince` for Macs). In theory we shouldn't have to do this but there is an error while installing Prince as part of the `magicbook` installation.
3. `yarn install` to install the node modules

### Development

1. Run `yarn dev` -- this will build the magicbook files and watch for changes
2. In a new tab run `yarn serve` -- this will start a [`live-server`](https://github.com/tapio/live-server) at localhost:5000 and auto refresh when the magic build finishes
3. Open http://localhost:5000/

#### Interactive Examples

The interactive p5 sketches live in the `examples` folder. During the build this folder is moved to `assets/examples` in the build directory, so if you just need to work on the examples, you can run `yarn serve:examples` which will just serve that folder.

### Pulling Chapter Data from Notion

#### Locally

Locally, install [`narkdown`](https://github.com/younho9/narkdown) and then you can run

```
python3 -m narkdown --token-v2=<YOUR_NOTION_V2_TOKEN> --url=<NOTION_DATABASE_URL> --docs-directory=./notion-docs --is-database
```

#### Using GitHub Actions

To get the latest files from the Notion source, we run the [Notion to Github -- Create PR](https://github.com/luisaph/the-code-of-music/actions/workflows/notion-to-github.yml) action. This workflow pulls the latest files and writes the markdown files to the `notion-docs` directory. It then moves any images into the top-level `images` directory and updates the image links in the markdown files so that Magicbook can find the images. It also (temporarily) reduces the header levels (eg `##` becomes `#`). This is so that Magicbook regocgnizes the H1 as the chapter title.

Note that Github Actions cannot trigger other Github actions directly. That means that this workflow will not automatically trigger the Deploy Preview action. Right now there are a couple workaraounds.

1. Use the [Notion2Github and Preview Deploy](https://github.com/luisaph/the-code-of-music/actions/workflows/notion-to-github-and-preview-deploy.yml) action. this will deploy to [Staging](https://codeofmusic-16a81--staging-h9r73v4u.web.app/), but not leave a comment on the PR
2. Close and re-open the PR. This will trigger the [firebase-hosting-pull-request](https://github.com/luisaph/the-code-of-music/blob/deploy-firebase/.github/workflows/firebase-hosting-pull-request.yml) action and post a link to the preview URL.

### Deploy

For every commit to the master branch, the [firebase-hosting-merge](https://github.com/luisaph/the-code-of-music/blob/deploy-firebase/.github/workflows/firebase-hosting-merge.yml) action builds and deploys the site to Firebase Hosting at https://codeofmusic-16a81.web.app/.

### Staging and Deploy Previews

Pull requests will trigger the [firebase-hosting-pull-request](https://github.com/luisaph/the-code-of-music/blob/deploy-firebase/.github/workflows/firebase-hosting-pull-request.yml) action, which deploys a unique, temporary preview site to Firebase Hosting. The link to the site will be posted as a comment from the Github Bot once the deploy is complete.
