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
      stageSize: new THREE.Vector2(0,0),
      stageDOMElement: null,
      scene: null,
      camera: null,
      cameraPositionVector: null,
      cameraRotationQuaternion: null,
      pageHeight: 0,
      pageHeightMultiplyer: 0.5,
      deviceOrientation: null,
      screenOrientation: window.orientation || 0,
      mousePosition: new THREE.Vector2(),
      deviceOrientationInitialQuat: null,
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
    this.stageDOMElement = document.getElementById("stage");
    this.initScene();
    this.addContentInSpace();
    this.handleEvents();
    document.body.style.height = this.pageHeight + "px";
  },

  methods: {
    initScene: function() {
      this.stageSize.set(this.stageDOMElement.clientWidth, this.stageDOMElement.clientHeight);
      this.cameraPositionVector = new THREE.Vector3();
      this.cameraRotationQuaternion = new THREE.Quaternion();
      this.scene = new THREE.Scene();
      this.camera = new THREE.PerspectiveCamera(
        45,
        this.stageSize.width / this.stageSize.height,
        1,
        2e5
      );

      let renderer = new THREE.WebGLRenderer({ antialias: false, alpha: false });
      renderer.setSize( this.stageSize.width, this.stageSize.height );
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

        this.updateCameraRotation();
        this.camera.quaternion.slerp(this.cameraRotationQuaternion, 0.1);
        renderer.render(this.scene, this.camera);
      };
      animate();
    },

    addContentInSpace: function() {
      for (let index = 0; index < this.samples.length; index++) {
        let texture = new THREE.Texture(
          this.createCanvasText(this.samples[index].text)
        );
        texture.needsUpdate = true;
        let material = new THREE.MeshBasicMaterial({ map: texture, transparent: true, visible: true });
        let geometry = new THREE.PlaneGeometry(THREE.Math.ceilPowerOfTwo(this.stageSize.width), THREE.Math.ceilPowerOfTwo(this.stageSize.height));
        let mesh = new THREE.Mesh(geometry, material);
        mesh.position.z = -this.samples[index].zpos;
        this.pageHeight = this.samples[index].zpos * 1/this.pageHeightMultiplyer;
        this.scene.add(mesh);
      }
    },

    handleEvents: function() {
      window.addEventListener("mousemove", this.onMouseMove, false);
      window.addEventListener("orientationchange", this.onScreenOrientationChange, false);
      window.addEventListener("deviceorientation", this.onDeviceOrientationInit, false);
      window.addEventListener("compassneedscalibration", this.onCompassNeedsCalibration, false);
    },
    removeListeners: function() {
      window.removeEventListener("mousemove", this.onMouseMove, false);
      window.removeEventListener("orientationchange", this.onScreenOrientationChange, false);
      window.removeEventListener("deviceorientation", this.onDeviceOrientationChange, false);
      window.removeEventListener("deviceorientation", this.onDeviceOrientationInit, false);
      window.removeEventListener("compassneedscalibration", this.onCompassNeedsCalibration, false);
    },

    createCanvasText: function(text) {
      let canvas = document.createElement("canvas");
      //document.body.appendChild(canvas);
      canvas.width = THREE.Math.ceilPowerOfTwo(
        this.stageSize.width
      );
      canvas.height = THREE.Math.ceilPowerOfTwo(
        this.stageSize.height
      );

      let ctx = canvas.getContext("2d");
      ctx.font = "35pt Arial";
      ctx.fillStyle = "rgba(255,255,255,1)";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(text, canvas.width / 2, canvas.height / 2);

      return canvas;
    },

    restrictFOV(vec2) {
      var maxWidth = this.stageSize.width >> 1,
        maxHeight = this.stageSize.height >> 1;
      return (vec2.x = (vec2.x - maxWidth) / maxWidth), (vec2.y = (vec2.y - maxHeight) / maxHeight), vec2;
    },

    onMouseMove: function (e) {
      this.mousePosition.x = e.clientX;
      this.mousePosition.y = e.clientY;
      this.restrictFOV(this.mousePosition);
    },

    onDeviceOrientationInit: function (e) {
      this.deviceOrientationInitialQuat = e;
      window.addEventListener("deviceorientation", this.onDeviceOrientationChange, false);
      window.removeEventListener("deviceorientation", this.onDeviceOrientationInit, false);
    },

    onDeviceOrientationChange: function (e) {
      this.deviceOrientation = e;
    },

    onScreenOrientationChange: function (e) {
      this.screenOrientation = window.orientation || 0;
    },

    onCompassNeedsCalibration: function (e) {
      e.preventDefault()
    },
/*
    initQuat: function (e, t, n, i) {
      L = new THREE.Quaternion;
      C = new THREE.Euler;
      O = new THREE.Quaternion;
      I = new THREE.Quaternion(-Math.sqrt(.5), 0, 0, Math.sqrt(.5));
      q = 0;
      return C.set(t, e, -n, "YXZ"), L.setFromEuler(C), q = -i / 2, O.set(0, Math.sin(q), 0, Math.cos(q)), L.multiply(O), L.multiply(I), L
    },

    updateDeviceMove: function () {
      if (Y = THREE.Math.degToRad(this.deviceOrientation.alpha || 0), X = THREE.Math.degToRad(this.deviceOrientation.beta || 0), G = THREE.Math.degToRad(this.deviceOrientation.gamma || 0), Z = THREE.Math.degToRad(this.screenOrientation || 0), 0 !== Y && 0 !== X && 0 !== G) {
        if (H = initQuat(Y, X, G, Z), this.initialQuat || (this.initialQuat = H.clone().conjugate()), this.freeze) return;
        this.quaternion.copy(H.clone().premultiply(this.initialQuat))
      }
    },*/

    updateCameraRotation: function() {
      if ( this.deviceOrientation ) {
        let alpha = this.deviceOrientation.alpha ? THREE.Math.degToRad( this.deviceOrientation.alpha ) + 0 : 0; // Z
        let beta = this.deviceOrientation.beta ? THREE.Math.degToRad( this.deviceOrientation.beta ) : 0; // X'
        let gamma = this.deviceOrientation.gamma ? THREE.Math.degToRad( this.deviceOrientation.gamma ) : 0; // Y''
        let orient = this.screenOrientation ? THREE.Math.degToRad( this.screenOrientation ) : 0; // O
        this.setCameraQuaternion( this.cameraRotationQuaternion, alpha, beta, gamma, orient );
      } else {
        this.cameraRotationQuaternion.setFromEuler(new THREE.Euler(-this.mousePosition.y, -this.mousePosition.x, 0));
      }
    },

    setCameraQuaternion: function () {
      var zee = new THREE.Vector3( 0, 0, 1 );
      var euler = new THREE.Euler();
      var q0 = new THREE.Quaternion();
      var q1 = new THREE.Quaternion( - Math.sqrt( 0.5 ), 0, 0, Math.sqrt( 0.5 ) ); // - PI/2 around the x-axis

      return function ( quaternion, alpha, beta, gamma, orient ) {
        euler.set( beta, alpha, - gamma, 'YXZ' ); // 'ZXY' for the device, but 'YXZ' for us
        quaternion.setFromEuler( euler ); // orient the device
        quaternion.multiply( q1 ); // camera looks out the back of the device, not the top
        quaternion.multiply( q0.setFromAxisAngle( zee, - orient ) ); // adjust for screen orientation
        //quaternion.premultiply(this.deviceOrientationInitialQuat);
      };

    }()
  },

  beforeDestroy: function() {
    console.log("on DESTROY");
    this.removeListeners();
  }
};
</script>

<style lang="scss">

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
