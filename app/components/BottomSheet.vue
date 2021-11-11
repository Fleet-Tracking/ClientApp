<template>
  <GridLayout
    height="50%"
    width="100%"
    backgroundColor="blue"
    @pan="onDragSheet"
  >
    <AbsoluteLayout backgroundColor="yellow" height="100%">
      <Label top="300" left="175" :text="deliveryStatus" @loaded="loaded" />
    </AbsoluteLayout>
  </GridLayout>
</template>

<script lang="ts">
import { PanGestureEventData } from "@nativescript/core";
import Vue from "nativescript-vue";
import { Component, Prop } from "vue-property-decorator";

@Component
export default class BottomSheet extends Vue {
  @Prop({ default: () => {} })
  private deliveryStatus!: DeliveryStatus;

  private onDragSheet(event: PanGestureEventData) {
    this.$emit("pan", event);
  }

  private loaded() {
    this.$emit("loaded");
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
