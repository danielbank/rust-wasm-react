# rust-wasm-react

Example of running a WebAssembly library (built with Rust) inside of a Create React App. This project was built following the steps of Richard Reedy's [Using WebAssembly with React](https://www.telerik.com/blogs/using-webassembly-with-react) tutorial. It was presented at the [Desert Rust](https://rust.azdevs.org/) meetup.

## Usage

### Install wasm-pack

See https://rustwasm.github.io/wasm-pack/installer to get started with wasm-pack.

### Build the WASM Package

First, we build the WASM binaries using the `wasm-pack` CLI tool:

```
wasm-pack build
```

### Install the WASM Package and Start the App

Typically, we would want to publish the WASM package to the NPM registry and install via npm in the usual way. However for the sake of this demo, we will install it from the filesystem. Our `package.json` refers to the file like so: `"dbscan-wasm": "file:../pkg"`. The `pkg` directory is what gets created by running the `wasm-pack build` command.

```
pushd ./app
npm install
npm start
```

## Troubleshooting

### The WASM Package used by the React App is not updating when I change my code

I experienced this issue where my WASM code was not updating when I built it and installed it in the React App. Even though I was deleting the `node_modules` folder, the `package-lock.json` was hanging onto the old package. I solved it by deleting both the `node_modules` and the `package-lock.json`:

```
pushd ./app
rm -rf node_modules
rm package-lock.json
popd
```

### the trait `wasm_bindgen::convert::traits::FromWasmAbi` is not implemented for `std::boxed::Box<[some type here...]>`

The DBScan crate I am using wants to receive the points as a `Vec<Vec<f32>>` but when I tried to use this type for the input to the wasm function, I received an error about the `FromWasmAbi` trait not being implemented. It turns out that you are pretty limited in the types that you can use in a `#[wasm_bindgen]` function. Fortunately, you can get around it by passing your data in and out as a `&JsValue` and serialize / deserialize it with Serde. See [Serializing and Deserializing Arbitrary Data Into and From JsValue with Serde](https://rustwasm.github.io/wasm-bindgen/reference/arbitrary-data-with-serde.html).
