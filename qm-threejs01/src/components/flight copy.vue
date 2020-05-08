<template>
<div>
     <div class="fullSize" id="cesiumContainer"></div>
    <div id="loadingOverlay"><h1>TAIJI</h1></div>
    <!-- <div id="toolbar"></div> -->
  </div>

</template>

<script type="text/javascript">
import Cesium from 'cesium/Cesium'
import {DrawHelper} from '../js/Tools-03DrawHelper'

import widgets from 'cesium/Widgets/widgets.css'
import FileSaver from 'file-saver'
export default {
  name: 'cesiumViewer',
  mounted () {
    var terrainProvider = new Cesium.CesiumTerrainProvider({
        url: '/static/sampledata/terrain/sq/'
    });
     const globemap = Cesium.createTileMapServiceImageryProvider({
            url: '/static/sampledata/imagery/ml/tiles',
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
           shouldAnimate : true,  
          geocoder: false, //是否显示地名查找控件 
          navigationHelpButton: false, //是否显示帮助信息控件
          baseLayerPicker: false, //是否显示图层选择控件
        }


    var viewer = new Cesium.Viewer('cesiumContainer',_this.viewerDefaultProperty);
    viewer._cesiumWidget._creditContainer.style.display = "none";
    var scene = viewer.scene;
    viewer.scene.globe.depthTestAgainstTerrain = true;
    viewer.terrainProvider= terrainProvider;//地形数据源 terrainProvider
    //设置初始位置
 
    var homePOsition = [87.93259246548313,42.25832490832485, 11000];
    viewer.camera.setView({
        destination: Cesium.Cartesian3.fromDegrees(homePOsition[0], homePOsition[1], homePOsition[2])
    });
     var myevent =new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
    var ellipsoid = viewer.scene.globe.ellipsoid;
    myevent.setInputAction(function(movement){
      //var ray = viewer.camera.getPickRay(movement.position);
      var cartesian = viewer.scene.pickPosition(movement.position);
      var cartographic = Cesium.Cartographic.fromCartesian(cartesian);
      var lon = Cesium.Math.toDegrees(cartographic.longitude);
      var lat = Cesium.Math.toDegrees(cartographic.latitude);
     console.log(lon+"-----"+lat);
    },Cesium.ScreenSpaceEventType.LEFT_UP)



var czmlPath = '/static/sampledata/czml/';
var vehicleEntity;

// Add a blank CzmlDataSource to hold our multi-part entity/entities.
var dataSource = new Cesium.CzmlDataSource();
viewer.dataSources.add(dataSource);
var statusDisplay = document.createElement('div');
var fuelDisplay = document.createElement('div');
// This demo shows how a single path can be broken up into several CZML streams.
var partsToLoad = [{
    url: 'MultipartVehicle_part1.czml',
    range: [0, 330],
    requested: false,
    loaded: false
}
// , {
//     url: 'MultipartVehicle_part2.czml',
//     range: [1500, 3000],
//     requested: false,
//     loaded: false
// }, {
//     url: 'MultipartVehicle_part3.czml',
//     range: [3000, 4500],
//     requested: false,
//     loaded: false
// }
];



// Helper function to mark a part as requested, and process it into the dataSource.
function processPart(part) {
    part.requested = true;
    // updateStatusDisplay();
    dataSource.process(czmlPath + part.url).then(function() {
        part.loaded = true;
        // updateStatusDisplay();

        // Follow the vehicle with the camera.
        if (!viewer.trackedEntity) {
         //   viewer.trackedEntity = vehicleEntity = dataSource.entities.getById('Vehicle');
        }
    });
}

// Load the first part up front.
processPart(partsToLoad[0]);

// Load a new section before the clock naturally gets there.
// Note this can't predict when a user may fast-forward to it.
var preloadTimeInSeconds = 100;

viewer.clock.onTick.addEventListener(function(clock) {
    // This example uses time offsets from the start to identify which parts need loading.
    var timeOffset = Cesium.JulianDate.secondsDifference(clock.currentTime, clock.startTime);

    // Filter the list of parts to just the ones that need loading right now.
    // Then, process each part that needs loading.
    partsToLoad.filter(function(part) {
        return (!part.requested) &&
            (timeOffset >= part.range[0] - preloadTimeInSeconds) &&
            (timeOffset <= part.range[1]);
    }).forEach(function(part) {
        processPart(part);
    });

    if (vehicleEntity) {
        var fuel = vehicleEntity.properties.fuel_remaining.getValue(clock.currentTime);
        if (Cesium.defined(fuel)) {
            fuelDisplay.textContent = 'Fuel: ' + fuel.toFixed(2) + ' gal';
        }
    }
});

    var cities = [{ "lon": 115.028495718, "lat": 30.200814617 },
            { "lon": 116.30742569939132, "lat": 39.904750903500734 },
            { "lon": 111.267729446, "lat": 30.698151246 },
            { "lon": 112.126643144, "lat": 32.058588576 },
            { "lon": 114.885884938, "lat": 30.395401912 },
            { "lon": 112.190419415, "lat": 31.043949588 },
            { "lon": 113.903569642, "lat": 30.932054050 },
            { "lon": 112.226648859, "lat": 30.367904255 },
            { "lon": 114.861716770, "lat": 30.468634833 },
            { "lon": 114.317846048, "lat": 29.848946148 },
            { "lon": 113.371985426, "lat": 31.704988330 },
            { "lon": 109.468884533, "lat": 30.289012191 },
            { "lon": 113.414585069, "lat": 30.368350431 },
            { "lon": 112.892742589, "lat": 30.409306203 },
            { "lon": 113.160853710, "lat": 30.667483468 },
            { "lon": 110.670643354, "lat": 31.748540780 }]
  var center = { lon: 87.82991953393098, lat:42.40955225658355,height:1532.5127590781335};
  var center1 = { lon:87.87786784416839,lat:42.37559741040185,height:1461.7894748721842};
  var center2 = { lon:87.92355538801381,lat:42.3465920732982,height:1387.0681125339097};
  var center3 = { lon:87.96369812501526,lat:42.33660597064029,height:1388.475793677903};
  var center4 = { lon:87.7417460033048,lat:42.36984450877689,height:1503.0323187296565};
  var center5 = { lon:87.81201033170632,lat:42.341715356574895,height:1398.2214422560473};
  
      //添加雷达图
      var CartographicCenter = new Cesium.Cartographic(Cesium.Math.toRadians(center.lon), Cesium.Math.toRadians(center.lat), center.height);
       var CartographicCenter1 = new Cesium.Cartographic(Cesium.Math.toRadians(center1.lon), Cesium.Math.toRadians(center1.lat), center1.height);
       var CartographicCenter2= new Cesium.Cartographic(Cesium.Math.toRadians(center2.lon), Cesium.Math.toRadians(center2.lat), center2.height);
       var CartographicCenter3 = new Cesium.Cartographic(Cesium.Math.toRadians(center3.lon), Cesium.Math.toRadians(center3.lat),center3.height);
       var CartographicCenter4= new Cesium.Cartographic(Cesium.Math.toRadians(center4.lon), Cesium.Math.toRadians(center4.lat), center4.height);
       var CartographicCenter5= new Cesium.Cartographic(Cesium.Math.toRadians(center5.lon), Cesium.Math.toRadians(center5.lat), center5.height);

 
     var scanColor = new Cesium.Color(1.0, 0.0, 0.0, 1);
      AddRadarScanPostStage(viewer, CartographicCenter, 1500, scanColor, 4000);
      AddRadarScanPostStage(viewer, CartographicCenter1, 1500, scanColor, 4000);
      AddRadarScanPostStage(viewer, CartographicCenter2, 1500, scanColor, 4000);
      AddRadarScanPostStage(viewer, CartographicCenter3, 1500, scanColor, 4000);
       AddRadarScanPostStage(viewer, CartographicCenter4, 1500, scanColor, 4000);
       //AddRadarScanPostStage(viewer, CartographicCenter5, 1500, scanColor, 4000);
    
            /*
          添加雷达扫描线 地形遮挡开启   lon:-74.01296152309055 lat:40.70524201566827 height:129.14366696393927
          viewer
          cartographicCenter 扫描中心
          radius  半径 米
          scanColor 扫描颜色
          duration 持续时间 毫秒
        */
        function AddRadarScanPostStage(viewer, cartographicCenter, radius, scanColor, duration) {
            var ScanSegmentShader =
                "uniform sampler2D colorTexture;\n" +
                "uniform sampler2D depthTexture;\n" +
                "varying vec2 v_textureCoordinates;\n" +
                "uniform vec4 u_scanCenterEC;\n" +
                "uniform vec3 u_scanPlaneNormalEC;\n" +
                "uniform vec3 u_scanLineNormalEC;\n" +
                "uniform float u_radius;\n" +
                "uniform vec4 u_scanColor;\n" +

                "vec4 toEye(in vec2 uv, in float depth)\n" +
                " {\n" +
                  " vec2 xy = vec2((uv.x * 2.0 - 1.0),(uv.y * 2.0 - 1.0));\n" +
                  " vec4 posInCamera =czm_inverseProjection * vec4(xy, depth, 1.0);\n" +
                  " posInCamera =posInCamera / posInCamera.w;\n" +
                  " return posInCamera;\n" +
                " }\n" +

                "bool isPointOnLineRight(in vec3 ptOnLine, in vec3 lineNormal, in vec3 testPt)\n" +
                "{\n" +
                    "vec3 v01 = testPt - ptOnLine;\n" +
                    "normalize(v01);\n" +
                    "vec3 temp = cross(v01, lineNormal);\n" +
                    "float d = dot(temp, u_scanPlaneNormalEC);\n" +
                    "return d > 0.5;\n" +
                "}\n" +

                "vec3 pointProjectOnPlane(in vec3 planeNormal, in vec3 planeOrigin, in vec3 point)\n" +
                "{\n" +
                    "vec3 v01 = point -planeOrigin;\n" +
                    "float d = dot(planeNormal, v01) ;\n" +
                    "return (point - planeNormal * d);\n" +
                 "}\n" +

                 "float distancePointToLine(in vec3 ptOnLine, in vec3 lineNormal, in vec3 testPt)\n" +
                 "{\n" +
                    "vec3 tempPt = pointProjectOnPlane(lineNormal, ptOnLine, testPt);\n" +
                    "return length(tempPt - ptOnLine);\n" +
                  "}\n" +

                 "float getDepth(in vec4 depth)\n" +
                 "{\n" +
                    "float z_window = czm_unpackDepth(depth);\n" +
                    "z_window = czm_reverseLogDepth(z_window);\n" +
                    "float n_range = czm_depthRange.near;\n" +
                    "float f_range = czm_depthRange.far;\n" +
                    "return (2.0 * z_window - n_range - f_range) / (f_range - n_range);\n" +
                 "}\n" +

                 "void main()\n" +
                 "{\n" +
                    "gl_FragColor = texture2D(colorTexture, v_textureCoordinates);\n" +
                    "float depth = getDepth( texture2D(depthTexture, v_textureCoordinates));\n" +
                    "vec4 viewPos = toEye(v_textureCoordinates, depth);\n" +
                    "vec3 prjOnPlane = pointProjectOnPlane(u_scanPlaneNormalEC.xyz, u_scanCenterEC.xyz, viewPos.xyz);\n" +
                    "float dis = length(prjOnPlane.xyz - u_scanCenterEC.xyz);\n" +
                    "float twou_radius = u_radius * 2.0;\n" +
                    "if(dis < u_radius)\n" +
                     "{\n" +
                        "float f0 = 1.0 -abs(u_radius - dis) / u_radius;\n" +
                        "f0 = pow(f0, 64.0);\n" +
                        "vec3 lineEndPt = vec3(u_scanCenterEC.xyz) + u_scanLineNormalEC * u_radius;\n" +
                        "float f = 0.0;\n" +
                        "if(isPointOnLineRight(u_scanCenterEC.xyz, u_scanLineNormalEC.xyz, prjOnPlane.xyz))\n" +
                        "{\n" +
                            "float dis1= length(prjOnPlane.xyz - lineEndPt);\n" +
                            "f = abs(twou_radius -dis1) / twou_radius;\n" +
                            "f = pow(f, 3.0);\n" +
                        "}\n" +
                        "gl_FragColor = mix(gl_FragColor, u_scanColor, f + f0);\n" +
                     "}\n" +
                  "}\n";

            var _Cartesian3Center = Cesium.Cartographic.toCartesian(cartographicCenter);
            var _Cartesian4Center = new Cesium.Cartesian4(_Cartesian3Center.x, _Cartesian3Center.y, _Cartesian3Center.z, 1);

            var _CartographicCenter1 = new Cesium.Cartographic(cartographicCenter.longitude, cartographicCenter.latitude, cartographicCenter.height + 500);
            var _Cartesian3Center1 = Cesium.Cartographic.toCartesian(_CartographicCenter1);
            var _Cartesian4Center1 = new Cesium.Cartesian4(_Cartesian3Center1.x, _Cartesian3Center1.y, _Cartesian3Center1.z, 1);

            var _CartographicCenter2 = new Cesium.Cartographic(cartographicCenter.longitude + Cesium.Math.toRadians(0.001), cartographicCenter.latitude, cartographicCenter.height);
            var _Cartesian3Center2 = Cesium.Cartographic.toCartesian(_CartographicCenter2);
            var _Cartesian4Center2 = new Cesium.Cartesian4(_Cartesian3Center2.x, _Cartesian3Center2.y, _Cartesian3Center2.z, 1);
            var _RotateQ = new Cesium.Quaternion();
            var _RotateM = new Cesium.Matrix3();

            var _time = (new Date()).getTime();

            var _scratchCartesian4Center = new Cesium.Cartesian4();
            var _scratchCartesian4Center1 = new Cesium.Cartesian4();
            var _scratchCartesian4Center2 = new Cesium.Cartesian4();
            var _scratchCartesian3Normal = new Cesium.Cartesian3();
            var _scratchCartesian3Normal1 = new Cesium.Cartesian3();

            var ScanPostStage = new Cesium.PostProcessStage({
                fragmentShader: ScanSegmentShader,
                uniforms: {
                    u_scanCenterEC: function () {
                        return Cesium.Matrix4.multiplyByVector(viewer.camera._viewMatrix, _Cartesian4Center, _scratchCartesian4Center);
                    },
                    u_scanPlaneNormalEC: function () {
                        var temp = Cesium.Matrix4.multiplyByVector(viewer.camera._viewMatrix, _Cartesian4Center, _scratchCartesian4Center);
                        var temp1 = Cesium.Matrix4.multiplyByVector(viewer.camera._viewMatrix, _Cartesian4Center1, _scratchCartesian4Center1);
                        _scratchCartesian3Normal.x = temp1.x - temp.x;
                        _scratchCartesian3Normal.y = temp1.y - temp.y;
                        _scratchCartesian3Normal.z = temp1.z - temp.z;

                        Cesium.Cartesian3.normalize(_scratchCartesian3Normal, _scratchCartesian3Normal);
                        return _scratchCartesian3Normal;
                    },
                    u_radius: radius,
                    u_scanLineNormalEC: function () {
                        var temp = Cesium.Matrix4.multiplyByVector(viewer.camera._viewMatrix, _Cartesian4Center, _scratchCartesian4Center);
                        var temp1 = Cesium.Matrix4.multiplyByVector(viewer.camera._viewMatrix, _Cartesian4Center1, _scratchCartesian4Center1);
                        var temp2 = Cesium.Matrix4.multiplyByVector(viewer.camera._viewMatrix, _Cartesian4Center2, _scratchCartesian4Center2);

                        _scratchCartesian3Normal.x = temp1.x - temp.x;
                        _scratchCartesian3Normal.y = temp1.y - temp.y;
                        _scratchCartesian3Normal.z = temp1.z - temp.z;

                        Cesium.Cartesian3.normalize(_scratchCartesian3Normal, _scratchCartesian3Normal);

                        _scratchCartesian3Normal1.x = temp2.x - temp.x;
                        _scratchCartesian3Normal1.y = temp2.y - temp.y;
                        _scratchCartesian3Normal1.z = temp2.z - temp.z;

                        var tempTime = (((new Date()).getTime() - _time) % duration) / duration;
                        Cesium.Quaternion.fromAxisAngle(_scratchCartesian3Normal, tempTime * Cesium.Math.PI * 2, _RotateQ);
                        Cesium.Matrix3.fromQuaternion(_RotateQ, _RotateM);
                        Cesium.Matrix3.multiplyByVector(_RotateM, _scratchCartesian3Normal1, _scratchCartesian3Normal1);
                        Cesium.Cartesian3.normalize(_scratchCartesian3Normal1, _scratchCartesian3Normal1);
                        return _scratchCartesian3Normal1;
                    },
                    u_scanColor: scanColor
                }
            });

            viewer.scene.postProcessStages.add(ScanPostStage);
        }


  }//mounted
}
</script>
<style>

</style>
