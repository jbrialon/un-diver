<template>
    <div id="main">
      <div id="stage"></div>
    </div>
</template>

<script>
import * as THREE from "../lib/three.js";

module.exports = {
  data: function() {
    return {
      stageDOMElement: null,
      scene: null,
      camera: null,
      cameraPositionVector: null,
      cameraRotationQuaternion: null,
      pageHeight: 0,
      pageHeightMultiplyer: 0.5,
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
          text: "PHOSPHORESCENT NEEDLES & NUMBERS",
          zpos: 5000
        }
      ]
    };
  },
  mounted: function() {
    this.initScene();
    this.addContentInSpace();

    document.body.style.height = this.pageHeight + "px";
  },

  methods: {
    initScene: function() {
      this.cameraPositionVector = new THREE.Vector3();
      this.cameraRotationQuaternion = new THREE.Quaternion();
      this.stageDOMElement = document.getElementById("stage");
      this.scene = new THREE.Scene();
      this.camera = new THREE.PerspectiveCamera(
        45,
        this.stageDOMElement.clientWidth / this.stageDOMElement.clientHeight,
        1,
        2e3
      );

      let renderer = new THREE.WebGLRenderer();
      renderer.setSize(
        this.stageDOMElement.clientWidth,
        this.stageDOMElement.clientHeight
      );
      renderer.autoClear = !1;
      renderer.setClearColor(0, 0);
      renderer.setPixelRatio(
        window.devicePixelRatio || window.webkitDevicePixelRatio || 1
      );

      this.stageDOMElement.appendChild(renderer.domElement);
      this.camera.position.set(0, 0, 500);

      let animate = () => {
        requestAnimationFrame(animate);
        this.cameraPositionVector.set(0,0, -(document.scrollingElement || document.documentElement).scrollTop * this.pageHeightMultiplyer);

        this.camera.position.lerp(this.cameraPositionVector, 0.1);
        this.camera.quaternion.slerp(this.cameraRotationQuaternion, 0.1);
        renderer.render(this.scene, this.camera);
      };
      document.addEventListener("mousemove", e => {
        let t = new THREE.Vector2(e.clientX, e.clientY);
        this.restrictFOV(t);
        this.cameraRotationQuaternion.setFromEuler(new THREE.Euler(-t.y, -t.x, 0));
      });
      animate();
    },

    addContentInSpace: function() {
      for (let index = 0; index < this.samples.length; index++) {
        let texture = new THREE.Texture(
          this.createCanvasText(this.samples[index].text)
        );
        texture.needsUpdate = true;
        let material = new THREE.MeshBasicMaterial({ map: texture, transparent: !0, visible: 1 });
        let geometry = new THREE.PlaneGeometry(200, 200);
        let mesh = new THREE.Mesh(geometry, material);
        mesh.position.z = -this.samples[index].zpos;
        this.pageHeight = this.samples[index].zpos * 1/this.pageHeightMultiplyer;
        this.scene.add(mesh);
      }
    },

    createCanvasText: function(text) {
      let canvas = document.createElement("canvas");
      //document.body.appendChild(canvas);
      canvas.width = THREE.Math.ceilPowerOfTwo(
        this.stageDOMElement.clientWidth
      );
      canvas.height = THREE.Math.ceilPowerOfTwo(
        this.stageDOMElement.clientHeight
      );

      let ctx = canvas.getContext("2d");
      ctx.font = "35pt Arial";
      ctx.fillStyle = "rgba(255,255,255,1)";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(text, canvas.width / 2, canvas.height / 2);

      return canvas;
    },

    updateCamera: function(theCamera) {
      this.cameraMatrix.multiplyMatrices(
        theCamera.projectionMatrix,
        this.cameraMatrix.getInverse(theCamera.matrixWorld)
      );
    },

    restrictFOV(vec2) {
      var maxWidth = window.innerWidth >> 1,
        maxHeight = window.innerHeight >> 1;
      return (vec2.x = (vec2.x - maxWidth) / maxWidth), (vec2.y = (vec2.y - maxHeight) / maxHeight), vec2;
    }
  },

  onMouseMoved: function(e) {}
};
</script>

<style lang="scss">
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
    url(https://www.ulysse-nardin.com/sites/all/themes/un_subtheme/css/fonts/Roboto-Bold.woff)
      format("woff"),
    url(https://www.ulysse-nardin.com/sites/all/themes/un_subtheme/css/fonts/Roboto-Bold.ttf)
      format("truetype"),
    url(https://www.ulysse-nardin.com/sites/all/themes/un_subtheme/css/fonts/Roboto-Bold.svg#Roboto-Bold)
      format("svg");
  font-style: normal;
  font-weight: normal;
}

#main {
  width: 100vw;
  height: 100vh;
  #stage {
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    canvas {
      z-index: 0;
      position: fixed;
      top: 0;
      left: 0;
    }
  }
}
</style>
