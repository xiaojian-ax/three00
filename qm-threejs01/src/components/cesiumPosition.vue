<template>
<div>
    <div id="cesiumContainer" >
    </div>
    <div id="toolbar">
      </div>
      <div id="logging">
      </div>
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
    var scene = viewer.scene;
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
    createDrawHelper();

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


        var center = { lon: 116.30749878196947, lat: 39.89782228255339 }
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
      //添加雷达图
      var CartographicCenter = new Cesium.Cartographic(Cesium.Math.toRadians(center.lon), Cesium.Math.toRadians(center.lat), 0);
      var scanColor = new Cesium.Color(1.0, 0.0, 0.0, 1);
      AddRadarScanPostStage(viewer, CartographicCenter, 1500, scanColor, 4000);
        //添加航线
      var  material  = null;
    
      var points = parabolaEquation({ pt1: center, pt2: cities[1], height: 200, num: 100 });
      var pointArr = [];
      for (var i = 0; i < points.length; i++) {
          pointArr.push(points[i][0],points[i][1],points[i][2]);
      }
      var material = new Cesium.PolylineTrailLinkMaterialProperty(Cesium.Color.ORANGE, 30000);
      viewer.entities.add({
          name: 'PolylineTrailLink',
          polyline: {
              positions: Cesium.Cartesian3.fromDegreesArrayHeights(pointArr),
              width: 2,
              material: material 
          }
      });    


       //定义下雨场景 着色器\\return fract(sin(x*133.3)*13.13);
        function FS_Rain() {
             return "uniform sampler2D colorTexture;\n\
                    varying vec2 v_textureCoordinates;\n\
                    \n\
                    float hash(float x){\n\
                          return fract(sin(x*23.3)*13.13);\n\
                    }\n\
                    \n\
                    void main(void){\n\
                    \n\
                        float time = czm_frameNumber / 60.0;\n\
                        vec2 resolution = czm_viewport.zw;\n\
                        \n\
                        vec2 uv=(gl_FragCoord.xy*2.-resolution.xy)/min(resolution.x,resolution.y);\n\
                        vec3 c=vec3(.6,.7,.8);\n\
                        \n\
                        float a=-.4;\n\
                        float si=sin(a),co=cos(a);\n\
                        uv*=mat2(co,-si,si,co);\n\
                        uv*=length(uv+vec2(0,4.9))*.3+1.;\n\
                        \n\
                        float v=1.-sin(hash(floor(uv.x*100.))*2.);\n\
                        float b=clamp(abs(sin(20.*time*v+uv.y*(5./(2.+v))))-.95,0.,1.)*20.;\n\
                        c*=v*b; \n\
                        \n\
                        gl_FragColor = mix(texture2D(colorTexture, v_textureCoordinates), vec4(c,1), 0.5);  \n\
                    }\n\
             ";
        }
        //定义下雪场景 着色器
        function FS_Snow() {
            return "uniform sampler2D colorTexture;\n\
              varying vec2 v_textureCoordinates;\n\
          \n\
              float snow(vec2 uv,float scale)\n\
              {\n\
                  float time = czm_frameNumber / 60.0;\n\
                  float w=smoothstep(1.,0.,-uv.y*(scale/10.));if(w<.1)return 0.;\n\
                  uv+=time/scale;uv.y+=time*2./scale;uv.x+=sin(uv.y+time*.5)/scale;\n\
                  uv*=scale;vec2 s=floor(uv),f=fract(uv),p;float k=3.,d;\n\
                  p=.5+.35*sin(11.*fract(sin((s+p+scale)*mat2(7,3,6,5))*5.))-f;d=length(p);k=min(d,k);\n\
                  k=smoothstep(0.,k,sin(f.x+f.y)*0.01);\n\
                  return k*w;\n\
              }\n\
          \n\
              void main(void){\n\
                  vec2 resolution = czm_viewport.zw;\n\
                  vec2 uv=(gl_FragCoord.xy*2.-resolution.xy)/min(resolution.x,resolution.y);\n\
                  vec3 finalColor=vec3(0);\n\
                  float c = 0.0;\n\
                  c+=snow(uv,30.)*.0;\n\
                  c+=snow(uv,20.)*.0;\n\
                  c+=snow(uv,15.)*.0;\n\
                  c+=snow(uv,10.);\n\
                  c+=snow(uv,8.);\n\
                  c+=snow(uv,6.);\n\
                  c+=snow(uv,5.);\n\
                  finalColor=(vec3(c)); \n\
                  gl_FragColor = mix(texture2D(colorTexture, v_textureCoordinates), vec4(finalColor,1), 0.3); \n\
          \n\
              }\n\
          ";
        }
        //下雨
        // var collection = viewer.scene.postProcessStages;
        // var fs_rain = FS_Rain();
        // var snow = new Cesium.PostProcessStage({
        //     name: 'czm_rain',
        //     fragmentShader: fs_rain
        // });
        // collection.add(snow);

        // viewer.scene.skyAtmosphere.hueShift = -0.8;
        // viewer.scene.skyAtmosphere.saturationShift = -0.7;
        // viewer.scene.skyAtmosphere.brightnessShift = -0.33;
        // viewer.scene.fog.density = 0.001;
        // viewer.scene.fog.minimumBrightness = 0.8;

        var collection = viewer.scene.postProcessStages;
        var fs_snow = FS_Snow();
        var snow = new Cesium.PostProcessStage({
            name: 'czm_snow',
            fragmentShader: fs_snow
        });
        collection.add(snow);
        //viewer.scene.skyAtmosphere.hueShift = -0.8;
        //viewer.scene.skyAtmosphere.saturationShift = -0.7;
        viewer.scene.skyAtmosphere.brightnessShift = -0.33;//大气圈亮度 
        //viewer.scene.fog.density = 0.001;
        viewer.scene.fog.minimumBrightness = 0.8;//0.8
        //----------------createDrawHelper-----------------------------
        function createDrawHelper(){
            var drawHelper = new DrawHelper(viewer);
            var toolbar = drawHelper.addToolbar(document.getElementById("toolbar"), {
                buttons: ['marker', 'polyline', 'polygon', 'circle', 'extent']
            });
            toolbar.addListener('markerCreated', function(event) {
                loggingMessage('Marker created at ' + event.position.toString());
                // create one common billboard collection for all billboards
                var b = new Cesium.BillboardCollection();
                scene.primitives.add(b);
                var billboard = b.add({
                    show : true,
                    position : event.position,
                    pixelOffset : new Cesium.Cartesian2(0, 0),
                    eyeOffset : new Cesium.Cartesian3(0.0, 0.0, 0.0),
                    horizontalOrigin : Cesium.HorizontalOrigin.CENTER,
                    verticalOrigin : Cesium.VerticalOrigin.CENTER,
                    scale : 1.0,
                    image: '/static/sampledata/images/DrawHelper/glyphicons_242_google_maps.png',
                    color : new Cesium.Color(1.0, 1.0, 1.0, 1.0)
                });
                billboard.setEditable();
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
                    loggingMessage('Polyline edited, ' + event.positions.length + ' points');
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
                circle.setEditable();
                circle.addListener('onEdited', function(event) {
                    loggingMessage('Circle edited: radius is ' + event.radius.toFixed(1) + ' meters');
                });
            });
            toolbar.addListener('extentCreated', function(event) {
                var extent = event.extent;
                loggingMessage('Extent created (N: ' + extent.north.toFixed(3) + ', E: ' + extent.east.toFixed(3) + ', S: ' + extent.south.toFixed(3) + ', W: ' + extent.west.toFixed(3) + ')');
                var extentPrimitive = new DrawHelper.ExtentPrimitive({
                    extent: extent,
                    material: Cesium.Material.fromType(Cesium.Material.StripeType)
                });
                scene.primitives.add(extentPrimitive);
                extentPrimitive.setEditable();
                extentPrimitive.addListener('onEdited', function(event) {
                    loggingMessage('Extent edited: extent is (N: ' + event.extent.north.toFixed(3) + ', E: ' + event.extent.east.toFixed(3) + ', S: ' + event.extent.south.toFixed(3) + ', W: ' + event.extent.west.toFixed(3) + ')');
                });
            });

            var logging = document.getElementById('logging');
            function loggingMessage(message) {
                logging.innerHTML = message;
            }

        }
  }//mounted
}
</script>
<style scoped>

@import '../../js/Tools-03DrawHelper.css'
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
        #toolbar {
            position: absolute;
            top: 0px;
            left: 0;
            display: inline;
            margin: 10px;
            padding: 0px;
            background: white;
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

        body {
            padding: 0;
            margin: 0;
            overflow: hidden;
        }
</style>
