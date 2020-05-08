<template>
<div>
    <div id="cesiumContainer" class="fullSize"></div>
    <div id="creditContainer" style="display: none;"></div>
    <div id="menu">
        <p @click="drawLine">画线</p>
        <p @click="drawPolygon">画面</p>
    </div>
</div>
</template>

<script type="text/javascript">
import Cesium from 'cesium/Cesium'
import widgets from 'cesium/Widgets/widgets.css'
import FileSaver from 'file-saver'
import {TooltipDiv} from '../js/Tools-02Tooltip-div.js'
import {ChangeablePrimitiveTool} from '../js/Tools-04ChangeablePrimitive.js'
export default {
  name: 'cesiumViewer',
    data() {
        return {
            viewer:''
        }
    },
  methods: {  
    drawLine() {
        this.viewer.scene.primitives.removeAll();
        var positionWord = [];
        positionWord.push(Cesium.Cartesian3.fromDegrees(110.20, 34.55, 0));
        positionWord.push(Cesium.Cartesian3.fromDegrees(115.20, 34.55, 0));
        positionWord.push(Cesium.Cartesian3.fromDegrees(115.20, 39.55, 0));

        var polyline = new ChangeablePrimitiveTool.PolylinePrimitive({
            positions: positionWord,
            width: 5,
            geodesic: true,
            objId: new Date().getTime() + 'id',
            //material: materialLine
        }, this.viewer);
        this.viewer.scene.primitives.add(polyline);
        polyline.setEditable();
        polyline.addListener('onEdited', function (event) {
            var msg = '';
            if (event.objId) {
                msg = '编辑多段线,共' + event.positions.length + '个点-' + event.objId;
            } else {
                msg = '编辑多段线,共' + event.positions.length + '个点';
            }
            alert( msg);
        });
    },
     drawPolygon() {
        this.viewer.scene.primitives.removeAll();
        var positionWord = [];
        positionWord.push(Cesium.Cartesian3.fromDegrees(110.20, 34.55, 0));
        positionWord.push(Cesium.Cartesian3.fromDegrees(105.20, 34.55, 0));
        positionWord.push(Cesium.Cartesian3.fromDegrees(105.20, 39.55, 0));

        //ChangeablePrimitiveTool.intiTool(viewer.cesiumWidget);
        //var Helper = new ChangeablePrimitiveTool(viewer);
        var polygon = new ChangeablePrimitiveTool.PolygonPrimitive({
            positions: positionWord,
            objId: new Date().getTime() + 'id',
        },this.viewer);
        this.viewer.scene.primitives.add(polygon);
        polygon.setEditable();
        polygon.addListener('onEdited', function (event) {
            var lonlatArr = [];
            for (var i = 0; i < event.positions.length; i++) {
                var cartographic = Cesium.Cartographic.fromCartesian(event.positions[i]);
                var lonlat = [Cesium.Math.toDegrees(cartographic.longitude), Cesium.Math.toDegrees(cartographic.latitude)];
                lonlatArr.push(lonlat);
            }
            var msg = '';
            if (event.objId) {
                msg = '编辑多段线,共' + lonlatArr.length + '个点-' + event.objId;
            } else {
                msg = '编辑多段线,共' + lonlatArr.length + '个点';
            }
            alert(msg);
        });
    }
  },
  mounted () {
     const globemap = Cesium.createTileMapServiceImageryProvider({
            url: '/static/sampledata/imagery/gzf/tiles',
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
      }
    var viewer = new Cesium.Viewer('cesiumContainer',_this.viewerDefaultProperty);
    this.viewer = viewer;
    viewer._cesiumWidget._creditContainer.style.display = "none";
    viewer.scene.globe.depthTestAgainstTerrain = true;
     
    var myevent =new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
    myevent.setInputAction(function(movement){
      //var ray = viewer.camera.getPickRay(movement.position);
      var cartesian = viewer.scene.pickPosition(movement.position);
      var cartographic = Cesium.Cartographic.fromCartesian(cartesian);
      var lon = Cesium.Math.toDegrees(cartographic.longitude);
      var lat = Cesium.Math.toDegrees(cartographic.latitude);
      console.log(lon+"-----"+lat);
    },Cesium.ScreenSpaceEventType.LEFT_UP)

   
   createModel('/static/sampledata/model/barrel.gltf', 0.0,116.30739267249568,39.90477622016193);

     function createModel(url, height,jd,wd) {
        viewer.entities.removeAll();
        var position = Cesium.Cartesian3.fromDegrees(jd, wd, height);
        // var position1 = Cesium.Cartesian3.fromDegrees(128, 42, height);
        var heading = Cesium.Math.toRadians(90);
        var pitch = 0;
        var roll = 0;
        var hpr = new Cesium.HeadingPitchRoll(heading, pitch, roll);
        var orientation = Cesium.Transforms.headingPitchRollQuaternion(position, hpr);

        var entity = viewer.entities.add(
        {
            name: url,
            position: position,
            orientation: orientation,
            model: {
                uri: url,
                minimumPixelSize: 20,
                maximumScale: 20
            }        
        }
        );
        viewer.trackedEntity = entity; 
     }

    viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
    viewer.camera.setView({
        destination: Cesium.Cartesian3.fromDegrees(110.20, 34.55, 3000000)
    });

//    var scene = viewer.scene;
//         var handler = new Cesium.ScreenSpaceEventHandler(scene.canvas);
//         var ellipsoid = scene.globe.ellipsoid; 
//         var cartesian = null;

//          TooltipDiv.initTool(viewer.cesiumWidget.container);

//         //一 鼠标MOUSE_MOVE
//         handler.setInputAction(function (movement) {
//             cartesian = viewer.camera.pickEllipsoid(movement.endPosition, ellipsoid);
//             if (cartesian) {
//                 TooltipDiv.showAt(movement.endPosition, 'MOUSE_MOVE');
//             } else {
//                 TooltipDiv.setVisible(false);
//             }
//         }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

//         //二 LEFT_CLICK
//         handler.setInputAction(function (movement) {
//             cartesian = viewer.camera.pickEllipsoid(movement.position, ellipsoid);
//             if (cartesian) {
//                 TooltipDiv.showAt(movement.position, 'LEFT_CLICK');
//             } else {
//                 TooltipDiv.setVisible(false);
//             }
//         }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

//         //三 LEFT_DOUBLE_CLICK
//         handler.setInputAction(function (movement) {
//             cartesian = viewer.camera.pickEllipsoid(movement.position, ellipsoid);
//             if (cartesian) {
//                 TooltipDiv.showAt(movement.position, 'LEFT_DOUBLE_CLICK');
//             } else {
//                 TooltipDiv.setVisible(false);
//             }
//         }, Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);

//         //四 LEFT_DOWN
//         handler.setInputAction(function (movement) {
//             cartesian = viewer.camera.pickEllipsoid(movement.position, ellipsoid);
//             if (cartesian) {
//                 TooltipDiv.showAt(movement.position, 'LEFT_DOWN');
//             } else {
//                 TooltipDiv.setVisible(false);
//             }
//         }, Cesium.ScreenSpaceEventType.LEFT_DOWN);

//         //五 LEFT_UP
//         handler.setInputAction(function (movement) {
//             cartesian = viewer.camera.pickEllipsoid(movement.position, ellipsoid);
//             if (cartesian) {
//                 TooltipDiv.showAt(movement.position, 'LEFT_UP');
//             } else {
//                 TooltipDiv.setVisible(false);
//             }
//         }, Cesium.ScreenSpaceEventType.LEFT_UP);
   
  }//mounted
}
</script>
<style>
/*
 提示框
*/
.tooltipdiv {
    display: block;
    position: absolute;
    visibility: visible;
    max-width: 200px;
    min-width: 100px;
    padding: 1px 1px 1px 25px;
    font-size: 11px;
    z-index: 1000;
    opacity: 0.8;
    -khtml-opacity: 0.8;
    -moz-opacity: 0.8;
    filter: alpha(opacity=80);
}
.tooltipdiv.left .tooltipdiv-arrow {
    top: 50%;
    right: 0;
    margin-top: -5px;
    border-top: 5px solid transparent;
    border-bottom: 5px solid transparent;
    border-left: 25px solid #000000;
}
.tooltipdiv.right .tooltipdiv-arrow {
    top: 50%;
    left: 0;
    margin-top: -5px;
    border-top: 5px solid transparent;
    border-bottom: 5px solid transparent;
    border-right: 25px solid #000000;
}
.tooltipdiv-inner {
    padding: 3px 8px;
    background-color: #000000;
    color: white;
    text-align: center;
    max-width: 200px;
    text-decoration: none;
    -webkit-border-radius: 4px;
    -moz-border-radius: 4px;
    border-radius: 4px;
}
.tooltipdiv-arrow {
    position: absolute;
    width: 0;
    height: 0;
}

  html, body, #cesiumContainer {
            width: 100%;
            height: 100%;
            margin: 0;
            padding: 0;
            overflow: hidden;
        }

        #menu {
            position: absolute;
            top: 50px;
            left: 50px;
        }

        #menu p {
            background-color: #808080;
            color: #ff0000;
            height: 30px;
            line-height: 30px;
            font-size: 20px;
            padding: 4px 10px 4px 10px;
        }
</style>
