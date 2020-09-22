<!--
 * @Author: your name
 * @Date: 2020-09-21 11:34:04
 * @LastEditTime: 2020-09-22 23:48:15
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \oldemo\src\components\HelloWorld.vue
-->
<template>
  <el-container class="common">
    <el-aside width="200px" class="common">
      <el-button class="commonBtn" type="primary" @click="createMap">地图创建</el-button>
      <el-button class="commonBtn" type="primary" @click="drawLine">线段绘制，回调</el-button>
      <el-button class="commonBtn" type="primary" @click="drawPolygon">多边形绘制，回调</el-button>
      <el-button class="commonBtn" type="primary" @click="drawLabel">文本绘制</el-button>
      <el-button class="commonBtn" type="primary" @click="clearTemplate">清除临时数据</el-button>
      <el-button class="commonBtn" type="primary" @click="flyToPoint">定位到点</el-button>
      <el-button class="commonBtn" type="primary" @click="ZoomToWkt">缩放至wkt</el-button>
      <el-button class="commonBtn" type="primary" @click="createPoint">高亮显示点</el-button>
      <el-button class="commonBtn" type="primary" @click="createPolyline">高亮显示线</el-button>
      <el-button class="commonBtn" type="primary" @click="addXyzTile">添加xyz底图</el-button>
      <el-button class="commonBtn" type="primary" @click="setZoomLevel">控制图层显示等级</el-button>
      <el-button class="commonBtn" type="primary" @click="bindFeatureClick">矢量单击</el-button>
    </el-aside>
    <el-main class="common">
      <cusMap ref="cusMap" class="common"></cusMap>
    </el-main>
  </el-container>
</template>

<script>
import cusMap from "./cusMap";

import featureEx from "../cusOl/olFeature";

export default {
  name: "HelloWorld",
  components: { cusMap },
  data() {
    return {
      msg: "Welcome to Your Vue.js App",
    };
  },
  methods: {

    /**
     * @description: 创建地图控件，并设置基础数据
     * @param {type} 
     * @return {type} 
     */
    createMap() {
      this.$refs.cusMap.initMap(
        "EPSG:4544",
        "+proj=tmerc +lat_0=0 +lon_0=105 +k=1 +x_0=500000 +y_0=0 +ellps=GRS80 +units=m +no_defs",
        [
          455256.6204984201,
          3141720.5074210567,
          458022.6002391203,
          3143216.185354917,
        ],
        2,
        [456740.59058152593, 3142481.5177200856]
      );

      this.$message({
        message: "地图创建成果",
        type: "success",
      });
    },

    /**
     * @description: 绘制面并执行回调
     * @param {type} 
     * @return {type} 
     */
    drawPolygon() {
      this.$refs.cusMap.drawPolygon((evt) => {
        this.$message({
          message: "多边形绘制完成",
          type: "success",
        });
      });
    },

    /**
     * @description: 绘制线并执行回调
     * @param {type} 
     * @return {type} 
     */
    drawLine() {
      this.$refs.cusMap.drawLine((evt) => {
        this.$message({
          message: "线段绘制完成",
          type: "success",
        });
      });
    },

    /**
     * @description:  创建文字标注
     * @param {type} 
     * @return {type} 
     */
    drawLabel() {
      this.$refs.cusMap.drawLabel("文本内容");
    },

    /**
     * @description: 清除临时层
     * @param {type} 
     * @return {type} 
     */
    clearTemplate() {
      this.$refs.cusMap.clearTeampLayer();
    },

    /**
     * @description: 缩放至点
     * @param {type} 
     * @return {type} 
     */
    flyToPoint() {
      this.$refs.cusMap.FlyTo(
        456740.59058152593,
        3142481.5177200856,
        (aa) => {},
        false
      );
    },

    /**
     * @description: 缩放至wkt
     * @param {type} 
     * @return {type} 
     */
    ZoomToWkt() {
      this.$refs.cusMap.ZoomToWkt(
        "POINT(456740.59058152593  3142481.5177200856)"
      );
    },

    /**
     * @description: 创建单个点（一个点一个图层）
     * @param {type} 
     * @return {type} 
     */
    createPoint() {
      let feature = featureEx.fromWkt(
        "POINT(456740.59058152593  3142481.5177200856)"
      );

      this.$refs.cusMap.hilightFeature(feature);
    },


    /**
     * @description:  创建单个多段线（一个多段线一个图层）
     * @param {type} 
     * @return {type} 
     */
    createPolyline() {
      let feature = featureEx.fromWkt(
        "LINESTRING(456740.59058152593  3142481.5177200856,456148.59058152593  3142459.5177200856)"
      );

      this.$refs.cusMap.hilightFeature(feature);
    },

    /**
     * @description: 添加xyz格式的地图服务
     * @param {type} 
     * @return {type} 
     */
    addXyzTile() {
      this.$refs.cusMap.addXyzTile(
        "http://t0.tianditu.com/DataServer?T=img_w&x={x}&y={y}&l={z}&tk=c0b9cb30599dd11c468c8aaa2fc1863a"
      );
    },

    /**
     * @description: 设置图层的可见缩放等级
     * @param {type} 
     * @return {type} 
     */
    setZoomLevel() {
      //根据坐标创建点
      let feature = featureEx.fromWkt(
        "POINT(456740.59058152593  3142481.5177200856)"
      );

      //将点添加到新建的矢量图层中
      let tempVecLayer = this.$refs.cusMap.hilightFeature(feature);

      //设置图层的最大显示等级
      tempVecLayer.setMaxZoom(2.5);
    },

    /**
     * @description: 矢量数据单击，执行回调
     * @param {type} 
     * @return {type} 
     */
    bindFeatureClick() {
      this.$refs.cusMap.bindFeatureClick((feature) => {
        let coordinates = feature.getGeometry().getCoordinates();

        this.$message({
          message: `数据坐标数据如下:${coordinates}`,
          type: "success",
        });
      });
    },
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
