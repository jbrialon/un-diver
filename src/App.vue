<template>
    <div id="main">
      <p id="title">{{ greeting }} you !</p>
      <div id="stage"></div>
    </div>
</template>

<script>
import * as THREE from "../lib/three.js";

module.exports = {
  data: function() {
    return {
      greeting: "Hello",
      scene: null,
      camera: null,
      samples: [
        {
          text: "WELCOME",
          zpos: 1000
        },
        {
          text: "DIVER COLLECTION",
          zpos: 2000
        },
        {
          text: "THE NEW DIVER",
          zpos: 3000
        },
        {
          text: "STAIN CASE",
          zpos: 4000
        },
        {
          text: "PHOSPHORESCENT NEEDLS & NUMBERS",
          zpos: 5000
        }
      ]
    };
  },
  mounted: function() {
    this.initScene();
    this.addContentInSpace();
  },

  methods: {
    initScene: function() {
      let scene = new THREE.Scene();
      let camera = new THREE.PerspectiveCamera(
        45,
        window.innerWidth / window.innerHeight,
        1,
        2e3
      );

      let renderer = new THREE.WebGLRenderer();
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.autoClear = !1;
      renderer.setClearColor(0, 0);
      renderer.setPixelRatio(
        window.devicePixelRatio || window.webkitDevicePixelRatio || 1
      );

      document.getElementById("stage").appendChild(renderer.domElement);

      let geometry = new THREE.BoxGeometry(1, 1, 1);
      let material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
      let cube = new THREE.Mesh(geometry, material);
      scene.add(cube);

      camera.position.set(0, 0, 5);

      this.scene = scene;
      this.camera = camera;

      console.log(this.scene);

      let animate = function() {
        requestAnimationFrame(animate);

        cube.rotation.x += 0.01;
        cube.rotation.y += 0.01;

        renderer.render(scene, camera);
      };

      animate();
    },

    addContentInSpace: function() {
      /*for (let index = 0; index < this.samples.length; index++) {
        i.fillText(e.best.rank, 12 - c.width / 2, s + 8)
        geometry.position.z = -this.samples[index].zpos;
        this.scene.add(geometry);
      }*/
    }
  }
};
</script>

<style lang="scss" scoped>
@font-face {
  font-family: Roboto-Light;
  src: url(https://www.ulysse-nardin.com/sites/all/themes/un_subtheme/css/fonts/Roboto-Light.eot);
  src: url(https://www.ulysse-nardin.com/sites/all/themes/un_subtheme/css/fonts/Roboto-Light.eot?#iefix)
      format("embedded-opentype"),
    url(https://www.ulysse-nardin.com/sites/all/themes/un_subtheme/css/fonts/Roboto-Light.woff)
      format("woff"),
    url(https://www.ulysse-nardin.com/sites/all/themes/un_subtheme/css/fonts/Roboto-Light.ttf)
      format("truetype"),
    url(https://www.ulysse-nardin.com/sites/all/themes/un_subtheme/css/fonts/Roboto-Light.svg#Roboto-Light)
      format("svg");
  font-style: normal;
  font-weight: normal;
}
@font-face {
  font-family: Roboto-Regular;
  src: url(https://www.ulysse-nardin.com/sites/all/themes/un_subtheme/css/fonts/Roboto-Regular.eot);
  src: url(https://www.ulysse-nardin.com/sites/all/themes/un_subtheme/css/fonts/Roboto-Regular.eot?#iefix)
      format("embedded-opentype"),
    url(https://www.ulysse-nardin.com/sites/all/themes/un_subtheme/css/fonts/Roboto-Regular.woff)
      format("woff"),
    url(https://www.ulysse-nardin.com/sites/all/themes/un_subtheme/css/fonts/Roboto-Regular.ttf)
      format("truetype"),
    url(https://www.ulysse-nardin.com/sites/all/themes/un_subtheme/css/fonts/Roboto-Regular.svg#Roboto-Regular)
      format("svg");
  font-style: normal;
  font-weight: normal;
}
@font-face {
  font-family: Roboto-Bold;
  src: url(https://www.ulysse-nardin.com/sites/all/themes/un_subtheme/css/fonts/Roboto-Bold.eot);
  src: url(https://www.ulysse-nardin.com/sites/all/themes/un_subtheme/css/fonts/Roboto-Bold.eot?#iefix)
      format("embedded-opentype"),
    url(https://www.ulysse-nardin.com/sites/all/themes/un_subtheme/css/fonts/Roboto-Bold.woff) format("woff"),
    url(https://www.ulysse-nardin.com/sites/all/themes/un_subtheme/css/fonts/Roboto-Bold.ttf)
      format("truetype"),
    url(https://www.ulysse-nardin.com/sites/all/themes/un_subtheme/css/fonts/Roboto-Bold.svg#Roboto-Bold)
      format("svg");
  font-style: normal;
  font-weight: normal;
}
</style>
