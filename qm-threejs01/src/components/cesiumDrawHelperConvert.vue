<template>
  <div>
      <div id="cesiumContainer" >
      </div>
      <div class="toolbar-search">
        <div  class="layoutinput" style="padding-top:5px;">
            世界坐标：
        </div>
        <div  class="layoutinput">
            <el-input
                size="small"
                placeholder="x"
                v-model="x1"
                clearable
             >
           
            </el-input>
              ，
        </div>
         <div class="layoutinput" >
            <el-input
                size="small"
                placeholder="y"
                v-model="y1"
                clearable>
            </el-input>
            ，
        </div>
         <div class="layoutinput" >
            <el-input
                size="small"
                placeholder="z"
                v-model="z1"
                clearable>
            </el-input>
        </div>


        
        <div  class="layoutinput" style="padding-top:5px;"  >
            地理坐标：
        </div>
        <div  class="layoutinput">
            <el-input
                size="small"
                placeholder="经度"
                v-model="lon"
                clearable>
            </el-input>
            ，
        </div>
        
         <div class="layoutinput" >
            <el-input
                size="small"
                placeholder="纬度"
                v-model="lat"
                clearable>
            </el-input>
            ，
        </div>
        
          <div class="layoutinput" >
            <el-input
                size="small"
                placeholder="高度"
                v-model="height"
                clearable>
            </el-input>
        </div>
      <div class="layoutinput">
         <el-radio-group v-model="flag">
               <el-radio :label=false><span class="el-radio-span">世界坐标转地理坐标</span></el-radio>
               <el-radio :label=true><span class="el-radio-span">地理坐标转世界坐标</span></el-radio>
            </el-radio-group>
        </div>
      </div>
     
  </div>
</template>

