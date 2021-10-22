<template>
  <Page @loaded="login">
    <ActionBar>
      <Label text="Home" />
    </ActionBar>

    <StackLayout>
      <Button text="Delivery" @tap="setUserType('DELIVERY')" />
      <Button text="User" @tap="setUserType('USER')" />
    </StackLayout>
  </Page>
</template>

<script lang="ts">
import Vue from "nativescript-vue";
import { Component } from "vue-property-decorator";
import DeliveryHome from "./DeliveryHome.vue";
import { vxm } from "~/store";
import UserHome from "./UserHome.vue";

@Component
export default class Main extends Vue {
  private userType: "DELIVERY" | "USER" = "USER";

  async login() {
    const user = await vxm.firebase.initialize();
    if (user) {
      vxm.firebase.setUser({ uid: user.uid, phone: user.phoneNumber! });
      console.log(vxm.firebase.user);
      // this.navToHome();
    }

    vxm.firebase.$watch(
      "user",
      (user) => {
        if (user) {
          // this.navToHome();
        }
      },
      { immediate: true, deep: false }
    );
  }

  // TODO: If user is logged in, then check where they belong from user metadata
  private setUserType(type: "DELIVERY" | "USER") {
    this.userType = type;
    this.navToHome();
    // vxm.firebase.login();
  }

  private navToHome() {
    if (this.userType === "DELIVERY") this.$navigateTo(DeliveryHome);
    else this.$navigateTo(UserHome);
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
