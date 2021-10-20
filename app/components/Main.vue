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
import { login, onAuthStateChange } from "@/utils/firebase";
import DeliveryHome from "./DeliveryHome.vue";
import { firebase } from "@nativescript/firebase";

@Component
export default class Main extends Vue {
  private message: string = "Logging in...";

  async loaded() {
    const user = await firebase.getCurrentUser();
    if (user) {
      this.navToHome();
      return;
    }

    onAuthStateChange((data) => {
      if (data.loggedIn) {
        this.navToHome();
        return;
      }
    });

    await login();
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
