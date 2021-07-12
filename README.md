# the-code-of-music

## Jekyll


## Magicbook (`magicbook` branch)

### Setup
0. Install [nvm](https://github.com/nvm-sh/nvm) and [Yarn](https://yarnpkg.com/)
1. `nvm install; nvm use;` to install and activate the correct Node version.
2. Install [Prince](https://www.princexml.com/) on your computer (`brew install prince` for Macs). In theory we shouldn't have to do this but there is an error while installing Prince as part of the `magicbook` installation.
3. `yarn install` to install the node modules

### Development
1. Run `yarn dev` -- this will start build magicbook files and watch for changes
2. In a new tab run `yarn serve` -- this will start a `live-server` at localhost:5000 and auto refresh when the magic build finishes
3. Open http://localhost:5000/

### To Build 
<pre>
magicbook build
</pre>
