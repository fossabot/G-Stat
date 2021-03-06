<template>
  <l-map
    ref="map"
    style="height: 100%; z-index: 0"
    :zoom="zoom"
    :center="center"
    @update:zoom="onZoom"
    @move="onMove"
  >
    <l-tile-layer
      v-if="tilesVisible"
      :url="'https://{s}.tile.osm.org/{z}/{x}/{y}.png'"
      :attribution="attribution"
    />
    <g-stat-area-layer
      v-if="areaGeoJson && areaData"
      :geo-json="areaGeoJson"
      :geo-data="areaData"
      :callback-data="areaCallbackData"
      :refresh="refresh"
      :mouse-hover-animation="animateAreaMouseHover"
      :border-color-func="areaBorderColorFunc"
      :border-opacity-func="areaBorderOpacityFunc"
      :border-width-func="areaBorderWidthFunc"
      :fill-color-func="areaFillColorFunc"
      :fill-opacity-func="areaFillOpacityFunc"
      :tooltip-func="areaTooltipFunc"
      @mouse-enter="onAreaMouseEnter"
      @mouse-leave="onAreaMouseLeave"
      @click="onAreaClick"
    />
    <g-stat-marker-layer
      v-if="markerData && markerData.length > 0"
      :data="markerData"
      :refresh="refresh"
      :callback-data="markerCallbackData"
      :fill-color-func="markerFillColorFunc"
      :icon-func="markerIconFunc"
      :icon-color-func="markerIconColorFunc"
      @click="onMarkerClick"
    />
  </l-map>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import * as geojson from 'geojson'

import { LMap, LTileLayer } from 'vue2-leaflet'
import GStatAreaLayer from '@/components/GStatAreaLayer.vue'
import GStatMarkerLayer from '@/components/GStatMarkerLayer.vue'
import { LeafletEvent, LeafletMouseEvent } from 'leaflet'
import {
  areaBorderColorFunc,
  areaBorderOpacityFunc,
  areaBorderWidthFunc,
  areaFillColorFunc,
  areaTooltipFunc, markerFillColorFuncType, markerIconColorFuncType, markerIconFuncType,
  MarkerItem
} from '../types'

const OSM_TILES = '&copy; <a target="_blank" href="http://osm.org/copyright">OpenStreetMap</a> contributors'
const OSM_ATTRIBUTION = '&copy; <a target="_blank" href="http://osm.org/copyright">OpenStreetMap</a> contributors'

export default Vue.extend({
  name: 'GStatBaseMap',
  components: {
    GStatMarkerLayer,
    GStatAreaLayer,
    LMap,
    LTileLayer
  },
  props: {
    // Data for Areas
    areaGeoJson: { type: Array as PropType<Array<geojson.Feature>>, required: false, default: null },
    areaData: { type: Object, required: false, default: null },

    // Data for Marker
    markerData: { type: Array as PropType<Array<MarkerItem>>, required: false, default: null },

    // Styling Map
    attribution: { type: String, required: false, default: OSM_ATTRIBUTION },
    tilesVisible: { type: Boolean, required: false, default: true },
    tilesUrl: { type: String, required: false, default: OSM_TILES },
    zoom: { type: Number, required: false, default: 10 },
    defaultCenter: { type: Array, required: false, default: () => [46.575855, 11.374969] },
    refresh: { type: Number, required: false, default: 0 },

    // Styling Area
    animateAreaMouseHover: { type: Boolean, required: false, default: true },
    areaBorderColorFunc: { type: Function as PropType<areaBorderColorFunc>, required: false, default: undefined },
    areaBorderOpacityFunc: { type: Function as PropType<areaBorderOpacityFunc>, required: false, default: undefined },
    areaBorderWidthFunc: { type: Function as PropType<areaBorderWidthFunc>, required: false, default: undefined },
    areaFillColorFunc: { type: Function as PropType<areaFillColorFunc>, required: false, default: undefined },
    areaFillOpacityFunc: { type: Function as PropType<areaFillColorFunc>, required: false, default: undefined },
    areaTooltipFunc: { type: Function as PropType<areaTooltipFunc>, required: false, default: undefined },
    areaCallbackData: { type: Object, required: false, default: null },

    // Styling Marker
    markerFillColorFunc: { type: Function as PropType<markerFillColorFuncType>, required: false, default: undefined },
    markerIconFunc: { type: Function as PropType<markerIconFuncType>, required: false, default: undefined },
    markerIconColorFunc: { type: Function as PropType<markerIconColorFuncType>, required: false, default: undefined },
    markerCallbackData: { type: Object, required: false, default: null }
  },
  data () {
    return {
      center: this.defaultCenter
    }
  },
  mounted () {
    // see comment in beforeUpdate()
    this.$forceUpdate()
  },
  beforeUpdate () {
    /*
     * Leaflet has it's problems with being in certain components, a v-dialog, for example. this line makes sure
     * to re-render the leaflet map when the size of the g-stat-base-map component changes
     */
    (this.$refs.map as LMap).mapObject.invalidateSize(true)
  },
  methods: {
    centerOn (target: L.GeoJSON) {
      (this.$refs.map as LMap).fitBounds(target.getBounds())
    },
    onZoom (event: LeafletEvent) {
      this.$emit('zoom', event)
    },
    onMove (event: LeafletEvent) {
      this.$emit('move', event)
    },
    onAreaMouseEnter (event: LeafletMouseEvent) {
      this.$emit('area-mouse-enter', event)
    },
    onAreaMouseLeave (event: LeafletMouseEvent) {
      this.$emit('area-mouse-leave', event)
    },
    onAreaClick (event: LeafletMouseEvent) {
      this.$emit('area-click', event)
    },
    onMarkerClick (event: LeafletMouseEvent) {
      this.$emit('marker-click', event)
    }
  }
})
</script>

<style>
</style>
