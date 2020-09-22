/*
 * @Author: your name
 * @Date: 2020-09-21 16:54:51
 * @LastEditTime: 2020-09-21 18:08:43
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \oldemo\src\cusOl\olFeature.js
 */
import WKT from "ol/format/WKT";

export default {




    /**
     *  @description: 将wkt转换为Feature对象
     * @param {string} wkt 
     * @param {ol/proj/Projection} fromProj 
     * @param {ol/proj/Projection} toProj 
     * 
     * @return {ol​/Feature}  根据wkt创建的要素对象
     */
    fromWkt: function (wkt, fromProj, toProj) {

        let format = new WKT();

        let feature = format.readFeature(wkt, {
            dataProjection: fromProj,
            featureProjection: toProj
        });

        return feature;
    },



    /**
     * @description:  将要素转换为wkt
     * @param {ol​/Feature}  feature 实体要素
     * @return {string} 转换后的wkt字符串 
     */  
    toWkt:function(feature){
        let format = new WKT();
        return format.writeFeature(feature);
       },
}