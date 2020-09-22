<!--
 * @Author: your name
 * @Date: 2020-09-21 11:36:01
 * @LastEditTime: 2020-09-22 23:09:18
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \oldemo\src\components\cusMap.vue
-->
<template>
  <div id="cusMap" class="cusMap"></div>
</template>

<script>
import "ol/ol.css";
import OlMap from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import ImageLayer from "ol/layer/Image";
import OSM from "ol/source/OSM";
import {
  defaults as defaultControls,
  ZoomToExtent,
  FullScreen,
} from "ol/control";
import MousePosition from "ol/control/MousePosition";
import { createStringXY } from "ol/coordinate";
import proj4 from "proj4";
import { register } from "ol/proj/proj4";
import Projection from "ol/proj/Projection";
import ImageWMS from "ol/source/ImageWMS";
import Point from "ol/geom/Point";
import TileWMS from "ol/source/TileWMS";

import { fromLonLat, toLonLat } from "ol/proj";

import { Draw, Modify, Snap } from "ol/interaction";
import { Vector as VectorSource } from "ol/source";
import { getBottomLeft, getTopRight } from "ol/extent";
import { Vector as VectorLayer } from "ol/layer";
import { Fill, Stroke, Circle, Style, Text } from "ol/style";
import XYZ from "ol/source/XYZ";
import GeoJSON from 'ol/format/GeoJSON';
import {bbox as bboxStrategy} from 'ol/loadingstrategy';


