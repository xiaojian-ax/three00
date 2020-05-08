<template>
  <div>
      <div id="cesiumContainer" >
      </div>
      <div class="toolbar-search">
        <div  class="layoutinput" style="padding-top:5px;">
            起始位置：
        </div>
        <div  class="layoutinput">
            <el-input
                size="small"
                placeholder="x"
                v-model="x1"
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
            结束位置：
        </div>
        <div  class="layoutinput">
            <el-input
                size="small"
                placeholder="x"
                v-model="x2"
                clearable>
            </el-input>
            ，
        </div>
        
         <div class="layoutinput" >
            <el-input
                size="small"
                placeholder="y"
                v-model="y2"
                clearable>
            </el-input>
            ，
        </div>
        
          <div class="layoutinput" >
            <el-input
                size="small"
                placeholder="z"
                v-model="z2"
                clearable>
            </el-input>
        </div>
          <div class="layoutinput" >
           <el-button type="primary" icon="el-icon-search" @click="initTral">生成航路</el-button>
        </div>
      </div>
      <div id="toolbar">    
      </div>
      <!-- <div id="logging">
      </div> -->
        <el-dialog
            :visible.sync="dialogVisible"
            width="30%"
            :before-close="handleClose">
            <el-radio-group v-model="radio">
               <el-radio :label="1">起始位置</el-radio>
               <el-radio :label="2">结束位置</el-radio>
            </el-radio-group>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="confirm">确 定</el-button>
            </span>
        </el-dialog>
  </div>
</template>

