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
      pageHeight: 0,
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
        this.camera.position.set(
          0,
          0,
          -(document.scrollingElement || document.documentElement).scrollTop
        );
        renderer.render(this.scene, this.camera);
      };
      document.addEventListener("mousemove", (e) => {
        console.log(e.clientX, e.clientY);
    
        var t = new THREE.Vector2(e.clientX, e.clientY);
        let a = new THREE.Quaternion();
        this.camera.rotation = new THREE.Euler(-t.y, -t.x, 0);
      });
      animate();
    },

    addContentInSpace: function() {
      for (let index = 0; index < this.samples.length; index++) {
        let texture = new THREE.Texture(
          this.createCanvasText(this.samples[index].text)
        );
        texture.needsUpdate = true;
        let material = new THREE.MeshBasicMaterial({ map: texture });
        let geometry = new THREE.PlaneGeometry(200, 200);
        let mesh = new THREE.Mesh(geometry, material);
        mesh.position.z = -this.samples[index].zpos;
        this.pageHeight = this.samples[index].zpos;
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
      ctx.font = "20pt Arial";
      ctx.fillStyle = "white";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(text, canvas.width / 2, canvas.height / 2);
      console.log(text);

      return canvas;
    }
  },

  onMouseMoved: function(e) {
    
  },

  unknownFunc: function(e) {
    var t = h >> 1,
      n = m >> 1;
    return (e.x = (e.x - t) / t), (e.y = (e.y - n) / n), e;
  }
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
