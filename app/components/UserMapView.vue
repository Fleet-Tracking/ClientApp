<template>
  <Page xmlns:maps="nativescript-google-maps-sdk">
    <ActionBar>
      <Label text="Home" />
    </ActionBar>

    <AbsoluteLayout>
      <MapView
        @loaded="mapLoaded"
        ref="map"
        top="0"
        height="100%"
        width="100%"
      />
      <BottomSheet
        ref="bottomSheet"
        verticalAlignment="top"
        @pan="onDragSheet"
      />
    </AbsoluteLayout>
  </Page>
</template>

<script lang="ts">
import { GridLayout, PanGestureEventData, View } from "@nativescript/core";
import { AndroidActivityBackPressedEventData } from "@nativescript/core/application/application-interfaces";
import { screen } from "@nativescript/core/platform";
import { MapView } from "nativescript-google-maps-sdk";
import Vue, { NativeScriptVue } from "nativescript-vue";
import { Component, Prop, Ref } from "vue-property-decorator";
import { vxm } from "~/store";
import BottomSheet from "./BottomSheet.vue";

@Component({
  components: {
    BottomSheet,
  },
})
export default class UserMapView extends Vue {
  @Prop({ default: () => {} })
  private order!: OrderItem;

  private prevDeltaY: number = 0;

  @Ref("bottomSheet")
  private bottomSheet!: BottomSheet;

  @Ref("map")
  private map!: MapView;

  private minHeightDp: number = 0;

  mapLoaded() {
    this.map.gMap;
  }

  private customBack(data: AndroidActivityBackPressedEventData) {
    data.cancel = true;
    console.log("back pressed");
  }

  private onDragSheet(event: PanGestureEventData) {
    if (!this.minHeightDp) {
      this.minHeightDp =
        this.bottomSheet.nativeView.getMeasuredHeight() /
        (screen as any).mainScreen.scale;
    }

    if (event.state === 1) {
      // down
      this.prevDeltaY = 0;
    } else if (event.state === 2) {
      // panning

      const translateFinal =
        this.bottomSheet.nativeView.translateY + event.deltaY - this.prevDeltaY;

      if (translateFinal <= 0 && translateFinal >= 0 - this.minHeightDp + 70) {
        this.bottomSheet.nativeView.translateY = translateFinal;
        this.prevDeltaY = event.deltaY;
      }
    }
  }
}
</script>

<style scoped lang="scss">
@import "@nativescript/theme/scss/variables/blue";

// Custom styles
.fas {
  @include colorize($color: accent);
}

.info {
  font-size: 20;
  horizontal-align: center;
  vertical-align: center;
}

.main {
  width: 100%;
  height: 100%;
}
</style>
