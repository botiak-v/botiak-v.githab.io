import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.133.0/build/three.module.js';
import { OBJLoader } from 'https://cdn.jsdelivr.net/npm/three@0.133.0/examples/jsm/loaders/OBJLoader.js';

var renderer = new THREE.WebGLRenderer({canvas: document.getElementById('Canvas'), antialias: true});
renderer.setClearColor(0x333333);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

var camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 0.1, 20000);

var scene = new THREE.Scene();

var lightOne = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(lightOne);

var lightTwo = new THREE.PointLight(0xffffff, 0.5);
scene.add(lightTwo);

var objLoader = new OBJLoader();
objLoader.load("android.obj", function(mesh) {
    mesh.traverse(function(node) {
        if (node instanceof THREE.Mesh) {
            node.castShadow = true;
            node.receiveShadow = true;
        }
    });
    scene.add(mesh);
    mesh.position.set(-80, -50, -150);
    mesh.rotation.y = -Math.PI/4;
});

function render() {
    renderer.render(scene, camera);
    requestAnimationFrame(render);
}

render();