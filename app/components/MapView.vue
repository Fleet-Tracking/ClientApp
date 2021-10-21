<template>
  <Page>
    <ActionBar>
      <Label text="Home" />
    </ActionBar>

    <GridLayout class="info">
      <Label text="Sending coordinates..." />
    </GridLayout>
  </Page>
</template>

<script lang="ts">
import Vue from "nativescript-vue";
import { Component, Prop } from "vue-property-decorator";
import * as geolocation from "@nativescript/geolocation";

@Component
export default class MapView extends Vue {
  @Prop({ default: () => {} })
  private delivery!: DeliveryItem;

  async mounted() {
    console.log(this.delivery);
    this.updateCoordinates();
  }

  // TODO: Unset this on component destroy
  private async updateCoordinates() {
    try {
      await geolocation.enableLocationRequest();
    } catch (e) {
      console.log(e);
    }

    if (await geolocation.isEnabled()) {
      geolocation.watchLocation(
        (location) => {
          console.log(location);
        },
        (err) => {
          console.error(err);
        },
        { desiredAccuracy: 1 /* High Accuracy */ }
      );
    }

    // setTimeout(() => {

    // }, 15000)
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
</style>
