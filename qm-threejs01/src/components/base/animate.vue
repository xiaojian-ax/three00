<template>

    <div id="container"></div>
  
</template>

<script>
  import * as THREE from 'three'
  import OrbitControls from "three/examples/js/controls/OrbitControls"
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
        this.renderer = new THREE.WebGLRenderer({antialias: true})
        this.renderer.setSize(container.clientWidth,window.innerHeight-65)
        this.renderer.shadowMapEnabled = true;
        container.appendChild(this.renderer.domElement)
        this.scene = new THREE.Scene();
        this.scene.fog = new THREE.Fog(0xaaaaaa, 0.010, 200);
        const ambientLight = new THREE.AmbientLight('#cccccc',1) //自然光无法让实体形成阴影
        var light = new THREE.PointLight(0xffffff, 2, 100);
        light.position.set(0, 10, 20);
        light.castShadow = true;
        this.scene.add(light);
        this.scene.add(ambientLight)
        this.camera = new THREE.PerspectiveCamera(45, container.clientWidth/(window.innerHeight-65), 1, 10000);
        this.camera.position.set(0,30,50);
        this.camera.lookAt(this.scene.position);

        // this.camera = new THREE.OrthographicCamera(-3.5, 3.5, 1.5, -1.5, 1,100);
        // this.camera.position.set(4, -3 ,5);
        // this.camera.lookAt(new THREE.Vector3(0, 0, 0));
        // this.scene.add(this.camera);
  
      },
      addOne:function(){
            const boxGeo = new THREE.BoxGeometry(5,5,5)
            new THREE.TextureLoader().load('/static/sampledata/images/fire.png',texture =>{
                const boxMaterial = new THREE.MeshLambertMaterial({
                   // color:'red', 
                    map:texture
                })
                const box  = new THREE.Mesh(boxGeo,boxMaterial)
                box.position.set(0,2,2)
                this.scene.add(box)
                box.castShadow = true;
                this.renderer.shadowMap.enabled = true;
                this.renderer.render(this.scene, this.camera)
            })
        },
          addObj:function(){
            // var that = this;
            // var loader = new THREE.OBJMTLLoader();
            //   loader.addEventListener('load', function(event) {
            //       var obj = event.content;
            //       mesh = obj;
            //       that.scene.add(obj);
            //   });
            //   loader.load('/static/sampledata/madel/wrj/wrj_01.obj', '/static/sampledata/madel/wrj/wrj_01.mtl');
          },
           addPlane: function(){
            //平面
            const planeGeometry = new THREE.PlaneGeometry(60, 20);
            const planeMaterial = new THREE.MeshLambertMaterial({color: 0xffffff});
            const plane = new THREE.Mesh(planeGeometry, planeMaterial);
            //水平面旋转并且设置位置
            plane.rotation.x = -0.5 * Math.PI;
            plane.position.set(0,-1,0)
            this.scene.add(plane);
            plane.receiveShadow = true;
        },
        //   animatePlane:function (O,a,R,x,z) {
        //     a = a + 0.005
        //     x = O[0] + R * Math.cos(a)
        //     z = O[1] + R * Math.sin(a)
        //     this.camera.position.set(x,30,z)
        //     this.camera.lookAt(new THREE.Vector3(0,0,0))
        //     var that = this;
        //     requestAnimationFrame( function() {
        //           that.animatePlane(O,a,R,x,z); 
        //     })
        //     this.renderer.render(this.scene, this.camera)
        // }
      //  , 
         initControls:function() {
            const  controls = new OrbitControls(this.camera, this.renderer.domElement);
            // 如果使用animate方法时，将此函数删除
            //controls.addEventListener( 'change', render );
            // 使动画循环使用时阻尼或自转 意思是否有惯性
            controls.enableDamping = true;
            //动态阻尼系数 就是鼠标拖拽旋转灵敏度
            //controls.dampingFactor = 0.25;
            //是否可以缩放
            controls.enableZoom = true;
            //是否自动旋转
            controls.autoRotate = true;
            controls.autoRotateSpeed = 0.5;
            //设置相机距离原点的最远距离
            controls.minDistance = 1;
            //设置相机距离原点的最远距离
            controls.maxDistance = 200;
            //是否开启右键拖拽
            controls.enablePan = true
            return controls
        },
         animate:function(controls) {
            var that = this
            controls.update()
            this.renderer.render(this.scene,this.camera)
            requestAnimationFrame(function(){
               that.animate(controls); 
            })
        }
    },
    mounted () {
      var _this = this;
      this.init()
      this.addOne()
 
      this.addPlane()

      
      //  //环视
      //   const O = [0,0],R = 50
      //   let  a = 0.5*Math.PI,x   =  O[0] +  R   *   Math.cos(a),
      //       z = O[1] +  R * Math.sin(a)
      //   this.animatePlane(O,a,R,x,z)
      const  controls = this.initControls()
      this.animate(controls)
       
    }
  }
</script>
<style scoped>

</style>
