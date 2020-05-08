<template>
    <div id="cesiumContainer" >
    </div>
</template>

<script type="text/javascript">
import Cesium from 'cesium/Cesium'
import widgets from 'cesium/Widgets/widgets.css'
import FileSaver from 'file-saver'
export default {
  name: 'cesiumViewer',
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
    viewer._cesiumWidget._creditContainer.style.display = "none"
    //-------默认位置------
    // var homePOsition = [0.0,116.30739267249568,39.90477622016193];
    // viewer.camera.setView( {
    //     destination: Cesium.Cartesian3.fromDegrees(homePOsition[0], homePOsition[1], homePOsition[2])
    // } );

    createBox( 0.0,116.30739267249568,39.90477622016193);
     createPoint( 0.0,116.30739267249568,39.85477622016193);
     createCircle(0.0,110.30739267249568,39.85477622016193);
     createEllipse(0.0,105.30739267249568,39.85477622016193);
     createCorridor(0.0,100.30739267249568,39.85477622016193);
    //  createCylinder(0.0,100.30739267249568,39.85477622016193);
    createCone(0.0,100.30739267249568,39.85477622016193);
    createPolygon(0.0,100.30739267249568,39.85477622016193);
    createPolyline(0.0,100.30739267249568,39.85477622016193);
    createPolylineVolume(0.0,100.30739267249568,39.85477622016193);


    function createPolylineVolume(height,jd,wd){
        //polylineVolume
        function computeCircle(radius) {
            var positions = [];
            for (var i = 0; i < 200; i++) {
                var radians = Cesium.Math.toRadians(i);
                positions.push(new Cesium.Cartesian2(radius * Math.cos(radians), radius * Math.sin(radians)));
            }
            return positions;
            }
            viewer.entities.add({
                name: 'Red tube with rounded corners',
                polylineVolume: {
                    positions: Cesium.Cartesian3.fromDegreesArray([85.0, 32.0,
                                                                    85.0, 36.0,
                                                                    89.0, 36.0]),
                    shape: computeCircle(60000.0),
                    material: Cesium.Color.RED
                }
            });
        }

    function createPolyline(height,jd,wd){
        viewer.entities.add({
        name: 'Red line on the surface',
        polyline: {
            positions: Cesium.Cartesian3.fromDegreesArray([115, 35,
                                                            125, 35,
                                                            125, 39
                                                            ]),
            width: 5,
            material: Cesium.Color.RED
        }
    });
    }

    function createPolygon(height,jd,wd){
        //Polygon 
        viewer.entities.add({
            name: 'Red polygon on surface',
            polygon: {
                hierarchy: Cesium.Cartesian3.fromDegreesArray([115.0, 37.0,
                                                                115.0, 32.0,
                                                                107.0, 33.0,
                                                                102.0, 31.0,
                                                                102.0, 35.0]),
                material: Cesium.Color.RED.withAlpha(0.5),
            }
        });
    }
    function createCone(height,jd,wd){
        //Cone
        viewer.entities.add({
            name: 'Red cone',
            position: Cesium.Cartesian3.fromDegrees(105.0, 40.0, 200000.0),
            cylinder: {
                length: 400000.0,
                topRadius: 0.0,
                bottomRadius: 200000.0,
                material: Cesium.Color.RED
            }
        });
    }
     function createCylinder(height,jd,wd){
        //Cylinder
        viewer.entities.add({
            name: 'Green cylinder with black outline',
            position: Cesium.Cartesian3.fromDegrees(100.0, 40.0, 200000.0),
            cylinder: {
                length: 400000.0,
                topRadius: 200000.0,
                bottomRadius: 200000.0,
                material: Cesium.Color.GREEN.withAlpha(0.5),
                outline: true,
                outlineColor: Cesium.Color.DARK_GREEN
            }
        });
    }
      function createCorridor(height,jd,wd){
          //Corridor
          viewer.entities.add({
              name: 'Red corridor on surface with rounded corners and outline',
              corridor: {
                  positions: Cesium.Cartesian3.fromDegreesArray([
                                                                  100.0, 40.0,
                                                                  105.0, 40.0,
                                                                  105.0, 35.0,
                                                                  100.0, 35.0,
                  ]),
                  width: 200.0,
                  material: Cesium.Color.RED.withAlpha(0.5),
                  outline: true,
                  outlineColor: Cesium.Color.RED
              }
          });
      }
      function createEllipse(height,jd,wd){
        //Ellipse
        viewer.entities.add({
            position: Cesium.Cartesian3.fromDegrees(jd, wd),
            name: 'Red ellipse on surface with outline',
            ellipse: {
                semiMinorAxis: 250000.0,
                semiMajorAxis: 400000.0,
                material: Cesium.Color.RED.withAlpha(0.5),
                outline: true,
                outlineColor: Cesium.Color.RED
            }
        });
      }
     function createCircle(height,jd,wd){
       //Circle
        viewer.entities.add({
            position: Cesium.Cartesian3.fromDegrees(jd, wd,150000.0),
            name: 'Green circle at height',
            ellipse: {
                semiMinorAxis: 300000.0,
                semiMajorAxis: 300000.0,
                height: 200000.0,
                material: Cesium.Color.GREEN
            }
        });
     }
     function createPoint(height,jd,wd){
        viewer.entities.add({
            position: Cesium.Cartesian3.fromDegrees(jd, wd,height),
            point: {
                pixelSize: 10,
                color: Cesium.Color.YELLOW
            }
        });
        viewer.entities.add({
            position: Cesium.Cartesian3.fromDegrees(jd, wd+0.1,height),
            point: {
                pixelSize: 10,
                color: Cesium.Color.YELLOW
            }
        })
    }
     function createBox( height,jd,wd) {
         viewer.entities.removeAll();
        var position = Cesium.Cartesian3.fromDegrees(jd, wd, height);
        var material = Cesium.Color.BLUE;

        var entity =  viewer.entities.add(
        {
          name:"box",
          position:position,
          box:{
            dimensions:new Cesium.Cartesian3(40.0,40.0,50.0),
            material:material,
            minimumPixelSize: 20
          }
        });
        //  viewer.trackedEntity = entity;

  }
 
  }
}
</script>
<style>

</style>
