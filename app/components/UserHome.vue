<template>
  <Page @loaded="loaded" @navigatingFrom="leaving">
    <ActionBar>
      <Label text="Home" />
    </ActionBar>

    <ScrollView orientation="vertical">
      <StackLayout>
        <Button />
      </StackLayout>
    </ScrollView>
  </Page>
</template>

<script lang="ts">
import { android } from "@nativescript/core/application";
import { AndroidActivityBackPressedEventData } from "@nativescript/core/application/application-interfaces";
import Vue from "nativescript-vue";
import { Component } from "vue-property-decorator";
import { vxm } from "~/store";
import MapView from "./MapView.vue";

@Component
export default class UserHome extends Vue {
  async mounted() {
    await vxm.firebase.setInitialUserData("USER");
  }

  private customBack(data: AndroidActivityBackPressedEventData) {
    data.cancel = true;
    console.log("back pressed");
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
