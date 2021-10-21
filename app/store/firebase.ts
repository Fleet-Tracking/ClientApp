import { firebase } from '@nativescript/firebase';
import { mutation, action } from 'vuex-class-component'
import { PHONE_NUMBER } from '~/utils/constants';
import { VuexModule } from './module';

export class FirebaseStore extends VuexModule.With({ namespaced: 'demo' }) {
  public user: UserData = { phone: '', uid: '' }
  public _initialized = false
  private _deliveryEventListener: ((data: firebase.FBData) => void) | undefined

  private _deliveries: DeliveryItem[] = []

  get deliveries() {
    return this._deliveries
  }

  @mutation
  addDelivery(item: DeliveryItem) {
    if (!this._deliveries.find(val => val.id === item.id))
      this._deliveries.push(item)
  }

  @mutation
  setUser(user: UserData) {
    this.user = user
  }

  @action
  async login() {
    if (this._initialized) {
      return firebase
        .login({
          type: firebase.LoginType.PHONE,
          phoneOptions: { phoneNumber: PHONE_NUMBER },
        })
    } else {
      throw new Error("Firebase instance not initialized")
    }
  }

  @action
  async watchDeliveries() {
    if (this.user) {
      this._deliveryEventListener = (data) => {
        if (data.type === 'ChildAdded') {
          this.addDelivery({ ...data.value as { lat: number, lng: number }, id: data.key } as DeliveryItem)
        }
      }
      await (firebase.addChildEventListener(this._deliveryEventListener, `/delivery/${this.user.uid}`))
    }
  }

  @action
  async updateCoordinates({ lat, lng }: { lat: number, lng: number }) {
    if (this.user) {
      firebase.setValue(`/delivery/${this.user.uid}/ongoing`, {
        lat, lng
      })
    }
  }

  @action
  async setInitialUserData(type: 'DELIVERY' | 'USER') {
    if (this.user && this.user.phone) {
      firebase.setValue('/users/' + this.user.uid, {
        phone: this.user.phone,
        role: type
      })
    }
  }

  @action
  async initialize(): Promise<firebase.User | undefined> {
    return new Promise<firebase.User | undefined>((resolve) => {
      firebase.init({
        onAuthStateChanged: (data) => {
          this._initialized = true
          resolve(data.user)
        },
        persist: true,
      })
    })
  }
}