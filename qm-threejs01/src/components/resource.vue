<template>
<div>
     <div class="fullSize" id="cesiumContainer">
       
     </div>
   
    <div id="toolbar">
       <!--给全选按钮绑定v-mode变量，值为true时就是选中状态，绑定点击事件，执行全选和反选操作-->
        <input type='checkbox'  v-model='checked' v-on:click='checkedAll'>全选
        <span v-for='checkb in checkboxData' :key="checkb.id">
            <!--给每个复选按钮绑定同一个v-mode数组变量，数组里面有相应的value就被选中-->
            <input type='checkbox'  name='checkboxinput' v-model='checkboxList' :value="checkb.id">{{checkb.value}}
        </span>
    </div>
  </div>

</template>

<script type="text/javascript">
import Cesium from 'cesium/Cesium'
// import {DrawHelper} from '../js/Tools-03DrawHelper'
// import {Cesiumtj} from '../js/cesiumtj/ysc'
import widgets from 'cesium/Widgets/widgets.css'
import {devPath2} from '../js/api/path'
// import FileSaver from 'file-saver'
export default {
  name: 'cesiumViewer',
  data() {
        return {
           checkboxData:[{
                id:'1',
                value:'被试装备'
            },{
                id:'2',
                value:'保障资源'
            },{
                id:'3',
                value:'空域资源'
            },{
                id:'4',
                value:'地域资源'
            },
            {
                id:'5',
                value:'人力资源'
            },
            {
                id:'6',
                value:'外部临时资源'
            }
            ],
            checkboxList:[],
            checked: false,
            state:'all',
            viewer:{},
            terrainProvider:{},

        }
    },
  methods:{
   checkedAll: function() {
        if (this.checked) {//实现反选
            this.checkboxList = [];
        } else { //实现全选
            this.checkboxList = [];
            this.checkboxData.forEach( (item) => {
                this.checkboxList.push(item.id);
            });
        }
    },
    LonlatPointsTerrainData:function (lonlats, callback) {
         var terrainLevel = 14;//数据等级
        //请求高程
        var pointArrInput = [];
        for (var i = 0; i < lonlats.length; i++) {
            pointArrInput.push(Cesium.Cartographic.fromDegrees(lonlats[i].lon, lonlats[i].lat));
        }
        var promise = Cesium.sampleTerrain(this.terrainProvider, terrainLevel, pointArrInput);//pointArrInput
        Cesium.when(promise, function (updatedPositions) {
            callback(updatedPositions);
        });
    },

     initeCesium(){
        this.terrainProvider = new Cesium.CesiumTerrainProvider({
            url: '/static/sampledata/terrain/sq/'
        });
        const globemap = Cesium.createTileMapServiceImageryProvider({
            url: devPath2,
            fileExtension: 'png'
        });

        const _this = this;
        _this.viewerDefaultProperty = {
            imageryProvider: globemap,
            sceneModePicker:true,
            contextOptions: {
                    webgl: {
                        alpha: true
                    }
            },
            contextOptions: _this.dropBackground ? {
              webgl: {
                alpha: true,
              }
            } : {},
            
            selectionIndicator: true,
            animation: false,  //是否显示动画控件
            baseLayerPicker: false, //是否显示图层选择控件
            geocoder: false, //是否显示地名查找控件
            timeline: false, //是否显示时间线控件
            sceneModePicker: true, //是否显示投影方式控件
            navigationHelpButton: false, //是否显示帮助信息控件
            infoBox: true,  //是否显示点击要素之后显示的信息
            fullscreenButton: true
        }


        this.viewer = new Cesium.Viewer('cesiumContainer',_this.viewerDefaultProperty);
        //this.viewer.extend(Cesium.viewerCesiumInspectorMixin);
        this.viewer._cesiumWidget._creditContainer.style.display = "none";
        var scene = this.viewer.scene;
        scene.globe.depthTestAgainstTerrain = false; 
        
        // this.viewer.scene.globe.depthTestAgainstTerrain = true;

     },
     //建立模型方法
     createModel(id,name,state,url, height,jd,wd) {
        var position = Cesium.Cartesian3.fromDegrees(jd, wd, height);
        // var position1 = Cesium.Cartesian3.fromDegrees(128, 42, height);
        var heading = Cesium.Math.toRadians(90);
        var pitch = 0;
        var roll = 0;
        var hpr = new Cesium.HeadingPitchRoll(heading, pitch, roll);
        var orientation = Cesium.Transforms.headingPitchRollQuaternion(position, hpr);

        var entity = this.viewer.entities.add(
        {
            id :id,
            name: name,
            position: position,
            description:"<p>名称："+name+"</p><p>位置：("+jd+","+wd+")</p><p>进场时间：2019年9月15日</p><p>状态：在用</p><p>责任单位：xxx单位</p><p>存放部位：xxx场站</p>",
            orientation: orientation,
            model: {
                uri: url,
                minimumPixelSize: 80,
                maximumScale: 200,
                color: (state==1)?Cesium.Color.RED:Cesium.Color.WHITE
            }        
        }
        );
     },
    createBillboard(url,height,jd,wd){
        //var uri = Cesium.buildModuleUrl(url); 
        var name='XXX试验保障资源';
        var position = Cesium.Cartesian3.fromDegrees(jd, wd,0.0);
        var entity = this.viewer.entities.add(
          {
          
              name: "XXX试验保障资源",
              position: position,
              description:"<p>名称："+name+"</p><p>位置：("+jd+","+wd+")</p><p>进场时间：2019年9月15日</p><p>状态：在用</p><p>责任单位：xxx单位</p><p>存放部位：xxx场站</p>",

              billboard: {
                image:'/static/sampledata/images/mark.png',
                width:50,
                height:50,
                verticalOrigin:Cesium.VerticalOrigin.BOTTOM,
                disableDepthTestDistance:Number.POSITIVE_INFINITY
              }        
          }
          );
      },     
      createPolygon(height,jd,wd){
          //Polygon 
          var name ='xxx地域资源';
          this.viewer.entities.add({
              name: 'xxx地域资源',
              description:"<p>名称："+name+"</p><p>地标：("+jd+","+wd+")</p><p>使用时间：2019年9月15日-2019年9月30日</p><p>当前状态：在用</p>",
              polygon: {
                  hierarchy: Cesium.Cartesian3.fromDegreesArray([87.29400410995653,42.18890928843232,          
                                                                87.30346638196421,42.17655524792318,
                                                                  87.3044919528929,42.16533983603367,
                                                                  87.27766359113639,42.15981805971348,
                                                                  87.26768685860806,42.17217038946095
                                                                  ]),
                  material: Cesium.Color.GREEN.withAlpha(0.5),
                  
              }
          });
      },
      
     createEllipse(height,jd,wd){
        //Ellipse
        var name ='XX空域资源';
        this.viewer.entities.add({
            position: Cesium.Cartesian3.fromDegrees(jd, wd,15000),
            name: 'xxx空域',
            description:"<p>名称："+name+"</p><p>地标：("+jd+","+wd+")</p><p>使用时间：2019年9月15日-2019年9月30日</p><p>当前状态：在用</p>",
            ellipse: {
                semiMinorAxis: 2500.0,
                semiMajorAxis: 4000.0,
                height: 3000.0,
                material: Cesium.Color.BLUE.withAlpha(0.3),
                outline: true,
                outlineColor: Cesium.Color.BLUE
            }
        });
      }

    },
     watch: {
        checkboxList: {
            handler: function (val, oldVal) { 
            this.viewer.entities.removeAll();  
            val.forEach( (item) => { 
                switch(item){
                  case '1':
                      this.createModel(6,"xxx型无人机",0,'/static/sampledata/model/Cesium_Air.glb', 10.0,87.34447031887072,42.15926751099633);
                      this.createModel(61,"xxx型无人机",0,'/static/sampledata/model/Cesium_Air.glb', 10.0, 87.3652476287682,42.15992770355325);
                      this.createModel(62,"xxx型无人机",0,'/static/sampledata/model/Cesium_Air.glb', 10.0,87.38372456028378,42.15955389537763);
                      this.createModel(5,"xxx型无汽车",1,'/static/sampledata/model/GroundVehicle.glb', 0.0,87.33447031887072,42.16926751099633);
                    break;
                  case '2':
                      this.createModel(2,"XX塔台",0,'/static/sampledata/model/Wood_Tower.gltf', 0.0,87.33447031887072,42.18926751099633);
                      this.createModel(3,"XX靶标",0,'/static/sampledata/model/111.gltf', 0.0,87.34447031887072,42.18926751099633);
                      this.createModel(4,"XX靶标",0,'/static/sampledata/model/barrel.gltf', 0.0,87.32447031887072,42.17926751099633);
                      this.createModel(7,"XX靶标",0,'/static/sampledata/model/barrel.gltf', 10.0,87.31447031887072,42.12926751099633);
                      this.createModel(8,"XX靶标",0,'/static/sampledata/model/barrel.gltf', 10.0,87.33447031887072,42.13926751099633);
                      this.createModel(9,"XX靶标",0,'/static/sampledata/model/barrel.gltf', 10.0,87.34947031887072,42.19926751099633);
                      this.createModel(10,"XX靶标",0,'/static/sampledata/model/barrel.gltf', 10.0,87.24447031887072,42.14028751099633);
                   break;
                   case '3':
                     this.createEllipse(0.0,87.24515392911044,42.19972496682215);
                    break;
                   case '4':
                    this.createPolygon( 0.0,87.32447031887072,42.18926751099633);
                      break;
                    case '5':    
                      this.createBillboard('/static/sampledata/images/mark.png', 0.0,87.32447031887072,42.18926751099633);
                      this.createBillboard('/static/sampledata/images/mark.png', 0.0, 87.15570408353828,42.17517458176745);
                      this.createBillboard('/static/sampledata/images/mark.png', 0.0, 87.18286496030532,42.16122149438242);
                      this.createBillboard('/static/sampledata/images/mark.png', 0.0, 87.19688531749593,42.153688807239);
                      this.createBillboard('/static/sampledata/images/mark.png', 0.0, 87.25885437580833,42.15614324443346);
                      this.createBillboard('/static/sampledata/images/mark.png', 0.0, 87.1640059098915,42.19204024639427);
                      this.createBillboard('/static/sampledata/images/mark.png', 0.0, 87.16397872858148,42.20956461779001);
                      this.createBillboard('/static/sampledata/images/mark.png', 0.0, 87.17978431542784,42.21911251821844);
                      this.createBillboard('/static/sampledata/images/mark.png', 0.0, 87.1231206363514,42.1880111176347);
                      this.createBillboard('/static/sampledata/images/mark.png', 0.0, 87.12805725554536,42.1583137058125);      
                    break;
                }
            });

             if (this.checkboxList.length === this.checkboxData.length) {
                    this.checked=true;
                } else {
                    this.checked=false;
                }
            },
            deep: true
        }
    },
  mounted () {
    //初始化全选
    this.checkedAll();
    this.initeCesium();
    var viewer = this.viewer;
    //设置初始位置
    var homePOsition = [87.25447031887072,42.17926751099633, 21000];
    viewer.camera.setView({
        destination: Cesium.Cartesian3.fromDegrees(homePOsition[0], homePOsition[1], homePOsition[2])
        // destination  :Cesium.Cartesian3.fromDegrees( 128.055, 42.006, 30000 )
    });
  
         //鼠标点击事件
        var viewer = this.viewer;
         var cartesian;
        var LonlatPointsTerrainData = this.LonlatPointsTerrainData;
        var myevent =new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
        var ellipsoid = viewer.scene.globe.ellipsoid;
        myevent.setInputAction(function(movement){
            cartesian = viewer.camera.pickEllipsoid(movement.position, ellipsoid);//movement.endPosition
            if (cartesian) {
                //将笛卡尔坐标转换为地理坐标
                var cartographic = Cesium.Cartographic.fromCartesian(cartesian);
                var longitudeDegree = Cesium.Math.toDegrees(cartographic.longitude);
                var latitudeDegree = Cesium.Math.toDegrees(cartographic.latitude);
                LonlatPointsTerrainData([{ 'lon': longitudeDegree, 'lat': latitudeDegree }],
                    function (terrainData) {
                        if (terrainData.length > 0) {
                            // console.log('lon:' + Cesium.Math.toDegrees(terrainData[0].longitude) +
                            //     '\nlat:' + Cesium.Math.toDegrees(terrainData[0].latitude) +
                            //     '\nheight:' +  (terrainData[0].height ? terrainData[0].height : 0)
                            //     );
                            var lon = Cesium.Math.toDegrees(terrainData[0].longitude);
                            var lat = Cesium.Math.toDegrees(terrainData[0].latitude);
                            var  cartesian1 =  Cesium.Cartesian3.fromDegrees(lon,lat,terrainData[0].height+500);
                            // console.log(cartesian1.x+","+cartesian1.y+","+cartesian1.z);
                             var position1 = new Cesium.Cartesian3(192152.3972616616,4730030.668044226,4262765.933907292); // x y z
                            var cartographicPosition = Cesium.Ellipsoid.WGS84.cartesianToCartographic(position1);  // longitude, latitude, height
                            console.log( Cesium.Math.toDegrees(cartographicPosition.longitude)+","+Cesium.Math.toDegrees(cartographicPosition.latitude)+","+cartographicPosition.height);
                            

                        } else {
                            alert('nodata');
                        }
                        
                });
            }
            //    var cartesian2 = viewer.scene.pickPosition(movement.position);
            //   var cartographic = Cesium.Cartographic.fromCartesian(cartesian2);
            //   var lon = Cesium.Math.toDegrees(cartographic.longitude);
            //   var lat = Cesium.Math.toDegrees(cartographic.latitude);
            //   console.log(lon+"-----"+lat);
            // //   var wgs84 = ellipsoid.cartesianToCartographic(cartesian);
            // //  console.log(cartesian.x+","+cartesian.y+","+cartesian.z);
            //   var  cartesian1 =  Cesium.Cartesian3.fromDegrees(lon,lat,1000);
            //   console.log(cartesian1.x+","+cartesian1.y+","+cartesian1.z);
        },Cesium.ScreenSpaceEventType.LEFT_UP)
    //选中事件
    var handler = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas);

    handler.setInputAction(function (movement) {
          var pick =viewer.scene.pick(movement.position);
          if (Cesium.defined(pick) && (pick.id.id ===1)) {
              alert('picked!');
          }
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

    // var lon=87.33447031887072;
    // var lat=42.16926751099633;

    // Cesiumtj.addCircleRipple(viewer,{ //默认只绘制两个圆圈叠加 如遇绘制多个，请自行源码内添加。
    //     id:"111",
    //     lon:lon,
    //     lat:lat,
    //     height:0,
    //     maxR:3000,
    //     minR:0,//最好为0
    //     deviationR:200,//差值 差值也大 速度越快
    //     eachInterval:1000,//两个圈的时间间隔
    //     imageUrl:'/static/sampledata/images/redCircle2.png'
    // });

  }//mounted
}
</script>
<style scoped>
#toolbar{
  background: rgba(42,42,42,0.8);
  padding:10px;
  font-size:14px;
  border-radius: 4px;
   position: absolute;
  color: #ffffff;
   top: 4px;
    left: 4px;
}
.fullSize{
  height: 100%;
}
</style>
