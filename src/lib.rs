#[macro_use]
extern crate serde_derive;

mod utils;

use dbscan::Classification::{Core, Edge, Noise};
use wasm_bindgen::prelude::*;

// When the `wee_alloc` feature is enabled, use `wee_alloc` as the global
// allocator.
#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Cluster {
    pub points: Vec<Vec<f32>>,
    pub epsilon: f64,
    pub min_points: usize,
}

#[wasm_bindgen]
pub fn cluster(input: &JsValue) -> Vec<f32> {
    let cluster: Cluster = input.into_serde().unwrap();
    let model = dbscan::Model::new(cluster.epsilon, cluster.min_points);
    let mut output = Vec::new();
    for point in model.run(&cluster.points).iter() {
        match point {
            Core(cluster_num) => output.push(cluster_num.clone() as f32),
            Edge(cluster_num) => output.push(cluster_num.clone() as f32),
            Noise => output.push(-1.0),
        }
    }
    output
}
