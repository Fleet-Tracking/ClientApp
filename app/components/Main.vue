<template>
  <Page @loaded="loaded">
    <ActionBar>
      <Label text="Home" />
    </ActionBar>

    <GridLayout>
      <Label class="info">
        <FormattedString>
          <Label class="fas" text.decode="&#xf135; " />
          <Label :text="message" />
        </FormattedString>
      </Label>
    </GridLayout>
  </Page>
</template>

<script lang="ts">
import Vue from "nativescript-vue";
import { Component } from "vue-property-decorator";
import DeliveryHome from "./DeliveryHome.vue";
import { vxm } from "~/store";

@Component
export default class Main extends Vue {
  private message: string = "Logging in...";

  async loaded() {
    const user = await vxm.firebase.initialize();
    if (!user) {
      vxm.firebase.login();
    } else {
      vxm.firebase.setUser({ uid: user.uid, phone: user.phoneNumber! });
      console.log(vxm.firebase.user);
      this.navToHome();
    }

    vxm.firebase.$watch(
      "user",
      (user) => {
        if (user) {
          this.navToHome();
        }
      },
      { immediate: true, deep: false }
    );
  }

  private navToHome() {
    this.$navigateTo(DeliveryHome);
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
