import * as THREE from 'three';
import { MindARThree } from 'mindar-face-three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

window.addEventListener("DOMContentLoaded", async () => {
    const mindarThree = new MindARThree({
	container: document.body,
    });

    const {renderer, scene, camera} = mindarThree;
    const anchor2 = mindarThree.addAnchor(10);

	var lightOne=new THREE.AmbientLight(0xffffff, 1);
	scene.add(lightOne);

	const light = new THREE.HemisphereLight( 0xffffbb, 0xcccccc, 1 );
	scene.add( light );

	const loader = new GLTFLoader();

	loader.load(
		'batman.glb',
		function ( gltf ) {
			gltf.scene.scale.set(0.4, 0.4, 0.4);
			gltf.scene.position.y=-0.1;
			gltf.scene.position.z=-0.2;

			gltf.scene.rotation.x=Math.PI/10;

		    anchor2.group.add(gltf.scene);
		},

		function ( xhr ) {
			console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
		},
		function ( error ) {
			console.log( 'An error happened' );
		}
	        );

      const texture = new THREE.TextureLoader().load('ghoul.png');

      const faceMesh = mindarThree.addFaceMesh();
      faceMesh.material.map = texture;
      faceMesh.material.transparent = true;
      faceMesh.material.needsUpdate = true;
      scene.add(faceMesh);

      await mindarThree.start();

      renderer.setAnimationLoop(() => {
	  renderer.render(scene, camera);
      });
});


