<template>
  <Page>
    <ActionBar>
      <Label text="Home" />
    </ActionBar>

    <GridLayout>
      <Label class="info">
        <FormattedString>
          <Span class="fas" text.decode="&#xf135; " />
          <Span :text="message" />
        </FormattedString>
      </Label>
    </GridLayout>
  </Page>
</template>

<script lang="ts">
import Vue from "nativescript-vue";
import { Component } from "vue-property-decorator";
import { firebase } from "@nativescript/firebase";

@Component
export default class Home extends Vue {
  private message: string = "Hello";

  created() {
    firebase.init().then(
      () => {
        console.log("firebase.init done");
      },
      (error) => {
        console.log(`firebase.init error: ${error}`);
      }
    );
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
  vertical-align: center;
}
</style>
