# electron-vue

> An electron-vue project

#### Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:9080
npm run dev

# build electron application for production
npm run build


# lint all JS/Vue component files in `src/`
npm run lint

```

---

This project was generated with [electron-vue](https://github.com/SimulatedGREG/electron-vue)@[45a3e22](https://github.com/SimulatedGREG/electron-vue/tree/45a3e224e7bb8fc71909021ccfdcfec0f461f634) using [vue-cli](https://github.com/vuejs/vue-cli). Documentation about the original structure can be found [here](https://simulatedgreg.gitbooks.io/electron-vue/content/index.html).


    "postinstall": "electron-builder install-app-deps && npm run lint:fix"
    "postinstall": "npm run lint:fix"

package.json

```json
{
  "name": "temp",
  "version": "0.0.1",
  "author": "johnsonbryant <1966318133@qq.com>",
  "description": "An electron-vue project",
  "license": null,
  "main": "./dist/electron/main.js",
  "scripts": {
    "build": "node .electron-vue/build.js && electron-builder",
    "build:win": "node .electron-vue/build.js && electron-builder --win --ia32",
    "build:dir": "node .electron-vue/build.js && electron-builder --dir",
    "build:clean": "cross-env BUILD_TARGET=clean node .electron-vue/build.js",
    "build:web": "cross-env BUILD_TARGET=web node .electron-vue/build.js",
    "dev": "node .electron-vue/dev-runner.js",
    "lint": "eslint --ext .js,.vue -f ./node_modules/eslint-friendly-formatter src",
    "lint:fix": "eslint --ext .js,.vue -f ./node_modules/eslint-friendly-formatter --fix src",
    "pack": "npm run pack:main && npm run pack:renderer",
    "pack:main": "cross-env NODE_ENV=production webpack --progress --colors --config .electron-vue/webpack.main.config.js",
    "pack:renderer": "cross-env NODE_ENV=production webpack --progress --colors --config .electron-vue/webpack.renderer.config.js",
    "postinstall": "npm run lint:fix"

  },
  "build": {
    "productName": "温湿度检测",
    "appId": "com.example.yourapp",
    "directories": {
      "output": "build"
    },
    "files": [
      "dist/electron/**/*"
    ],
    "dmg": {
      "contents": [
        {
          "x": 410,
          "y": 150,
          "type": "link",
          "path": "/Applications"
        },
        {
          "x": 130,
          "y": 150,
          "type": "file"
        }
      ]
    },
    "mac": {
      "icon": "build/icons/icon.icns"
    },
    "win": {
      "icon": "build/icons/icon.ico"
      "target": [
        "nsis"
      ]
    },
    "linux": {
      "icon": "build/icons"
    }
  },
  "dependencies": {
    "axios": "^0.18.0",
    "binary-parser": "^1.5.0",
    "element-ui": "^2.13.0",
    "moment": "^2.24.0",
    "serialport": "^8.0.5",
    "sqlite3": "^4.1.1",
    "vue": "^2.5.16",
    "vue-electron": "^1.0.6",
    "vue-router": "^3.0.1",
    "vuex": "^3.0.1",
    "vuex-electron": "^1.0.0"
  },
  "devDependencies": {
    "ajv": "^6.5.0",
    "babel-core": "^6.26.3",
    "babel-eslint": "^8.2.3",
    "babel-loader": "^7.1.4",
    "babel-minify-webpack-plugin": "^0.3.1",
    "babel-plugin-transform-runtime": "^6.23.0",
    "babel-preset-env": "^1.7.0",
    "babel-preset-stage-0": "^6.24.1",
    "babel-register": "^6.26.0",
    "cfonts": "^2.1.2",
    "chalk": "^2.4.1",
    "copy-webpack-plugin": "^4.5.1",
    "cross-env": "^5.1.6",
    "css-loader": "^0.28.11",
    "del": "^3.0.0",
    "devtron": "^1.4.0",
    "electron": "^2.0.4",
    "electron-builder": "^21.2.0",
    "electron-debug": "^1.5.0",
    "electron-devtools-installer": "^2.2.4",
    "eslint": "^4.19.1",
    "eslint-config-standard": "^11.0.0",
    "eslint-friendly-formatter": "^4.0.1",
    "eslint-loader": "^2.0.0",
    "eslint-plugin-html": "^4.0.3",
    "eslint-plugin-import": "^2.12.0",
    "eslint-plugin-node": "^6.0.1",
    "eslint-plugin-promise": "^3.8.0",
    "eslint-plugin-standard": "^3.1.0",
    "file-loader": "^1.1.11",
    "html-webpack-plugin": "^3.2.0",
    "mini-css-extract-plugin": "0.4.0",
    "multispinner": "^0.2.1",
    "node-loader": "^0.6.0",
    "style-loader": "^0.21.0",
    "url-loader": "^1.0.1",
    "vue-html-loader": "^1.2.4",
    "vue-loader": "^15.2.4",
    "vue-style-loader": "^4.1.0",
    "vue-template-compiler": "^2.5.16",
    "webpack": "^4.15.1",
    "webpack-cli": "^3.0.8",
    "webpack-dev-server": "^3.1.4",
    "webpack-hot-middleware": "^2.22.2",
    "webpack-merge": "^4.1.3"
  }
}

```