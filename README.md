# rust-wasm-react

Example of running a WebAssembly library (built with Rust) inside of a Create React App. This project was built following the steps of Richard Reedy's [Using WebAssembly with React](https://www.telerik.com/blogs/using-webassembly-with-react) tutorial. It was presented at the [Desert Rust](https://rust.azdevs.org/) meetup.

## Usage

### Build the WASM Package

First, we build the WASM binaries using the `wasm-pack` CLI tool:

```
wasm-pack build
```

### Move the WASM Package into the React App Directory

Typically, we would want to publish the WASM to the NPM registry and install via npm in the usual way. However, for the sake of this demo, we will install it from a file in the same directory as the React app. Our `package.json` references the file like so: `"dbscan-wasm": "file:dbscan-wasm-0.1.0.tgz"`.

To stage this file, we need tar the directory with the WASM binaries and move it to the React app folder:

```
tar czfv ./dbscan-wasm-0.1.0.tgz ./pkg
mv ./pkg/wasm-pkg-0.1.0.tgz app
```

### Install the WASM Package via NPM and Start the App

Lastly, we install WASM package via NPM and start the React app.

```
cd app
npm install
npm start
```
