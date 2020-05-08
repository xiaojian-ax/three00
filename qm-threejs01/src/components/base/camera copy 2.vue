<template>

    <div id="container"></div>
  
</template>

<script>
  import * as Three from 'three'

  export default {
    name: 'ThreeCamera',
    data () {
      return {
        camera: null,
        scene: null,
        renderer: null,
        mesh: null
      }
    },
    methods: {
      init: function () {
        let container = document.getElementById('container')
        this.renderer = new Three.WebGLRenderer({antialias: true})
        this.renderer.setSize(container.clientWidth,window.innerHeight-65)
        container.appendChild(this.renderer.domElement)
        this.scene = new Three.Scene();


        // this.camera = new Three.PerspectiveCamera(45, 4 / 3, 1, 1000);
        // this.camera.position.set(0, 0, 5);
        // this.scene.add(this.camera);
        console.log(container.clientWidth)
        console.log(window.innerHeight-65)
        this.camera = new Three.OrthographicCamera(-3.5, 3.5, 1.5, -1.5, 1,100);
        this.camera.position.set(4, -3 ,5);
        this.camera.lookAt(new Three.Vector3(0, 0, 0));
        this.scene.add(this.camera);
        var cube = new Three.Mesh(new Three.CubeGeometry(1, 1, 1),
          new Three.MeshBasicMaterial({
              color: 0xff0000,
              wireframe: true
          })
        );
        this.scene.add(cube);
        this.renderer.render(this.scene, this.camera);
      },
    },
    mounted () {
      this.init()
    }
  }
</script>
<style scoped>

</style>
