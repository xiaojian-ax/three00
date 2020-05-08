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
    viewer._cesiumWidget._creditContainer.style.display = "none";
        //1加载倾斜摄影
        var tileset = viewer.scene.primitives.add(new Cesium.Cesium3DTileset({
           url: '/static/sampledata/3dtiles-QX/tileset.json' //   ./data/3dtiles-lab/tileset.json
        }));

        // tileset.readyPromise.then(function () {
        //    var boundingSphere = tileset.boundingSphere;
        //    viewer.camera.viewBoundingSphere(boundingSphere, new Cesium.HeadingPitchRange(0.0,-1.0, boundingSphere.radius));
        //    viewer.camera.lookAtTransform(Cesium.Matrix4.IDENTITY);
        // }).otherwise(function (error) {
        //    throw (error);
        // });
        viewer.scene.primitives.add(tileset);
        viewer.zoomTo(tileset);

    function parabolaEquation(options, resultOut) {
        //方程 y=-(4h/L^2)*x^2+h h:顶点高度 L：横纵间距较大者
        // var h = options.height && options.height > 5000 ? options.height : 5000;
        var h = options.height;
        var L = Math.abs(options.pt1.lon - options.pt2.lon) > Math.abs(options.pt1.lat - options.pt2.lat) ? Math.abs(options.pt1.lon - options.pt2.lon) : Math.abs(options.pt1.lat - options.pt2.lat);
        var num = options.num && options.num > 50 ? options.num : 50;
        var result = [];
        var dlt = L / num;
        if (Math.abs(options.pt1.lon - options.pt2.lon) > Math.abs(options.pt1.lat - options.pt2.lat)) {//以lon为基准
            var delLat = (options.pt2.lat - options.pt1.lat) / num;
            if (options.pt1.lon - options.pt2.lon > 0) {
                dlt = -dlt;
            }
            for (var i = 0; i < num; i++) {
                var tempH = h - Math.pow((-0.5 * L + Math.abs(dlt) * i), 2) * 4 * h / Math.pow(L, 2);
                var lon = options.pt1.lon + dlt * i;
                var lat = options.pt1.lat + delLat * i;
                result.push([lon, lat, tempH]);
            }
        } else {//以lat为基准
            var delLon = (options.pt2.lon - options.pt1.lon) / num;
            if (options.pt1.lat - options.pt2.lat > 0) {
                dlt = -dlt;
            }
            for (var i = 0; i < num; i++) {
                var tempH = h - Math.pow((-0.5 * L + Math.abs(dlt) * i), 2) * 4 * h / Math.pow(L, 2);
                var lon = options.pt1.lon + delLon * i;
                var lat = options.pt1.lat + dlt * i;
                result.push([lon, lat, tempH]);
            }
        }
        if (resultOut != undefined) {
            resultOut = result;
        }
        return result;
    }


             /*
          流纹纹理线
          color 颜色
          duration 持续时间 毫秒
       */
        function PolylineTrailLinkMaterialProperty(color, duration) {
            this._definitionChanged = new Cesium.Event();
            this._color = undefined;
            this._colorSubscription = undefined;
            this.color = color;
            this.duration = duration;
            this._time = (new Date()).getTime();
        }
        Cesium.defineProperties(PolylineTrailLinkMaterialProperty.prototype, {
            isConstant: {
                get: function () {
                    return false;
                }
            },
            definitionChanged: {
                get: function () {
                    return this._definitionChanged;
                }
            },
            color: Cesium.createPropertyDescriptor('color')
        });
        PolylineTrailLinkMaterialProperty.prototype.getType = function (time) {
            return 'PolylineTrailLink';
        }
        PolylineTrailLinkMaterialProperty.prototype.getValue = function (time, result) {
            if (!Cesium.defined(result)) {
                result = {};
            }
            result.color = Cesium.Property.getValueOrClonedDefault(this._color, time, Cesium.Color.WHITE, result.color);
            result.image = Cesium.Material.PolylineTrailLinkImage;
            result.time = (((new Date()).getTime() - this._time) % this.duration) / this.duration;
            return result;
        }
        PolylineTrailLinkMaterialProperty.prototype.equals = function (other) {
            return this === other ||
                (other instanceof PolylineTrailLinkMaterialProperty &&
                  Property.equals(this._color, other._color))
        }
        Cesium.PolylineTrailLinkMaterialProperty = PolylineTrailLinkMaterialProperty;
        Cesium.Material.PolylineTrailLinkType = 'PolylineTrailLink';
        Cesium.Material.PolylineTrailLinkImage = "/static/sampledata/images/colors1.png";
        Cesium.Material.PolylineTrailLinkSource = "czm_material czm_getMaterial(czm_materialInput materialInput)\n\
                                                      {\n\
                                                           czm_material material = czm_getDefaultMaterial(materialInput);\n\
                                                           vec2 st = materialInput.st;\n\
                                                           vec4 colorImage = texture2D(image, vec2(fract(st.s - time), st.t));\n\
                                                           material.alpha = colorImage.a * color.a;\n\
                                                           material.diffuse = (colorImage.rgb+color.rgb)/2.0;\n\
                                                           return material;\n\
                                                       }";
        Cesium.Material._materialCache.addMaterial(Cesium.Material.PolylineTrailLinkType, {
            fabric: {
                type: Cesium.Material.PolylineTrailLinkType,
                uniforms: {
                    color: new Cesium.Color(1.0, 0.0, 0.0, 0.5),
                    image: Cesium.Material.PolylineTrailLinkImage,
                    time: 0
                },
                source: Cesium.Material.PolylineTrailLinkSource
            },
            translucent: function (material) {
                return true;
            }
        });
        var isAdd = false;
        var  material  = null;
        var center = { lon: 114.25056720936536, lat: 29.511277229212897 }
        var cities = [{ "lon": 115.028495718, "lat": 30.200814617 },
            { "lon": 114.26214459490627, "lat": 29.516243865716515 },
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
      var points = parabolaEquation({ pt1: center, pt2: cities[1], height: 200, num: 100 });
      var pointArr = [];
      for (var i = 0; i < points.length; i++) {
          pointArr.push(points[i][0],points[i][1],points[i][2]);
      }
      material = new Cesium.PolylineTrailLinkMaterialProperty(Cesium.Color.ORANGE, 30000);
      viewer.entities.add({
          name: 'PolylineTrailLink',
          polyline: {
              positions: Cesium.Cartesian3.fromDegreesArrayHeights(pointArr),
              width: 2,
              material: material 
          }
      });    

    
  }//mounted
 
   
 
  
}
</script>
<style>

</style>
