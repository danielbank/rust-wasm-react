# rust-wasm-react

Example of running a WebAssembly library (built with Rust) inside of a Create React App. This project was built following the steps of Richard Reedy's [Using WebAssembly with React](https://www.telerik.com/blogs/using-webassembly-with-react) tutorial. It was presented at the [Desert Rust](https://rust.azdevs.org/) meetup.

## Usage

### Build the WASM Package

```
wasm-pack build
```

### Move the WASM Package into the React App

```
tar czfv ./wasm-pkg-0.1.0.tgz ./pkg
cp ./pkg/wasm-pkg-0.1.0.tgz app
```

### Run the Create React App

```
cd app
npm start
```
