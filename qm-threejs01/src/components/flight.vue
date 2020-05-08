<template>

<el-countainer>
     <div class="fullSize" id="cesiumContainer" ></div>
    
    <!-- <div id="toolbar-resource">
        <el-button @click="drawer = true" type="Warning" style="margin-left: 16px;">
           试验资源
        </el-button>

        <el-drawer
            title="试验资源规划详情"
            :visible.sync="drawer"
            :modal="false"
            @open="handleOpen"
            size="40%"
         >
     
        <el-container>
            <el-header style="height:200px;">
              <div id="myChart" :style="{width: '100%', height: '200px'}"  ref="chart"></div>

            </el-header>
         
            <el-main>        
                 <el-scrollbar  wrap-class="scrollList" wrap-style="color: red; height:100%" 
                    view-class="view-box" view-style="font-weight: bold;width:100%;height:100%;" 
                    :native="false" >
                <el-collapse v-model="activeNames">
                    <el-collapse-item title="被试装备" name="1" >
                        <div>XXX型空中侦察无人机</div>
                        <div>XXX轰炸无人机</div>
                    </el-collapse-item>
                    <el-collapse-item title="陪试装备" name="2">
                        <div>XXX相控阵雷达</div>
                        <div>歼-xx飞机</div>
                    </el-collapse-item>
                    <el-collapse-item title="保障资源" name="3">
                        <div>xxx空中靶标</div>
                        <div>xxx测试测量设备</div>
                        <div>xxx指挥信息系统</div>
                    </el-collapse-item>
                    <el-collapse-item title="人力资源" name="4">
                        <div>xxx作战部队</div>
                        <div>xxx地勤保障大队</div>
                    </el-collapse-item>
                     <el-collapse-item title="空地域资源" name="5">
                        <div>xxx空域</div>
                        <div>xxx地域</div>
                    </el-collapse-item>
                     <el-collapse-item title="气象资源" name="6">
                        <div></div>
                        <div></div>
                    </el-collapse-item>
                     <el-collapse-item title="其他临时资源" name="7">
                        <div></div>
                        <div></div>
                    </el-collapse-item>
                </el-collapse>              
                    </el-scrollbar>
            </el-main>
                  
         </el-container>

        </el-drawer>
    </div>  -->

    <!-- <div id="toolbar-search"  style="width:300px;">
        <el-select v-model="value" placeholder="请选择" @change="changeMission" style="margin-bottom: 0px!important;" popper-class="selectClass" >
                <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
                >
                </el-option>
            </el-select>
    </div> -->
</el-countainer>
</template>

