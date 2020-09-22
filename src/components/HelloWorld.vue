<!--
 * @Author: your name
 * @Date: 2020-09-21 11:34:04
 * @LastEditTime: 2020-09-22 23:13:02
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \oldemo\src\components\HelloWorld.vue
-->
<template>
  <el-container class="common">
    <el-aside width="200px" class="common">
      <el-button class="commonBtn" type="primary" @click="createMap">地图创建</el-button>
      <el-button class="commonBtn" type="primary"  @click="drawLine">线段绘制，回调</el-button>
      <el-button class="commonBtn" type="primary" @click="drawPolygon">多边形绘制，回调</el-button>
      <el-button class="commonBtn" type="primary" @click="drawLabel">文本绘制</el-button>
      <el-button class="commonBtn" type="primary" @click="clearTemplate">清除临时数据</el-button>
      <el-button class="commonBtn" type="primary" @click="flyToPoint">定位到点</el-button>
      <el-button class="commonBtn" type="primary" @click="ZoomToWkt">缩放至wkt</el-button>
      <el-button class="commonBtn" type="primary" @click="createPoint">高亮显示点</el-button>
      <el-button class="commonBtn" type="primary" @click="createPolyline">高亮显示线</el-button> 
      <el-button class="commonBtn" type="primary" @click="addXyzTile">添加xyz底图</el-button>
      <el-button class="commonBtn" type="primary" @click="setZoomLevel">控制图层显示等级</el-button>
    </el-aside>
    <el-main class="common">
      <cusMap ref="cusMap" class="common"></cusMap>
    </el-main>
  </el-container>
</template>

<script>
import cusMap from "./cusMap";

import featureEx from '../cusOl/olFeature'

export default {
  name: "HelloWorld",
  components: { cusMap },
  data() {
    return {
      msg: "Welcome to Your Vue.js App",
    };
  },
  methods: {
    createMap() {
      this.$refs.cusMap.initMap(
        "EPSG:4544",
       "+proj=tmerc +lat_0=0 +lon_0=105 +k=1 +x_0=500000 +y_0=0 +ellps=GRS80 +units=m +no_defs",
       [455256.6204984201,3141720.5074210567,458022.6002391203,3143216.185354917],
        2,
       [456740.59058152593,3142481.5177200856]
      );

      this.$message({
        message: "地图创建成果",
        type: "success",
      });
    },
   drawPolygon(){

      this.$refs.cusMap.drawPolygon((evt)=>{
         this.$message({
        message: "多边形绘制完成",
        type: "success",
      });
      })

    },
    drawLine(){

      this.$refs.cusMap.drawLine((evt)=>{
         this.$message({
        message: "线段绘制完成",
        type: "success",
      });
      })

    },
    drawLabel(){

      this.$refs.cusMap.drawLabel("文本内容");

    },
    clearTemplate(){
        this.$refs.cusMap.clearTeampLayer();
    },
    flyToPoint(){
        this.$refs.cusMap.FlyTo(456740.59058152593, 3142481.5177200856,(aa)=>{},false);

    }, 
    ZoomToWkt(){
        this.$refs.cusMap.ZoomToWkt("POINT(456740.59058152593  3142481.5177200856)");

    },
    createPoint(){
      let feature=featureEx.fromWkt("POINT(456740.59058152593  3142481.5177200856)");

      this.$refs.cusMap.hilightFeature(feature);
    },
    createPolyline(){
      let feature=featureEx.fromWkt("LINESTRING(456740.59058152593  3142481.5177200856,456148.59058152593  3142459.5177200856)");

      this.$refs.cusMap.hilightFeature(feature);
    },

    addXyzTile(){
       this.$refs.cusMap.addXyzTile('http://t0.tianditu.com/DataServer?T=img_w&x={x}&y={y}&l={z}&tk=c0b9cb30599dd11c468c8aaa2fc1863a');
     
    },

    setZoomLevel(){
      let feature=featureEx.fromWkt("POINT(456740.59058152593  3142481.5177200856)");

      let tempVecLayer= this.$refs.cusMap.hilightFeature(feature);

      tempVecLayer.setMaxZoom(2.5);
    }

 },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style >
.common {
  height: 100%;
}

.commonBtn {
  margin: 5px !important;
}
</style>
