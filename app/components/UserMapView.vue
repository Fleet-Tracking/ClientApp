<template>
  <Page>
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
        :deliveryStatus="deliveryStatus"
        :key="parsedOrder"
        @pan="onDragSheet"
      />
    </AbsoluteLayout>
  </Page>
</template>

<script lang="ts">
import {
  Color,
  GridLayout,
  ImageSource,
  PanGestureEventData,
  View,
} from "@nativescript/core";
import { AndroidActivityBackPressedEventData } from "@nativescript/core/application/application-interfaces";
import { screen } from "@nativescript/core/platform";
import {
  MapView,
  Marker,
  Position,
  Polyline,
} from "nativescript-google-maps-sdk";
import Vue, { NativeScriptVue } from "nativescript-vue";
import { Component, Prop, Ref, Watch } from "vue-property-decorator";
import { vxm } from "~/store";
import BottomSheet from "./BottomSheet.vue";

@Component({
  components: {
    BottomSheet,
  },
})
export default class UserMapView extends Vue {
  @Prop({ default: () => {} })
  private order!: RawOrderItem;

  private parsedOrder?: OrderItem;

  private prevDeltaY: number = 0;

  @Ref("bottomSheet")
  private bottomSheet!: BottomSheet;

  private map?: NativeMap;

  private minHeightDp: number = 0;

  private deliveryMarker?: MarkerAndroid;
  private userMarker?: MarkerAndroid;

  private deliveryStatus: DeliveryStatus = "HALT";

  created() {
    this.fetchOrder();
  }

  destroyed() {
    vxm.firebase.removeOngoingListener();
  }

  async mapLoaded(event: any) {
    this.map = await this.getMap(<MapView>event.object);
    this.setupDefaultMarker();
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

  private async getMap(map: MapView) {
    return new Promise<NativeMap | undefined>((resolve) => {
      if (map) {
        map.nativeView.getMapAsync(
          new com.google.android.gms.maps.OnMapReadyCallback({
            onMapReady: (map: NativeMap) => {
              resolve(map);
            },
          })
        );
      } else {
        resolve(undefined);
      }
    });
  }

  private async fetchOrder() {
    const order = await vxm.firebase.fetchOrder({
      orderID: this.order.order,
      deliveryID: this.order.delivery,
    });

    if (order) {
      this.deliveryStatus = order.status;
      this.parsedOrder = { order };

      await vxm.firebase.watchOngoingDelivery({
        deliveryID: this.order.delivery,
        callback: (data) => {
          this.parsedOrder!.delivery = data;
          this.setupDefaultMarker();
        },
      });

      this.setupDefaultMarker();
    }
  }

  private async setupDefaultMarker() {
    console.log("triggered", this.parsedOrder);
    console.log(this.parsedOrder);
    if (this.map && this.parsedOrder) {
      if (!this.userMarker) {
        const userMarkerOptions = new Marker();
        userMarkerOptions.position = Position.positionFromLatLng(
          this.parsedOrder.order.lat,
          this.parsedOrder.order.lng
        );
        userMarkerOptions.title = "Your Location";
        userMarkerOptions.snippet = "Order will be delivered here";
        this.userMarker = this.map.addMarker(userMarkerOptions.android);
      }

      if (this.parsedOrder.delivery) {
        console.log("old", this.parsedOrder);
        if (this.deliveryMarker) {
          this.deliveryMarker.setPosition(
            Position.positionFromLatLng(
              this.parsedOrder.delivery.lat,
              this.parsedOrder.delivery.lng
            ).android
          );
        } else {
          console.log("new", this.parsedOrder);

          const deliveryMarkerOptions = new Marker();
          deliveryMarkerOptions.position = Position.positionFromLatLng(
            this.parsedOrder.delivery.lat,
            this.parsedOrder.delivery.lng
          );
          deliveryMarkerOptions.title = "Delivery Location";
          deliveryMarkerOptions.snippet = "Order which is being delivered";
          const descriptor =
            com.google.android.gms.maps.model.BitmapDescriptorFactory.fromAsset(
              "app/assets/car.png"
            );
          deliveryMarkerOptions.android.icon(descriptor);

          this.deliveryMarker = this.map.addMarker(
            deliveryMarkerOptions.android
          );
        }

        const polyline = new Polyline();
        polyline.addPoints([
          Position.positionFromLatLng(
            this.parsedOrder.order.lat,
            this.parsedOrder.order.lng
          ),
          Position.positionFromLatLng(
            this.parsedOrder.delivery.lat,
            this.parsedOrder.delivery.lng
          ),
        ]);

        polyline.visible = true;
        polyline.width = 8;
        const list = new java.util.ArrayList<any>();

        list.add(new com.google.android.gms.maps.model.Dot());
        list.add(new com.google.android.gms.maps.model.Gap(20));
        list.add(new com.google.android.gms.maps.model.Dash(30));
        list.add(new com.google.android.gms.maps.model.Gap(20));

        polyline.android.pattern(list);

        (polyline as any).loadPoints();
        this.map.addPolyline(polyline.android);
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
