<template>
  <GridLayout
    height="50%"
    width="100%"
    backgroundColor="blue"
    @pan="onDragSheet"
  >
    <Label backgroundColor="yellow" text="test" @loaded="loaded" />
  </GridLayout>
</template>

<script lang="ts">
import { PanGestureEventData } from "@nativescript/core";
import Vue from "nativescript-vue";
import { Component } from "vue-property-decorator";

@Component
export default class BottomSheet extends Vue {
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
