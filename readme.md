# typescript-migration-transformers

This package currently exports a single Babel plugin, `add-type-annotations-to-sfc.js`. It's intended to be run with the `babel-codemod` package, but is still experimental. It depends on Babel v7's Typescript support.

## `add-type-annotations-to-sfc`
A Babel plugin that looks for function declarations and function expressions that have a `displayName` or `propTypes` property. If it has either property, it's treated as a React stateless functional component, and the declaration is replaced with a type-annotated variable declaration and function expression assignment.

### Input
```js
function Component({ children }) {
    return <div>{children}</div>
}

Component.propTypes = {
    children: React.PropTypes.string
};

export default Component;
```

### Output
```js
const Component: React.SFC<any> = ({ children }) => {
    return <div>{children}</div>
};

Component.propTypes = {
    children: React.PropTypes.string
};

export default Component;
```

The idea is to help automate porting a large React codebase to Typescript.

## Potential additions
- Transform prop types to type annotations
- Script `.js` -> `.ts/.tsx` file renames by detecting the presence of JSX in a file
