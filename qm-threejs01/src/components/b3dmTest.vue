<template>
<el-countainer>
     <div class="fullSize" id="cesiumContainer"></div>
   
</el-countainer>

</template>

<script type="text/javascript">
import Cesium from 'cesium/Cesium'
import {Cesiumtj} from '../js/cesiumtj/ysc'
import widgets from 'cesium/Widgets/widgets.css'
import {devPath,devPath2,devPath3} from '../js/api/path'
export default {
    data() {
        return {
         tileset:{}
        }
    },
   methods:{
    initeCesium:function(){
      
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
        this.viewer._cesiumWidget._creditContainer.style.display = "none";
        var scene = this.viewer.scene;
        scene.globe.depthTestAgainstTerrain = false; 
        var tileset = new Cesium.Cesium3DTileset({
            url: devPath3,
            shadows:Cesium.ShadowMode.DISABLED,//去除阴影
          
         
        });
       this.viewer.scene.primitives.add(tileset);
       this.viewer.zoomTo(tileset);
            
   var height = -520;　　//根据地形设置调整高度
   tileset.readyPromise.then(function(argument) {
        //贴地显示
        var cartographic = Cesium.Cartographic.fromCartesian(tileset.boundingSphere.center);
        var surface = Cesium.Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, cartographic.height);
        var offset = Cesium.Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, cartographic.height + height);
        var translation = Cesium.Cartesian3.subtract(offset, surface, new Cesium.Cartesian3());
        tileset.modelMatrix = Cesium.Matrix4.fromTranslation(translation);
    })
       

     },
    changeHeight:function (height,tileset) {
         height = Number(height);
            if (isNaN(height)) {
                return;
            }
    
        var cartographic = Cesium.Cartographic.fromCartesian(tileset.boundingSphere.center);
        var surface = Cesium.Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, cartographic.height);
        var offset = Cesium.Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude,height);
        var translation = Cesium.Cartesian3.subtract(offset, surface, new Cesium.Cartesian3());
        tileset.modelMatrix = Cesium.Matrix4.fromTranslation(translation);
    }
   },
   created(){

    },
   mounted () {
    var _this = this;
    this.initeCesium();


  }//mounted
}
</script>
<style >

</style>
