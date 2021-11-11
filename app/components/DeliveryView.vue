<template>
  <Page>
    <ActionBar>
      <Label text="Home" />
    </ActionBar>

    <GridLayout class="info">
      <Label row="0" col="0" text="Sending coordinates..." />
      <Button row="1" col="0" text="Complete order" @tap="completeDelivery" />
    </GridLayout>
  </Page>
</template>

<script lang="ts">
import Vue from "nativescript-vue";
import { Component, Prop } from "vue-property-decorator";
import * as geolocation from "@nativescript/geolocation";
import { vxm } from "~/store";

@Component
export default class MapView extends Vue {
  @Prop({ default: () => {} })
  private delivery!: DeliveryItem;

  async mounted() {
    this.updateCoordinates();
  }

  private async setDeliveryStatus(status: DeliveryStatus) {
    this.delivery.status = status;
    vxm.firebase.setDeliveryStatus({ deliveryID: this.delivery.id, status });
  }

  destroyed() {
    if (this.delivery.status !== "COMPLETED") this.setDeliveryStatus("HALT");
  }

  // TODO: Unset this on component destroy
  private async updateCoordinates() {
    this.setDeliveryStatus("ONGOING");
    try {
      await geolocation.enableLocationRequest();
    } catch (e) {
      console.log(e);
    }

    if (await geolocation.isEnabled()) {
      geolocation.watchLocation(
        (location) => {
          vxm.firebase.updateCoordinates({
            lat: location.latitude,
            lng: location.longitude,
          });
        },
        (err) => {
          console.error(err);
        },
        { desiredAccuracy: 1 /* High Accuracy */ }
      );
    }
  }

  private completeDelivery() {
    this.setDeliveryStatus("COMPLETED");
    this.$navigateBack();
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