<script type="text/javascript">
import Cesium from 'cesium/Cesium'
import widgets from 'cesium/Widgets/widgets.css'
import {devPath,devPath2} from '../js/api/path'
export default {
  name: 'cesiumViewer',
  data(){
       return {
           x1:'',
           y1:'',
           z1:'',
           lon:'',
           lat:'',
           height:'',
           viewer:{},
           terrainProvider:{},  
           flag:false//true lontoxyz false xyztolon
       }
  },
  watch: {
      x1(value){ 
        this.xyzConvertLonLat(value,this.y1,this.z1);
      },
      y1(value){
        this.xyzConvertLonLat(this.x1,value,this.z1);
      },
      z1(value){
         this.xyzConvertLonLat(this.x1,this.y1,value);
      },
      lon(value){
        this.lonlatConvertXYZ(value,this.lat,this.height);
      },
      lat(value){
        this.lonlatConvertXYZ(this.lon,value,this.height);
      },
      height(value){
        this.lonlatConvertXYZ(this.lon,this.lat,value);
      }
  },
  methods:{
    createBillboard(x,y,z){
        var position =new Cesium.Cartesian3(x, y,z);
       // Cesium.Cartesian3.fromDegrees(jd, wd,0.0)
        var entity = this.viewer.entities.add(
          {
              id:"convert",
              name: "测试点位置",
              position: position,
              description:"<p>名称："+name+"</p><p>位置：("+x+","+y+","+z+")</p>",
              billboard: {
                image:'/static/sampledata/images/mark.png',
                width:50,
                height:50,
                verticalOrigin:Cesium.VerticalOrigin.BUTTOM,
                disableDepthTestDistance:Number.POSITIVE_INFINITY
              }        
          }
          );
      }, 
    //笛卡尔坐标转经度纬度高度
    xyzConvertLonLat:function(x,y,z){
      if(x && y && z && !this.flag){
        var ellipsoid=this.viewer.scene.globe.ellipsoid;
        var cartesian3=new Cesium.Cartesian3(x-0,y-0,z-0);//世界坐标/笛卡尔坐标
        var cartographic=ellipsoid.cartesianToCartographic(cartesian3);
        this.lat=Cesium.Math.toDegrees(cartographic.latitude);//cartograhphic.latitude(弧度)并非我们想要的  转化后的才是我们想要的（经纬度），
        this.lon=Cesium.Math.toDegrees(cartographic.longitude);
        this.height=cartographic.height;
        var myEntity = this.viewer.entities.getById("convert");
        if(!myEntity){
            this.createBillboard(x-0,y-0,z-0);
        }else{
            myEntity.position = cartesian3;
        }
       }
       
    }, 
    //地理坐标转换为笛卡尔坐标
    lonlatConvertXYZ:function(lon,lat,height){
        if(lon && lat && height && this.flag){
            var position = Cesium.Cartesian3.fromDegrees(lon-0,lat-0, height-0);
            this.x1 = position.x;
            this.y1 = position.y;
            this.z1 = position.z;
            var myEntity = this.viewer.entities.getById("convert");
            if(!myEntity){
                this.createBillboard(position.x-0,position.y-0,position.z-0);
            }else{
                myEntity.position = position;
            }
        }
    
    },
    initeCesium:function(){
        this.terrainProvider = new Cesium.CesiumTerrainProvider({
            url: devPath
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
            shouldAnimate:false,
            animation: true,  //是否显示动画控件
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
        //地形遮挡
        scene.globe.depthTestAgainstTerrain = false; 
        this.viewer.terrainProvider= this.terrainProvider;//地形数据源 terrainProvider
        // this.viewer.scene.globe.depthTestAgainstTerrain = true;
        this.viewer.camera.flyTo({
            destination : Cesium.Cartesian3.fromDegrees(87.6025567237875,42.33342636310676, 40000)
        });
        //


     }
  
      
  },
  mounted () {
        var that = this;
        this.initeCesium();
         var promise=that.viewer.dataSources.add(Cesium.GeoJsonDataSource.load('/static/sampledata/vector/市界.json'));//默认是黄色
 
  promise.then(function (dataSource) {
        that.viewer.dataSources.add(dataSource);
        var entities = dataSource.entities.values;
        var colorHash = {};
        var labelEntities=[];
        var operation={
          
            disShowColor:function () {  //初始化 的时候  不显示随机颜色 不显示边框
                for (var i = 0; i< entities.length; i++) {
                    var entity = entities[i];
                    entity.polygon.material =Cesium.Color.YELLOW.withAlpha(0.01);
                    entity.polygon.outlineColor =Cesium.Color.YELLOW;
                    entity.beOf="中国地图";
                }
            } ,showLabel:function () {//显示标签
                for (var i = 0; i < entities.length; i++) {
                    var entity = entities[i];
                    var name = entity.name;// console.log(name);
                    var location=entity.properties.cp.getValue();
                    var labelEntity=viewer.entities.add({
                        position : Cesium.Cartesian3.fromDegrees(location[0],location[1]),
                        label : {
                            text :name
                            ,font:'14px Helvetica',
                        }
                    });
                    labelEntities.push(labelEntity);
                }
            }
   
            
        };

        operation.disShowColor();
        operation.showLabel();
    })
 }
}

</script>
<style scoped>
.el-radio-span {
    color: #ffffff; 
}


       #cesiumContainer {
            position: absolute;
            top: 0px;
            left: 0;
            height: 100%;
            width: 100%;
            margin: 0;
            overflow: hidden;
            padding: 0;
            font-family: sans-serif;
        }
        .layoutinput{
            margin-top:5px;
            float:left;
            padding-left:10px;
            color:#ffffff;
        }
         .toolbar-search{
            background: rgba(42,42,42,0.8);
            padding:10px;
            font-size:14px;
            max-width: 1050px;
            border-radius: 4px;
            position: absolute;
            color: #ffffff;
            top: 4px;
            left:4px;
        }
         #toolbar{
            background: rgba(255,255,255,0.8);
            padding:10px;
            font-size:14px;
            border-radius: 4px;
            position: absolute;
            color: #ffffff;
            top: 154px;
            left:4px;
        }
        #logging {
            position: absolute;
            bottom: 0px;
            right: 0;
            display: inline;
            margin: 10px;
            padding: 10px;
            background: white;
        }

        .el-input{
            width:100px;
        }
  
</style>