<script type="text/javascript">
import Cesium from 'cesium/Cesium'
import {Cesiumtj} from '../js/cesiumtj/ysc'
import widgets from 'cesium/Widgets/widgets.css'
import {devPath,devPath2} from '../js/api/path'
export default {
 
    data() {
        return {
          winHeight:window.innerHeight-65,
          activeNames: ['1'],
           drawer: false,
           primitive:{},
           checkboxData:[{
                id:'1',
                value:'xx型无人机作战试验'
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
            options: [{
                value: '1',
                label: '[规划完毕] xxx无人机电磁对抗'
                }, {
                value: '2',
                label: '[规划中] xxx型无人机空中侦察'
                }, {
                value: '3',
                label: '[未归化] xxx型无人机作战试验'
                }, {
                value: '4',
                label: '[未归化] 型无人机性能试验'
                }, {
                value: '5',
                label: '[未归化] 型无人机首飞'
                }, {
                value: '6',
                label: '[未归化] 型无人机首飞'
                }],
                 value:'1',
               viewer:{},
               terrainProvider:{},
                czmlPath :'/static/sampledata/czml/',
                partsToLoad:[],
                dataSource:{},
                vehicleEntity:{},
                pathName:''
        }
       
  },
   methods:{
      handleOpen(done) {
        this.$nextTick(() => {
                this.drawLine();
        });

      },
    changeMission: function() {
                
        var center = { lon: 87.82991953393098, lat:42.40955225658355,height:1532.5127590781335};
        var center1 = { lon:87.87786784416839,lat:42.37559741040185,height:1461.7894748721842};
        var center2 = { lon:87.7417460033048,lat:42.36984450877689,height:1203.0323187296565};

        var center3 = { lon: 87.25481927429595, lat: 42.1784562619594};
        var center4 = { lon:87.34497562062207,lat:42.17168052766106};
          if(this.value==1)
          {
               this.viewer.dataSources.remove(this.dataSource);
               this.viewer.scene.postProcessStages.removeAll();
                this.pathName = 'MultipartVehicle_part1.czml';
                this.initFly(this.pathName);
                // 添加雷达.
                this.processPart(center,center1,center2);
                this.viewer.camera.flyTo({
                    destination : Cesium.Cartesian3.fromDegrees(87.6025567237875,42.33342636310676, 40000)
                });
                // 87.62149662704819-----42.33805180122296
          }else if(this.value==2){
              this.viewer.dataSources.remove(this.dataSource);
              this.viewer.scene.postProcessStages.removeAll();
               this.pathName = 'MultipartVehicle_part11.czml';
                this.initFly(this.pathName);
                  this.viewer.camera.flyTo({
                    destination : Cesium.Cartesian3.fromDegrees(87.32981708225442,42.1696611047525, 11000)
                });
                // Load the first part up front.
                this.processPart(center3,center4);
          }else
          {
              this.viewer.dataSources.remove(this.dataSource);
              this.viewer.scene.postProcessStages.removeAll();
          };
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
            shouldAnimate:true,
            animation: true,  //是否显示动画控件
            baseLayerPicker: false, //是否显示图层选择控件
            geocoder: false, //是否显示地名查找控件
            timeline: true, //是否显示时间线控件
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
        this.viewer.terrainProvider= this.terrainProvider;//地形数据源 terrainProvider
        // this.viewer.scene.globe.depthTestAgainstTerrain = true;
     },
     initFly:function(pathName){
        // Add a blank CzmlDataSource to hold our multi-part entity/entities.
        this.dataSource = new Cesium.CzmlDataSource();
        this.viewer.dataSources.add(this.dataSource);
        var statusDisplay = document.createElement('div');
        var fuelDisplay = document.createElement('div');
        // This demo shows how a single path can be broken up into several CZML streams.

        this.dataSource.process(this.czmlPath + pathName).then(function(dataSource) {
            // console.log(dataSource+this.viewer);
            //   this.viewer.clock.onTick.removeEventListener(this.eventFun);
        });
 
     },
     // Helper function to mark a part as requested, and process it into the dataSource.
    processPart:function(center,center1,center2,center3,center4,center5,center6,center7) {

            //添加雷达图
            Cesiumtj.addRadarScan(this.viewer,{
                lon:center.lon,//经度
                lat:center.lat, //纬度
                scanColor:new Cesium.Color(1.0, 0.1, 0.1, 1),//红，绿，蓝，透明度
                r:1500,//扫描半径
                interval:4000//时间间隔
            });
            Cesiumtj.addRadarScan(this.viewer,{
                lon:center1.lon,//经度
                lat:center1.lat, //纬度
                scanColor:new Cesium.Color(1.0, 0.1, 0.1, 1),//红，绿，蓝，透明度
                r:1500,//扫描半径
                interval:4000//时间间隔
            });
            if(center2){
                Cesiumtj.addRadarScan(this.viewer,{
                    lon:center2.lon,//经度
                    lat:center2.lat, //纬度
                    scanColor:new Cesium.Color(1.0, 0.1, 0.1, 1),//红，绿，蓝，透明度
                    r:1500,//扫描半径
                    interval:4000//时间间隔
                });
            }
 
    },
     //建立模型方法
     createModel:function(id,name,state,url, height,jd,wd) {
        var position = Cesium.Cartesian3.fromDegrees(jd, wd, height);
        // var position1 = Cesium.Cartesian3.fromDegrees(128, 42, height);
        var heading = Cesium.Math.toRadians(90);
        var pitch = -0.1;
        var roll = 0;
        var hpr = new Cesium.HeadingPitchRoll(heading, pitch, roll);
        var orientation = Cesium.Transforms.headingPitchRollQuaternion(position, hpr);
        var entity = this.viewer.entities.add(
        {
            id :id,
            name: name,
            position: position,
            // availability:new Cesium.TimeIntervalCollection([new Cesium.TimeInterval({
            //      start : Cesium.JulianDate.fromIso8601('2019-08-04T16:03:10Z'),
            //      stop : Cesium.JulianDate.fromIso8601('2019-08-04T16:04:50Z'),
            //  })]),
            description:"<p>名称："+name+"</p><p>位置：("+jd+","+wd+")</p><p>进场时间：2019年9月15日</p><p>状态：在用</p><p>责任单位：xxx单位</p><p>存放部位：xxx场站</p>",
            orientation: orientation,
            model: {
                uri: url,
                minimumPixelSize: 0.01,
                maximumScale: 0.01,
                color: (state==1)?Cesium.Color.RED:Cesium.Color.WHITE
            }        
        }
        );
   
         return  entity;
     },
     computeModelMatrix:function (entity, time) {
        var position = Cesium.Property.getValueOrUndefined(entity.position, time, new Cesium.Cartesian3());
             if (!Cesium.defined(position)) {
                    return undefined;
            }
        var orientation = Cesium.Property.getValueOrUndefined(entity.orientation, time, new Cesium.Quaternion());
        if (!Cesium.defined(orientation)) {
            var modelMatrix = Cesium.Transforms.eastNorthUpToFixedFrame(position, undefined, new Cesium.Matrix4());
        } else {
            modelMatrix = Cesium.Matrix4.fromRotationTranslation(Cesium.Matrix3.fromQuaternion(orientation, new Cesium.Matrix3()), position, new Cesium.Matrix4());
        }
        return modelMatrix;
   },
   //粒子效果平移矩阵
    computeEmitterModelMatrix:function () {
        var hpr = Cesium.HeadingPitchRoll.fromDegrees(0.0, 0.0, 0.0, new Cesium.HeadingPitchRoll());
        var trs = new Cesium.TranslationRotationScale();
        trs.translation = Cesium.Cartesian3.fromElements(4.0, 0.0, 190.0, new Cesium.Cartesian3());
        trs.rotation = Cesium.Quaternion.fromHeadingPitchRoll(hpr, new Cesium.Quaternion());
        return Cesium.Matrix4.fromTranslationRotationScale(trs, new Cesium.Matrix4());
    },
    createParticleSys:function(entity){
     this.primitive =this.viewer.scene.primitives.add(new Cesium.ParticleSystem({
        // Particle appearance
        id:'taiji',
        image : '/static/sampledata/images/fire.png',
        imageSize : new Cesium.Cartesian2(15, 15),
        startScale : 1.0,
        endScale : 4.0,
        // Particle behavior
        particleLife : 1.0,
        speed : 5.0,
        // Emitter parameters
        // emitter : new Cesium.ConeEmitter(Cesium.Math.toRadians(50.0)),
        emitter: new Cesium.BoxEmitter(new Cesium.Cartesian3(20.0, 20.0, 20.0)),
        emissionRate : 30.0,
        emitterModelMatrix : this.computeEmitterModelMatrix(),
        // Particle system parameters
        modelMatrix : entity.computeModelMatrix(Cesium.JulianDate.fromIso8601('2019-08-04T16:03:10Z'),new Cesium.Matrix4()),
        lifetime : 100.0,
        // bursts : [
        //     new Cesium.ParticleBurst({time : 5.0, minimum : 300, maximum : 500}),
        //     new Cesium.ParticleBurst({time : 10.0, minimum : 50, maximum : 100}),
        //     new Cesium.ParticleBurst({time : 15.0, minimum : 200, maximum : 300})
        //  ],
     }));
    },
    drawLine:function(){
        // 基于准备好的dom，初始化echarts实例
        var bar_dv = this.$refs.chart;
        let myChart = this.$echarts.init(bar_dv, 'dark');
        // 绘制图表
        var option = {
            // title:{text:'试验资源分布', left:'center' },
            backgroundColor:'', //设置无背景色
            color: ['#3398DB'],
            tooltip : {
                trigger: 'axis',
                axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                    type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                }
            },
            grid: {
                top: '5%',
                left: '0%',
                right: '0%',
                bottom: '0%',
                containLabel: true
            },
            xAxis : [
                {
                    type : 'category',
                    data : ['被试装备', '配试装备', '保障资源', '人力资源', '空地域资源', '气象资源', '其他临时资源'],
                    axisTick: {
                        alignWithLabel: true
                    },
                    axisLabel: {  
                        interval:0,  
                        rotate:40,
                        textStyle: {
                            color: '#fff', //坐标值得具体的颜色
                        }
                    }
                }
            ],
            yAxis : [
                {
                    type : 'value',
                }
            ],
            series : [
                {
                    name:'数量',
                    type:'bar',
                    barWidth: '60%',
                    data:[10, 52, 200, 334, 390, 330, 220]
                }
            ]
        };
        myChart.setOption(option);
    }
   },
   created(){

    },
    watch:{
        winHeight(val) {
            console.log(val)
            document.getElementById("cesiumContainer").style.height = val

        }
    },
   mounted () {
    var _this = this;
    window.onresize = () => {
        return (() => {
           _this.winHeight =  window.innerHeight-65;
    })()}
    // document.getElementById("cesiumContainer").style.height= this.winHeight +"px";
    this.initeCesium();
    var viewer = this.viewer;
    var entity = this.createModel(5,"xxx型",1,'/static/sampledata/model/tank.gltf', 1430.2287809812157,87.80011499370815,42.452980176420695);
     this.changeMission();
     this.initFly("MultipartVehicle_part_dd.czml");
   
    var loadedx = false;
    viewer.clock.onTick.addEventListener(function(clock){
       var curtime = viewer.clock.currentTime.secondsOfDay;
       if(!loadedx && (parseInt(curtime) == parseInt(Cesium.JulianDate.fromIso8601('2019-08-04T16:04:00Z').secondsOfDay))){
           var particleSystem = _this.createParticleSys(entity);
           loadedx = true;
       }else if(loadedx && (parseInt(curtime) < parseInt(Cesium.JulianDate.fromIso8601('2019-08-04T16:04:00Z').secondsOfDay))){
           viewer.scene.primitives.remove(_this.primitive);
           loadedx = false;
       }
    
    // 14627.975514049296

   });

  }//mounted
}
</script>
<style >
.scrollList {
      max-height: 400px;
}
.el-scrollbar__wrap{
     overflow-x: hidden;
}
.el-drawer__header{
   color:#fff;
}
.el-collapse-item__header{
    background-color:transparent;
    border-bottom: 1px solid #ccc;
    color:#fff;
}
.el-collapse-item__wrap{
     background-color:transparent;
     color:#fff;
}
.el-collapse-item__content{
      color:#fff;
}
.el-drawer{
    background-color:rgba(42,42,42,0.8);
    color:#fff;
}   
.el-drawer__title{
    color:#fff;
}
.el-select{
    width:100%
}
.el-select-dropdown__item{
     color: #ffffff;
}
.el-select-dropdown__item:hover{
    background-color: #0C0C0C;
}
.selectClass{
    background: rgba(42,42,42,0.8);
    color: #ffffff;
}
 #toolbar-resource{
    background: rgba(42,42,42,0.8);
    padding:10px;
    font-size:14px;
    border-radius: 4px;
    position: absolute;
    color: #ffffff;
    top: 4px;
    left:320px;
}
 #toolbar-search{
    background: rgba(42,42,42,0.8);
    padding:10px;
    font-size:14px;
    border-radius: 4px;
    position: absolute;
    color: #ffffff;
    top: 4px;

}
.fullSize{
  height: 100%;
}
.popper__arrow{
    top:-7px!important;
}
.el-select-dropdown__wrap{
     margin-bottom: 0px!important;
}
</style>
