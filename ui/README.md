> A videochat using Vue.js, written for MindDoc's and N3XTCODER's workshop on Vue.js and React.
>
> December 15, 2017.
> Munich, Germany.

We initialized our Vue.js user interface solution using [`vuejs/vue-cli`](https://github.com/vuejs/vue-cli) scaffolding tool.

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for `vue-loader`](http://vuejs.github.io/vue-loader).

We set up [ESLint](https://eslint.org/) to lint the code, using [Airbnb's JavaScript Style Guide](https://github.com/airbnb/javascript).

For automated tests, [Jest](https://facebook.github.io/jest/) and [Nightwatch](http://nightwatchjs.org/) for e2e tests are setup.


## Build Setup

1. Node.js and NPM is installed.

    ```
    node --version
    npm --version
    ```

2. Install the UI project's dependencies

    ```
    npm install
    ```

Once the dependencies are installed, you can:

* **Serve with hot reload at [`localhost:8080`](http://localhost:8080)** (it will use a different port, if the port's already in use). Ideal for development and fast iteration.

    ```
    npm run dev
    ```

* **Build for production with minification.** Minified files will be created in `/dist` folder.

    ```
    npm run build
    ```

* **Build for production and view the bundle analyzer report**. Bundle analyzer report's available at [`localhost:8888`](http://localhost:8888/).

    ```
    npm run build --report
    ```

### Run tests

* **Run all tests**

    ```
    npm test
    ```

* **Run unit tests with Jest**

    ```
    npm run unit
    ```

* **Run unit tests continuously with `watch` mode enabled**

    ```
    npm run watch-unit
    ```

* **Run end-to-end tests with Nightwatch**

    ```
    npm run e2e
    ```