<script type="text/javascript">
import Cesium from 'cesium/Cesium'
import {DrawHelper} from '../js/Tools-03DrawHelper'
import widgets from 'cesium/Widgets/widgets.css'
import {drawApi} from '../js/api/index'
import FileSaver from 'file-saver'
import {devPath,devPath2} from '../js/api/path'
export default {
  name: 'cesiumViewer',
  data(){
       return {
           drawer: false,
           x:'',
           y:'',
           z:'',
           x1:'',
           y1:'',
           z1:'',
           x2:'',
           y2:'',
           z2:'',
           radio:1,
           viewer:{},
           terrainProvider:{},
           dialogVisible: false,
           dataSourcePromice:{},
           pointsData:{
               start:[0.0,0.0],
               end:[1.0,1.0],
               circle:[0.0,0.0,1.0]
           },
           path:[],
   

       }
  },
  methods:{
     createBillboard(id,name,url,x,y,z){
        //var uri = Cesium.buildModuleUrl(url);
        var position =new Cesium.Cartesian3(x, y,z);
        
       // Cesium.Cartesian3.fromDegrees(jd, wd,0.0)
        var entity = this.viewer.entities.add(
          {
              id:id,
              name: name,
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
    confirm:function(){
        this.dialogVisible=false;
        if(this.radio==1){
            this.x1 = this.x;
            this.y1 = this.y;
            this.z1 = this.z;  
            this.createBillboard(1,'起始位置','/static/sampledata/images/mark.png', this.x,this.y,this.z);
 
        }else{
            this.x2 = this.x;
            this.y2 = this.y;
            this.z2 = this.z;
            this.createBillboard(2,'终止位置','/static/sampledata/images/mark.png', this.x,this.y,this.z);
        }

    },
    drawDataPost: function() {
       // console.log(JSON.stringify(this.pointsData));
        drawApi.add(JSON.stringify(this.pointsData)).then(res=>{
           console.log(res);
         })
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
            sceneModePicker: false, //是否显示投影方式控件
            navigationHelpButton: false, //是否显示帮助信息控件
            infoBox: true,  //是否显示点击要素之后显示的信息
            fullscreenButton: true
        }


        this.viewer = new Cesium.Viewer('cesiumContainer',_this.viewerDefaultProperty);
        //this.viewer.extend(Cesium.viewerCesiumInspectorMixin);
        //隐藏logo
        this.viewer._cesiumWidget._creditContainer.style.display = "none";
        var scene = this.viewer.scene;
        scene.globe.depthTestAgainstTerrain = false; 
        this.viewer.terrainProvider= this.terrainProvider;//地形数据源 terrainProvider
        // this.viewer.scene.globe.depthTestAgainstTerrain = true;
        this.viewer.camera.flyTo({
            destination : Cesium.Cartesian3.fromDegrees(87.6025567237875,42.33342636310676, 40000)
        });

        
     },
    //  randomNum:function(min,max){
    //      return Math.random()*(max-min)+min;
    //  },
        initTral:function(){
          //处理航线数组
          var path1 = [];
          var px = [];
          var py = [];
          var pz = [];
          var pointCenter = [(this.x1+this.x2)/2,(this.y1+this.y2)/2,+(this.z1+this.z2)/2];

          for(var i=0;i<3;i++){
            if(i==0){
                px.push(this.x1);
                py.push(this.y1);
                pz.push(this.z1);
            }else if(i==2){
                px.push(this.x2);
                py.push(this.y2);
                pz.push(this.z2);
            }else{    
                px.push(pointCenter[0]);
                py.push(pointCenter[1]);
                pz.push(pointCenter[2]);
                //  path1.push(this.path[i]);
            }
          }
          for(var i=0;i<3*4;i++){
            //   console.log(this.path[i]);
            if(i%4==0){
                path1.push(i/4*150);
            }else if(i%4==1){
                path1.push(px[(i-1)/4])
            }else if(i%4==2){
                path1.push(py[(i-2)/4])
            }else{
                path1.push(pz[(i-3)/4])
            }
           //  path1.push(this.path[i]);
          }
        path1 =[0.0, 211337.20725322442, 4715816.960101175, 4277088.3512346735, 2.0, 211337.0, 4715816.0, 4277088.3512346735, 4.0, 211314.0, 4715839.0, 4277088.3512346735, 6.0, 211291.0, 4715862.0, 4277088.3512346735, 8.0, 211268.0, 4715885.0, 4277088.3512346735, 10.0, 211245.0, 4715908.0, 4277088.3512346735, 12.0, 211222.0, 4715931.0, 4277088.3512346735, 14.0, 211199.0, 4715954.0, 4277088.3512346735, 16.0, 211176.0, 4715977.0, 4277088.3512346735, 18.0, 211153.0, 4716000.0, 4277088.3512346735, 20.0, 211130.0, 4716023.0, 4277088.3512346735, 22.0, 211107.0, 4716046.0, 4277088.3512346735, 24.0, 211084.0, 4716069.0, 4277088.3512346735, 26.0, 211061.0, 4716092.0, 4277088.3512346735, 28.0, 211038.0, 4716115.0, 4277088.3512346735, 30.0, 211015.0, 4716138.0, 4277088.3512346735, 32.0, 210992.0, 4716161.0, 4277088.3512346735, 34.0, 210969.0, 4716184.0, 4277088.3512346735, 36.0, 210923.0, 4716184.0, 4277088.3512346735, 38.0, 210900.0, 4716184.0, 4277088.3512346735, 40.0, 210877.0, 4716184.0, 4277088.3512346735, 42.0, 210854.0, 4716184.0, 4277088.3512346735, 44.0, 210831.0, 4716184.0, 4277088.3512346735, 46.0, 210808.0, 4716184.0, 4277088.3512346735, 48.0, 210785.0, 4716184.0, 4277088.3512346735, 50.0, 210762.0, 4716184.0, 4277088.3512346735, 52.0, 210739.0, 4716184.0, 4277088.3512346735, 54.0, 210716.0, 4716184.0, 4277088.3512346735, 56.0, 210693.0, 4716184.0, 4277088.3512346735, 58.0, 210670.0, 4716184.0, 4277088.3512346735, 60.0, 210647.0, 4716184.0, 4277088.3512346735, 62.0, 210624.0, 4716184.0, 4277088.3512346735, 64.0, 210601.0, 4716184.0, 4277088.3512346735, 66.0, 210578.0, 4716184.0, 4277088.3512346735, 68.0, 210555.0, 4716184.0, 4277088.3512346735, 70.0, 210532.0, 4716184.0, 4277088.3512346735, 72.0, 210509.0, 4716184.0, 4277088.3512346735, 74.0, 210486.0, 4716184.0, 4277088.3512346735, 76.0, 210463.0, 4716184.0, 4277088.3512346735, 78.0, 210440.0, 4716184.0, 4277088.3512346735, 80.0, 210417.0, 4716184.0, 4277088.3512346735, 82.0, 210394.0, 4716184.0, 4277088.3512346735, 84.0, 210371.0, 4716184.0, 4277088.3512346735, 86.0, 210348.0, 4716184.0, 4277088.3512346735, 88.0, 210325.0, 4716184.0, 4277088.3512346735, 90.0, 210302.0, 4716184.0, 4277088.3512346735, 92.0, 210279.0, 4716184.0, 4277088.3512346735, 94.0, 210256.0, 4716184.0, 4277088.3512346735, 96.0, 210233.0, 4716184.0, 4277088.3512346735, 98.0, 210210.0, 4716184.0, 4277088.3512346735, 100.0, 210187.0, 4716184.0, 4277088.3512346735, 102.0, 210164.0, 4716184.0, 4277088.3512346735, 104.0, 210141.0, 4716184.0, 4277088.3512346735, 106.0, 210118.0, 4716184.0, 4277088.3512346735, 108.0, 210095.0, 4716184.0, 4277088.3512346735, 110.0, 210072.0, 4716184.0, 4277088.3512346735, 112.0, 210049.0, 4716184.0, 4277088.3512346735, 114.0, 210026.0, 4716184.0, 4277088.3512346735, 116.0, 210003.0, 4716184.0, 4277088.3512346735, 118.0, 209980.0, 4716184.0, 4277088.3512346735, 120.0, 209957.0, 4716184.0, 4277088.3512346735, 122.0, 209934.0, 4716184.0, 4277088.3512346735, 124.0, 209911.0, 4716184.0, 4277088.3512346735, 126.0, 209888.0, 4716184.0, 4277088.3512346735, 128.0, 209865.0, 4716184.0, 4277088.3512346735, 130.0, 209842.0, 4716184.0, 4277088.3512346735, 132.0, 209819.0, 4716184.0, 4277088.3512346735, 134.0, 209796.0, 4716184.0, 4277088.3512346735, 136.0, 209773.0, 4716184.0, 4277088.3512346735, 138.0, 209750.0, 4716184.0, 4277088.3512346735, 140.0, 209727.0, 4716184.0, 4277088.3512346735, 142.0, 209704.0, 4716184.0, 4277088.3512346735, 144.0, 209681.0, 4716184.0, 4277088.3512346735, 146.0, 209658.0, 4716184.0, 4277088.3512346735, 148.0, 209635.0, 4716184.0, 4277088.3512346735, 150.0, 209612.0, 4716184.0, 4277088.3512346735, 152.0, 209589.0, 4716184.0, 4277088.3512346735, 154.0, 209566.0, 4716184.0, 4277088.3512346735, 156.0, 209543.0, 4716184.0, 4277088.3512346735, 158.0, 209520.0, 4716184.0, 4277088.3512346735, 160.0, 209497.0, 4716184.0, 4277088.3512346735, 162.0, 209474.0, 4716184.0, 4277088.3512346735, 164.0, 209451.0, 4716184.0, 4277088.3512346735, 166.0, 209428.0, 4716184.0, 4277088.3512346735, 168.0, 209405.0, 4716184.0, 4277088.3512346735, 170.0, 209382.0, 4716184.0, 4277088.3512346735, 172.0, 209359.0, 4716184.0, 4277088.3512346735, 174.0, 209336.0, 4716184.0, 4277088.3512346735, 176.0, 209313.0, 4716184.0, 4277088.3512346735, 178.0, 209290.0, 4716184.0, 4277088.3512346735, 180.0, 209267.0, 4716184.0, 4277088.3512346735, 182.0, 209244.0, 4716184.0, 4277088.3512346735, 184.0, 209221.0, 4716184.0, 4277088.3512346735, 186.0, 209198.0, 4716184.0, 4277088.3512346735, 188.0, 209175.0, 4716184.0, 4277088.3512346735, 190.0, 209152.0, 4716184.0, 4277088.3512346735, 192.0, 209129.0, 4716184.0, 4277088.3512346735, 194.0, 209106.0, 4716184.0, 4277088.3512346735, 196.0, 209083.0, 4716184.0, 4277088.3512346735, 198.0, 209060.0, 4716184.0, 4277088.3512346735, 200.0, 209037.0, 4716184.0, 4277088.3512346735, 202.0, 209014.0, 4716184.0, 4277088.3512346735, 204.0, 208991.0, 4716184.0, 4277088.3512346735, 206.0, 208968.0, 4716184.0, 4277088.3512346735, 208.0, 208945.0, 4716184.0, 4277088.3512346735, 210.0, 208922.0, 4716184.0, 4277088.3512346735, 212.0, 208899.0, 4716184.0, 4277088.3512346735, 214.0, 208876.0, 4716184.0, 4277088.3512346735, 216.0, 208853.0, 4716184.0, 4277088.3512346735, 218.0, 208830.0, 4716184.0, 4277088.3512346735, 220.0, 208807.0, 4716184.0, 4277088.3512346735, 222.0, 208784.0, 4716184.0, 4277088.3512346735, 224.0, 208761.0, 4716184.0, 4277088.3512346735, 226.0, 208738.0, 4716184.0, 4277088.3512346735, 228.0, 208715.0, 4716184.0, 4277088.3512346735, 230.0, 208692.0, 4716184.0, 4277088.3512346735, 232.0, 208669.0, 4716184.0, 4277088.3512346735, 234.0, 208646.0, 4716184.0, 4277088.3512346735, 236.0, 208623.0, 4716184.0, 4277088.3512346735, 238.0, 208600.0, 4716184.0, 4277088.3512346735, 240.0, 208577.0, 4716184.0, 4277088.3512346735, 242.0, 208554.0, 4716184.0, 4277088.3512346735, 244.0, 208531.0, 4716184.0, 4277088.3512346735, 246.0, 208508.0, 4716184.0, 4277088.3512346735, 248.0, 208485.0, 4716184.0, 4277088.3512346735, 250.0, 208462.0, 4716184.0, 4277088.3512346735, 252.0, 208439.0, 4716184.0, 4277088.3512346735, 254.0, 208416.0, 4716184.0, 4277088.3512346735, 256.0, 208393.0, 4716184.0, 4277088.3512346735, 258.0, 208370.0, 4716184.0, 4277088.3512346735, 260.0, 208347.0, 4716184.0, 4277088.3512346735, 262.0, 208324.0, 4716184.0, 4277088.3512346735, 264.0, 208301.0, 4716184.0, 4277088.3512346735, 266.0, 208278.0, 4716184.0, 4277088.3512346735, 268.0, 208255.0, 4716184.0, 4277088.3512346735, 270.0, 208232.0, 4716184.0, 4277088.3512346735, 272.0, 208209.0, 4716184.0, 4277088.3512346735, 274.0, 208186.0, 4716184.0, 4277088.3512346735, 276.0, 208163.0, 4716184.0, 4277088.3512346735, 278.0, 208140.0, 4716184.0, 4277088.3512346735, 280.0, 208117.0, 4716184.0, 4277088.3512346735, 282.0, 208094.0, 4716184.0, 4277088.3512346735, 284.0, 208071.0, 4716184.0, 4277088.3512346735, 286.0, 208048.0, 4716184.0, 4277088.3512346735, 288.0, 208025.0, 4716184.0, 4277088.3512346735, 290.0, 208002.0, 4716184.0, 4277088.3512346735, 292.0, 207979.0, 4716184.0, 4277088.3512346735, 294.0, 207956.0, 4716184.0, 4277088.3512346735, 296.0, 207933.0, 4716184.0, 4277088.3512346735, 298.0, 207910.0, 4716184.0, 4277088.3512346735, 300.0, 207887.0, 4716184.0, 4277088.3512346735, 302.0, 207864.0, 4716184.0, 4277088.3512346735, 304.0, 207841.0, 4716184.0, 4277088.3512346735, 306.0, 207818.0, 4716184.0, 4277088.3512346735, 308.0, 207795.0, 4716184.0, 4277088.3512346735, 310.0, 207772.0, 4716184.0, 4277088.3512346735, 312.0, 207749.0, 4716184.0, 4277088.3512346735, 314.0, 207726.0, 4716184.0, 4277088.3512346735, 316.0, 207703.0, 4716184.0, 4277088.3512346735, 318.0, 207680.0, 4716184.0, 4277088.3512346735, 320.0, 207657.0, 4716184.0, 4277088.3512346735, 322.0, 207634.0, 4716184.0, 4277088.3512346735, 324.0, 207611.0, 4716184.0, 4277088.3512346735, 326.0, 207588.0, 4716184.0, 4277088.3512346735, 328.0, 207565.0, 4716184.0, 4277088.3512346735, 330.0, 207533.08036842814, 4716226.911198494, 4277088.3512346735]
  
        this.pointsData.start[0] = this.x1;
         this.pointsData.start[1] = this.y1;
         this.pointsData.start[2] = this.z1;
         this.pointsData.end[0] = this.x2;
         this.pointsData.end[1] = this.y2;
         this.pointsData.end[2] = this.z2;

         this.drawDataPost();
          var  czml=[
                {
                    "id":"document",
                    "version":"1.0"
                },
                {
                    "availability":"2019-08-04T16:00:00Z/2019-08-04T16:04:54.9962195740191Z",
                    "label":{
                        "fillColor":[
                            {
                            "interval":"2019-08-04T16:00:00Z/2019-08-04T18:00:00Z",
                            "rgba":[
                                255,255,0,255
                            ]
                            }
                        ],
                        "font":"bold 10pt Segoe UI Semibold",
                        "horizontalOrigin":"CENTER",
                        "outlineColor":{
                            "rgba":[
                            0,0,0,255
                            ]
                        },
                    
                        "scale":1.0,
                        "show":[
                            {
                            "interval":"2019-08-04T16:00:00Z/2019-08-04T18:00:00Z",
                            "boolean":true
                            }
                        ],
                        "style":"FILL",
                        "text":"",
                        "verticalOrigin":"CENTER"
                    },
                    "model":{
                        "gltf":"/static/sampledata/model/wrj.gltf",
                        "minimumPixelSize":100,
                        "maximumScale":50
                    },
                    "orientation" : {
                        "velocityReference": "#position"
                    },
                    "viewFrom": {
                        "cartesian": [ -2080, -1715, 779 ]
                    },
                    "properties" : {
                        "fuel_remaining" : {
                            "epoch":"2019-08-04T16:00:00Z",
                            "number": [
                                0, 22.5,
                                1500, 21.2
                            ]
                        }
                    },
                    "path":{
                        "material":{
                            "solidColor":{
                                "color":{
                                    "interval":"2019-08-04T16:00:00Z/2019-08-04T16:10:00Z",
                                    "rgba":[
                                    255,255,0,255
                                    ]
                                }
                                }
                        },
                        "width":[
                            {
                            "interval":"2019-08-04T16:00:00Z/2019-08-04T18:00:00Z",
                            "number":5.0
                            }
                        ],
                        "show":[
                            {
                            "interval":"2019-08-04T16:00:00Z/2019-08-04T18:00:00Z",
                            "boolean":true
                            }
                        ]
                    },
                    "position":{
                            "interpolationAlgorithm":"LAGRANGE",
                            "interpolationDegree":1,
                            "epoch":"2019-08-04T16:00:00Z",//起点为2019-08-04T16:00:00Z
                            "cartesian":path1
                    }
            },
             {
                    "availability":"2019-08-04T16:00:00Z/2019-08-04T16:04:54.9962195740191Z",
                    "model":{
                        "gltf":"/static/sampledata/model/daodan.gltf",
                        "minimumPixelSize":100,
                        "maximumScale":50
                    },
                    "orientation" : {
                        "velocityReference": "#position"
                    },
                       
                    "position":{
                            "interpolationAlgorithm":"LAGRANGE",
                            "interpolationDegree":1,
                            "epoch":"2019-08-04T16:01:00Z",//起点为2019-08-04T16:00:00Z
                            "cartesian":path1
                    }
                   
            }
        ];
        this.viewer.dataSources.removeAll();
        this.dataSourcePromice = Cesium.CzmlDataSource.load(czml);
        this.viewer.dataSources.add(this.dataSourcePromice).then(function(ds) {
            // viewer.trackedEntity = ds.entities.getById('path');
        });
        },
        handleClose(done) {
            this.$confirm('确认关闭？')
            .then(_ => {
                done();
            })
            .catch(_ => {});
        }
  },
  mounted () {
        var that = this;
        this.initeCesium();
        this.initTral();
        var drawHelper = new DrawHelper(this.viewer);
        var toolbar = drawHelper.addToolbar(document.getElementById("toolbar"), {
            buttons: ['marker', 'polyline', 'polygon','extent', 'circle']
        });
        var scene = this.viewer.scene;

        //鼠标点击事件
        var viewer = this.viewer;
        var cartesian;
        var LonlatPointsTerrainData = this.LonlatPointsTerrainData;
        var myevent =new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
        var ellipsoid = viewer.scene.globe.ellipsoid;

        var dragging = false;
        var pickedObject;
        myevent.setInputAction(function(movement){
            pickedObject = scene.pick(movement.position);
            if (Cesium.defined(pickedObject) && (pickedObject.id.id === 1 || pickedObject.id.id === 2)) {
                pickedObject.id.billboard.scale = 1.2;
                dragging = true;
                scene.screenSpaceCameraController.enableRotate = false;
            }
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
                            var  cartesian1 =  Cesium.Cartesian3.fromDegrees(lon,lat,terrainData[0].height);
                            //console.log(cartesian1.x+","+cartesian1.y+","+cartesian1.z);
                            that.x = cartesian1.x;
                            that.y = cartesian1.y;
                            that.z = cartesian1.z;
                        } else {
                            alert('nodata');
                        }
                        
                });
            }
         },Cesium.ScreenSpaceEventType.LEFT_DOWN);
         //---------鼠标移动------------
         myevent.setInputAction(
            function(movement) {
                if (dragging) {
                    cartesian = viewer.camera.pickEllipsoid(movement.endPosition,ellipsoid);
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
                                var  cartesian1 =  Cesium.Cartesian3.fromDegrees(lon,lat,terrainData[0].height);
                                pickedObject.id.position = cartesian1;
                              } else {
                                alert('nodata');
                            }
                            
                    });
            }
               }
            },
            Cesium.ScreenSpaceEventType.MOUSE_MOVE
        );
        //-------------鼠标释放-------
         myevent.setInputAction(function(movement){
            pickedObject.id.billboard.scale = 1;
            dragging = false;
            scene.screenSpaceCameraController.enableRotate = true;
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
                            var  cartesian1 =  Cesium.Cartesian3.fromDegrees(lon,lat,terrainData[0].height);
                           
                            if(pickedObject.id.id ===1){
                                that.x1 =  cartesian1.x;
                                that.y1 =  cartesian1.y;
                                that.z1 =  cartesian1.z;
                            }else if(pickedObject.id.id === 2){
                                that.x2 =  cartesian1.x;
                                that.y2 =  cartesian1.y;
                                that.z2 =  cartesian1.z;
                            }else{
                                // that.x = cartesian1.x;
                                // that.y = cartesian1.y;
                                // that.z = cartesian1.z;
                            }
                        } else {
                            alert('nodata');
                        }
                        
                });
            }
         },Cesium.ScreenSpaceEventType.LEFT_UP);
        toolbar.addListener('markerCreated', function(event) {
            loggingMessage('Marker created at ' + event.position.toString());
            // create one common billboard collection for all billboards
            that.dialogVisible = true;
            // that.x=event.position.x;
            // that.y=event.position.y;
            // that.z=event.position.z;
            // var b = new Cesium.BillboardCollection();
            // scene.primitives.add(b);
            // var billboard = b.add({
            //     show : true,
            //     position : event.position,
            //     pixelOffset : new Cesium.Cartesian2(0, 0),
            //     eyeOffset : new Cesium.Cartesian3(0.0, 0.0, 0.0),
            //     horizontalOrigin : Cesium.HorizontalOrigin.CENTER,
            //     verticalOrigin:Cesium.VerticalOrigin.BOTTOM,
            //     disableDepthTestDistance:Number.POSITIVE_INFINITY,
            //     scale : 1.0,
            //     image: '/static/sampledata/images/DrawHelper/glyphicons_242_google_maps.png',
            //     color : new Cesium.Color(1.0, 1.0, 1.0, 1.0)
            // });
            // that.point = b;
            // billboard.setEditable();
            // billboard.addListener('onEdited', function(event) {
            //     loggingMessage('Marker edit at ' + event.position.toString());

            // });

        });
        toolbar.addListener('polylineCreated', function(event) {
            loggingMessage('Polyline created with ' + event.positions.length + ' points');
            var polyline = new DrawHelper.PolylinePrimitive({
                positions: event.positions,
                width: 5,
                geodesic: true
            });
            scene.primitives.add(polyline);
            polyline.setEditable();
            polyline.addListener('onEdited', function(event) {
                loggingMessage('Polyline edited, ' +event.positions+ event.positions.length + ' points');
            });

        });
        toolbar.addListener('polygonCreated', function(event) {
            loggingMessage('Polygon created with ' + event.positions.length + ' points');
            var polygon = new DrawHelper.PolygonPrimitive({
                positions: event.positions,
                material : Cesium.Material.fromType('Checkerboard')//内置材质
            });
            scene.primitives.add(polygon);
            polygon.setEditable();
            polygon.addListener('onEdited', function(event) {
                loggingMessage('Polygon edited, ' + event.positions.length + ' points');
            });

        });
        toolbar.addListener('circleCreated', function(event) {
            loggingMessage('Circle created: center is ' + event.center.toString() + ' and radius is ' + event.radius.toFixed(1) + ' meters');
            var circle = new DrawHelper.CirclePrimitive({
                center: event.center,
                radius: event.radius,
                material: Cesium.Material.fromType(Cesium.Material.RimLightingType)
            });
            scene.primitives.add(circle);
            that.pointsData.circle[0]= event.center.x;
            that.pointsData.circle[1] = event.center.y;
            that.pointsData.circle[2] = event.radius.toFixed(1);
            circle.setEditable();
            circle.addListener('onEdited', function(event) {
                loggingMessage('Circle edited: radius is ' + event.radius.toFixed(1) + ' meters');
            });
        });
        // toolbar.addListener('extentCreated', function(event) {
        //     var extent = event.extent;
        //     loggingMessage('Extent created (N: ' + extent.north.toFixed(3) + ', E: ' + extent.east.toFixed(3) + ', S: ' + extent.south.toFixed(3) + ', W: ' + extent.west.toFixed(3) + ')');
        //     var extentPrimitive = new DrawHelper.ExtentPrimitive({
        //         extent: extent,
        //         material: Cesium.Material.fromType(Cesium.Material.StripeType)
        //     });
        //     scene.primitives.add(extentPrimitive);
        //     extentPrimitive.setEditable();
        //     extentPrimitive.addListener('onEdited', function(event) {
        //         loggingMessage('Extent edited: extent is (N: ' + event.extent.north.toFixed(3) + ', E: ' + event.extent.east.toFixed(3) + ', S: ' + event.extent.south.toFixed(3) + ', W: ' + event.extent.west.toFixed(3) + ')');
        //     });
        // });

        // var logging = document.getElementById('logging');
        function loggingMessage(message) {
            // logging.innerHTML = message;
        }
      
  

    }
}

</script>
<style scoped>

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
