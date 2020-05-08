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
        this.scene.fog = new Three.Fog(0xaaaaaa, 0.010, 200);
        const ambientLight = new Three.AmbientLight('#fff',1) //自然光无法让实体形成阴影
        this.scene.add(ambientLight)
        this.camera = new Three.PerspectiveCamera(45, container.clientWidth/(window.innerHeight-65), 1, 10000);
        this.camera.position.set(0,30,50);
        this.camera.lookAt(this.scene.position);

        // this.camera = new Three.OrthographicCamera(-3.5, 3.5, 1.5, -1.5, 1,100);
        // this.camera.position.set(4, -3 ,5);
        // this.camera.lookAt(new Three.Vector3(0, 0, 0));
        // this.scene.add(this.camera);
  
      },
      addOne:function(){
            const boxGeo = new Three.BoxGeometry(5,5,5)
            new Three.TextureLoader().load('/static/sampledata/images/fire.png',texture =>{
                const boxMaterial = new Three.MeshLambertMaterial({
                   // color:'red', 
                    map:texture
                })
                const box  = new Three.Mesh(boxGeo,boxMaterial)
                box.position.set(0,2,2)
                this.scene.add(box)
                box.castShadow = true;
                this.renderer.shadowMap.enabled = true;
                this.renderer.render(this.scene, this.camera)
            })
        },
          addTwo:function(){
              new Three.TextureLoader().load('/static/sampledata/images/fire.png',texture =>{
                console.log(texture);
                var cube = new Three.Mesh(new Three.CubeGeometry(50,50,50),
                  new Three.MeshLambertMaterial({
                      map:texture
                  }));
                this.scene.add(cube);
                this.renderer.render(this.scene, this.camera);
              })
          },
           addPlane: function(){
            //平面
            const planeGeometry = new Three.PlaneGeometry(60, 20);
            const planeMaterial = new Three.MeshLambertMaterial({color: 0xffffff});
            const plane = new Three.Mesh(planeGeometry, planeMaterial);
            //水平面旋转并且设置位置
            plane.rotation.x = -0.5 * Math.PI;
            plane.position.set(0,-1,0)
            this.scene.add(plane);
            plane.receiveShadow = true;
        }
       
    },
    mounted () {
      this.init()
      this.addOne()
      // stat = new Stats()
      this.addPlane()
    }
  }
</script>
<style scoped>

</style>