export default {
  name: "cusMap",
  data() {
    return {
      /**
       * 地图配置项
       */

      cusMap: null, //地图对象
      defaultProjection: null, // 地图默认坐标系
      defaultExtent: null, //地图默认全图范围
      defaultCenter: null, //地图默认中心点
      defaultZoom: 0, //地图默认缩放等级

      /**
       * 地图变量
       */
      onlineLayers: null, //地图包含的图层数据字典，用于图层管理使用
      tempLayers: [], //临时图层数据容器
    };
  },
  mounted() {},
  methods: {
    /**
     * @description:  通过必要的参数初始化组件
     * @param {string}  epsg 当前地图的坐标系唯一编码，eg:  "EPSG:4544"
     * @param {string} proj 当前地图的坐标系描述信息，eg: "+proj=tmerc +lat_0=0 +lon_0=105 +k=1 +x_0=500000 +y_0=0 +ellps=GRS80 +units=m +no_defs"
     * @param {array[double]} extent 一个double数组，长度为4，为当前地图的视图范围，eg:   [455256.6204984201,3141720.5074210567,458022.6002391203,3143216.185354917],
     * @param {int} defaultZoomLevel 默认的缩放等级,eg: 12
     * @param {array[double]} center 默认地图中心,eg [456740.59058152593,3142481.5177200856]
     * @return {type}  无返回值
     */
    initMap: function (epsg, proj, extent, defaultZoomLevel, center) {
      try {
        //保存坐标信息
        this.defaultProjection = projection;
        //保存地图边界范围信息
        this.defaultExtent = extent;
        //保存地图默认中心点
        this.defaultCenter = center;
        //保存地图默认缩放等级
        this.defaultZoom = defaultZoomLevel;

        /**
         * 初始化全局变量
         */
        //在线地图容器初始化（字典）
        this.onlineLayers = new Map();

        //定义地图坐标系
        proj4.defs(epsg, proj);

        //注册
        register(proj4);

        //创建坐标系对象及地图视图范围
        let projection = new Projection({
          code: epsg,
          extent: extent, //项目范围（最好和影像地图匹配）
        });

        //创建地图对象，设置初始缩放等级
        this.cusMap = new OlMap({
          layers: [
            new TileLayer({
              source: new OSM(), //默认地图osm
            }),
          ],
          target: "cusMap",
          view: new View({
            projection: projection, //使用这个坐标系
            center: center, //地图中心
            zoom: defaultZoomLevel, //默认缩放等级
          }),
        });
      } catch (error) {
        console.error(error);
      }
    },

    /**
     * @description: 添加Wms服务数据到地图上（针对geoserver服务)
     * @param {string} 图层WMS服务的路径
     * @param {string} 图层WMS服务的图层源名称
     * @param {double} 图层显示的不透明度,范围0-1
     * @param {string} 图层的唯一标识名称（最好和目录树对应）
     * @return {type} 暂时没有
     */
    addWmsLayerForGeoserver: function (url, layerName, opacity, name) {
      try {
        //创建栅格图层
        let layer = new ImageLayer({
          //   extent: this.extent,
          source: new ImageWMS({
            crossOrigin: "anonymous",
            url: url, //服务地址
            params: {
              FORMAT: "image/png",
              VERSION: "1.1.0",
              STYLES: "",
              LAYERS: layerName, //图层名称
            },
          }),
        });

        //判断地图上是否已加载类似图层数据
        if (!this.onlineLayers.has(name)) {
          this.onlineLayers.set(name, layer);
          //添加到地图上
          this.map.addLayer(layer);
        } else {
          console.warn(`地图已经包含图层:${name},请开发人员进行检查`);
        }
      } catch (error) {
        console.error(error);
      }
    },

    /**
     * @description:  添加xyz切片方式的底图
     * @param {string}  服务路径
     * @return {type}
     */
    addXyzTile(url) {
      try {
        //创建数据源
        let xyzSource = new XYZ({
          url: url,
        });

        //创建图层
        let xyzTile = new TileLayer({
          source: xyzSource,
        });

        //添加底图到地图
        this.cusMap.addLayer(xyzTile);
      } catch (error) {
        console.error(error);
      }
    },


 
    /**
     * @description: 设置图层的显示与隐藏
     * @param {string}  图层名称，添加图层时设置的唯一标识名称
     * @param {bool} 是否显示，true为显示
     * @return {type} 暂无
     */
    setLayerVisible: function (name, visible) {
      try {
        if (this.onlineLayers.has(layerName)) {
          this.onlineLayers.get(layerName).setVisible(visible);
        }
      } catch (error) {
        console.error(error);
      }
    },

    /**
     * @description: 地图飞行到指定的中心位置
     * @param {double} 横坐标
     * @param {double} 纵坐标
     * @param {bool}  坐标值是否为经纬度表达
     * @return {type} 暂无
     */
    FlyTo: function (x, y, done, isFromLonlat = true) {
      let location;

      if (isFromLonlat) {
        location = fromLonLat([x, y]);
      } else {
        location = [x, y];
      }
      var duration = 2000;
      let view = this.cusMap.getView();

      var zoom = view.getZoom();

      var parts = 2;

      var called = false;

      function callback(complete) {
        --parts;
        if (called) {
          return;
        }
        if (parts === 0 || !complete) {
          called = true;
          done(complete);
        }
      }
      view.animate(
        {
          center: location,
          duration: duration,
        },
        callback
      );
      view.animate(
        {
          zoom: zoom - 1,
          duration: duration / 2,
        },
        {
          zoom: zoom,
          duration: duration / 2,
        },
        callback
      );
    },

    /**
     * @description: 缩放至wkt
     * @param {string}  要素的wkt字符串
     * @return {type}
     */
    ZoomToWkt: function (wkt) {
      let format = new WKT();

      let feature = format.readFeature(wkt, {
        dataProjection: this.projection,
        featureProjection: this.projection,
      });

      let tempExtent = feature.getGeometry().getExtent();

      this.ZoomToExtent(tempExtent);
    },

    /**
     * @description: 缩放到边界
     * @param {ol/extent}  空间实体边界
     * @return {type}
     */
    ZoomToExtent: function (extent) {
      let mapPadding = [20, 10, 20, 10];

      this.cusMap.getView().fit(extent, this.cusMap.getSize(), {
        constrainResolution: false,
        earest: false,
        padding: mapPadding,
      });
    },

    /**
     * @description: 绘制多边形，执行回调
     * @param {function}  方法 eg: (evt)=>{}
     * @return {type} 暫無
     */
    drawPolygon: function (event) {
      //矢量数据源
      let source = new VectorSource();

      //绘制工具
      let draw = new Draw({
        source: source,
        type: "Polygon",
        stopClick: true,
      });

      //绑定
      draw.on("drawend", (evt) => {
        //执行回调
        event(evt);

        //操作注销
        this.cusMap.removeInteraction(draw);
      });

      //添加到地图上
      this.cusMap.addInteraction(draw);
    },

    /**
     * @description: 绘制线，执行回调
     * @param {function}  方法 eg: (evt)=>{}
     * @return {type}
     */
    drawLine: function (event) {
      let source = new VectorSource();

      let draw = new Draw({
        source: source,
        type: "LineString",
        stopClick: true,
      });

      draw.on("drawend", (evt) => {
        event(evt);
        this.map.removeInteraction(draw);
      });

      this.cusMap.addInteraction(draw);
    },

    /**
     * @description: 绘制点，执行回调
     * @param {function}  方法 eg: (evt)=>{} 回调
     * @return {type}
     */
    drawPoint: function (event) {
      let source = new VectorSource();

      let draw = new Draw({
        source: source,
        type: "Point",
        stopClick: true,
      });

      draw.on("drawend", (evt) => {
        event(evt);
        this.cusMap.removeInteraction(draw);
      });

      this.cusMap.addInteraction(draw);
    },

    /**
     * @description:  绘制文本
     * @param {string}  文本内容
     * @return {type}
     */
    drawLabel(value) {
      this.drawPoint((evt) => {
        let marker = evt.feature;
        marker.set("label", value);
        this.hiLightLabel(marker);
      });
    },

    /**
     * @description: 高亮显示要素
     * @param {ol/Feature} olFeature对象
     * @return {VectorLayer}  矢量图层
     */
    hilightFeature: function (feature) {
      let style = new Style({
        //点状填充
        image: new Circle({
          radius: 25,
          fill: new Fill({
            color: "rgba(255,0,0,1)",
          }),
          stroke: new Stroke({
            color: "#3399CC",
            width: 6,
          }),
        }),

        //面填充色
        fill: new Fill({
          color: "rgba(255, 255, 255, 0.6)",
        }),

        //边线
        stroke: new Stroke({
          color: "#319FD3",
          width: 5,
        }),
      });

      feature.setStyle(style);

      let source = new VectorSource({ wrapX: false });

      source.addFeature(feature.clone());

      let vector = new VectorLayer({
        source: source,
      });

      this.cusMap.addLayer(vector);

      //添加到临时数据容器中，方便清除
      this.tempLayers.push(vector);

      return vector;
    },

    /**
     * @description:  高亮显示文本
     * @param {ol/Feature}  要素
     * @param {string}  颜色
     * @return {type}
     */
    hiLightLabel: function (feature, fontcolor = "rgba(255, 0, 0,1)") {
      let source = new VectorSource({ wrapX: false });

      source.addFeature(feature.clone());

      let vector = new VectorLayer({
        source: source,
        style: (feature, resolution) => {
          return new Style({
            text: new Text({
              font: "20px Calibri,sans-serif",
              text: feature.clone().get("label"),
              fill: new Fill({ color: fontcolor }),
            }),
          });
        },
      });

      this.cusMap.addLayer(vector);

      this.tempLayers.push(vector);
    },

    /**
     * @description: 清空临时数据
     * @return {type}
     */
    clearTeampLayer() {
      for (let i = 0; i < this.tempLayers.length; i++) {
        this.cusMap.removeLayer(this.tempLayers[i]);
      }
    },
  },
};
</script>

<style>
#cusMap {
  height: 100%;
  width: 100%;
}
</style>