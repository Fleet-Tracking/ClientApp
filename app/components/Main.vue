<template>
  <Page>
    <ActionBar>
      <Label text="Home" />
    </ActionBar>

    <GridLayout>
      <Label class="info" @tap="gotoTest">
        <FormattedString>
          <Label class="fas" text.decode="&#xf135; " />
          <Label :text="message" @tap="gotoTest" />
        </FormattedString>
      </Label>
    </GridLayout>
  </Page>
</template>

<script lang="ts">
import Vue from "nativescript-vue";
import { Component } from "vue-property-decorator";
import { initialize } from "@/utils/firebase";
import { firebase } from "@nativescript/firebase";
@Component
export default class Home extends Vue {
  private message: string = "Hello";
  private initialized: boolean = false;

  created() {
    initialize().then((url) => {
      console.info(url);
      this.initialized = true;
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
</style>
