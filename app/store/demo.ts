import { mutation, action } from 'vuex-class-component'
import { VuexModule } from './module';

export class DemoStore extends VuexModule.With({ namespaced: 'demo' }) {

}