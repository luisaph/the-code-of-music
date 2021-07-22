# The Code of Music (magicbook)

https://codeofmusic-16a81.web.app/

### Setup

0. Install [nvm](https://github.com/nvm-sh/nvm) and [Yarn](https://yarnpkg.com/)
1. `nvm install; nvm use;` to install and activate the correct Node version.
2. Install [Prince](https://www.princexml.com/) on your computer (`brew install prince` for Macs). In theory we shouldn't have to do this but there is an error while installing Prince as part of the `magicbook` installation.
3. `yarn install` to install the node modules

### Development

1. Run `yarn dev` -- this will start build magicbook files and watch for changes
2. In a new tab run `yarn serve` -- this will start a `live-server` at localhost:5000 and auto refresh when the magic build finishes
3. Open http://localhost:5000/

### Deploy

The [firebase-hosting-merge](https://github.com/luisaph/the-code-of-music/blob/deploy-firebase/.github/workflows/firebase-hosting-merge.yml) action builds and deploys the site to Firebase Hosting at https://codeofmusic-16a81.web.app/. During the build step the PDF version is copied into the web directory so that it can be accessed at https://codeofmusic-16a81.web.app/the-code-of-music.pdf.

### Staging and Deploy Previews

Pull requests will trigger the [firebase-hosting-pull-request](https://github.com/luisaph/the-code-of-music/blob/deploy-firebase/.github/workflows/firebase-hosting-pull-request.yml) action, which deploys a unique, temporary preview site to Firebase Hosting. The link to the site will be posted as a comment from the Github Bot once the deploy is complete. 
