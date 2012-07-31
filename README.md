# clientmodules 

A simplistic util for using npm to install clientside packages.

## Why? 
Because npm is awesome, commonJS modules are awesome and using them both on the client is even awesomer. Disagree? Then certainly don't use this and heckle me [on twitter instead](http://twitter.com/henrikjoreteg).

I'm not publishing this in hopes that lots of people will see and use it. It's a hack, but works for my purposes. I'm putting it on npm for ease of distribution in projects where we follow this pattern, not as a "everybody should use this" statement.

```shell
npm install clientmodules
```

Once we've got our clientmodules split out, I like to use [Stich](https://github.com/sstephenson/stitch/) to bundle these to be served to the client.

It's not perfect, but it's better than copying versions of files around projects by hand.

## How it works
It shamelessly extends `package.json` to also list which of the installed dependencies you'd like to use on the client. It does no special packaging or dependency managment for you. It just assumes that there's really only one main export and will simply drop that into the folder you specify (we use `clientmodules`) by default.

## How do I use it?
1. Add `clientmodules` to your npm dependencies in `package.json`
2. Add an array of client modules to install (which simply means copying whatever file has the same name, or in lib, or build directories. (no, this is not ideal)
3. Adding `"postinstall": "node node_modules/clientmodules/copy.js"` to the `scripts` property in package.json.

Altogether is looks somethign like this:

```
  ...
  "dependencies": {
    "clientmodules": "",
    "some_other_module": ""
  },
  "clientmodules": ["async", "icanhaz", "etc", "other_etc"],
  "scripts": {
    "postinstall": "node node_modules/clientmodules/install.js"
  }
  ...
```

Bingo! It'll now copy those into a `clientmodules` directory at the root of your project when you `npm install .` for your project.

## Licence

MIT