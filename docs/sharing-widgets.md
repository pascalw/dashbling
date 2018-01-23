# Sharing widgets

Widgets can be shared via NPM packages.

Dashbling provides a generator to create a new widget package. Run it with:

```sh
yarn create @dashbling/widget ~/Code/my-dashbling-widget
# or
npx @dashbling/create-widget my-widget
```

A widget package looks like this:

```Sh
├── MyWidget.js
├── README.md
├── job.js
├── package.json
├── styles.css
└── yarn.lock
```

* `MyWidget` - is where you define your widget frontend component.
* `job.js` - is where you define a job to fetch data for your widget (if applicable).
* `styles.css` - is where you write your css. It's a CSS module, so it's scoped to your widget.

Creating a widget module is conceptually the same as creating a widget in your dashboard project. See the [get started](./getstarted.md) docs for more details.