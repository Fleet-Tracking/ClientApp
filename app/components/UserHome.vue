<template>
  <Page @loaded="loaded" @navigatingFrom="leaving">
    <ActionBar>
      <Label text="Home" />
    </ActionBar>

    <StackLayout>
      <Button
        v-for="o in orders"
        :text="o.id"
        :key="o.id"
        @tap="openOrderView(o)"
      />
    </StackLayout>
  </Page>
</template>

<script lang="ts">
import Vue from "nativescript-vue";
import { Component } from "vue-property-decorator";
import { vxm } from "~/store";
import BottomSheet from "./BottomSheet.vue";
import { android } from "@nativescript/core/application";
import { AndroidActivityBackPressedEventData } from "@nativescript/core/application/application-interfaces";
import UserMapView from "./UserMapView.vue";

@Component({
  components: {
    BottomSheet,
  },
})
export default class UserHome extends Vue {
  private get orders() {
    return vxm.firebase.orders;
  }

  async mounted() {
    await vxm.firebase.setInitialUserData("USER");
    await vxm.firebase.watchOrders();
  }

  private loaded() {
    android.on("activityBackPressed", this.customBack);
  }

  private leaving() {
    android.off("activityBackPressed", this.customBack);
  }

  private customBack(data: AndroidActivityBackPressedEventData) {
    data.cancel = true;
    console.log("back pressed");
  }

  private openOrderView(item: RawOrderItem) {
    this.$navigateTo(UserMapView, {
      props: {
        order: item,
      },
    });
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
