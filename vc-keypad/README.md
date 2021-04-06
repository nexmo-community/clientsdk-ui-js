# \<vc-keypad>

This Web Component follows the [open-wc](https://github.com/open-wc/open-wc) recommendation and created to interact with the [Vonage Client SDK](https://developer.nexmo.com/client-sdk/overview).

For more information about the keypad component, please see the following blog post:
* [Creating a Web Component With Open-WC](https://learn.vonage.com/blog/2020/08/13/creating-a-web-component-with-open-wc/)
* [Using Web Components in a React Application](https://learn.vonage.com/blog/2020/10/07/using-web-components-in-a-react-application-dr/)
* [Use Web Components in Vue 2 and 3 + Composition API](https://learn.vonage.com/blog/2020/10/30/use-web-components-in-vue-2-and-3-composition-api-dr/)
* [Using Web Components in an Angular application: Joyful & Fun](https://learn.vonage.com/blog/2021/02/16/using-web-components-in-an-angular-application-joyful-fun/)

## Installation
```bash
npm i @vonage/vc-keypad
```

## Usage
```html
<script type="module">
  import '@vonage/vc-keypad/vc-keypad.js';
</script>

<vc-keypad></vc-keypad>
```

## Linting with ESLint, Prettier, and Types
To scan the project for linting errors, run
```bash
npm run lint
```

You can lint with ESLint and Prettier individually as well
```bash
npm run lint:eslint
```
```bash
npm run lint:prettier
```

To automatically fix many linting errors, run
```bash
npm run format
```

You can format using ESLint and Prettier individually as well
```bash
npm run format:eslint
```
```bash
npm run format:prettier
```

## Testing with Web Test Runner
To run the suite of Web Test Runner tests, run
```bash
npm run test
```

To run the tests in watch mode (for &lt;abbr title=&#34;test driven development&#34;&gt;TDD&lt;/abbr&gt;, for example), run

```bash
npm run test:watch
```

## Demoing with Storybook
To run a local instance of Storybook for your component, run
```bash
npm run storybook
```

To build a production version of Storybook, run
```bash
npm run storybook:build
```


## Tooling configs

For most of the tools, the configuration is in the `package.json` to reduce the amount of files in your project.

If you customize the configuration a lot, you can consider moving them to individual files.

## Local Demo with `web-dev-server`
```bash
npm start
```
To run a local development server that serves the basic demo located in `demo/index.html`
