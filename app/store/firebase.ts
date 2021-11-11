import { firebase } from '@nativescript/firebase';
import { mutation, action } from 'vuex-class-component'
import { PHONE_NUMBER } from '~/utils/constants';
import { VuexModule } from './module';

export class FirebaseStore extends VuexModule.With({ namespaced: 'demo' }) {
  public user: UserData = { phone: '', uid: '' }
  public _initialized = false
  private _deliveryEventListener: firebase.AddEventListenerResult | undefined
  private _ordersEventListener: firebase.AddEventListenerResult | undefined
  private _ongoingEventListener: firebase.AddEventListenerResult | undefined


  private _deliveries: DeliveryItem[] = []
  private _orders: RawOrderItem[] = []

  get deliveries() {
    return this._deliveries
  }

  get orders() {
    return this._orders
  }

  @mutation
  addDelivery(item: DeliveryItem) {
    if (!this._deliveries.find(val => val.id === item.id)) {
      this._deliveries.push(item)
    }
  }

  @mutation
  addOrder(item: RawOrderItem) {
    if (!this._orders.find(val => val.id === item.id))
      this._orders.push(item)
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
  async fetchOrder(args: { orderID: string, deliveryID: string }): Promise<FirebaseOrderItem | undefined> {
    if (this._initialized) {
      const data = await firebase.getValue(`delivery/${args.deliveryID}/${args.orderID}`)
      return data.value
    }
  }

  @action
  async watchOngoingDelivery(args: { deliveryID: string, callback: (data: FirebaseDeliveryItem) => void }) {
    if (this._initialized) {
      const listener = (data: firebase.FBData) => {
        if (data.type === 'ValueChanged' && data.key === 'ongoing') {
          args.callback(data.value as FirebaseDeliveryItem)
        }
      }
      this._ongoingEventListener = await firebase.addValueEventListener(listener, `delivery/${args.deliveryID}/ongoing`)
    }
  }

  @action
  async removeOngoingListener() {
    if (this._ongoingEventListener)
      return firebase.removeEventListeners(this._ongoingEventListener.listeners, this._ongoingEventListener.path)
  }

  @action
  async setDeliveryStatus(args: { deliveryID: string, status: DeliveryStatus }) {
    firebase.setValue(`/delivery/${this.user.uid}/${args.deliveryID}/status`, args.status)
  }

  @action
  async watchDeliveries() {
    if (this.user) {
      const listener = (data: firebase.FBData) => {

        if (data.type === 'ChildAdded' && data.key !== 'ongoing') {
          if (data.value.lat && data.value.lng) {
            this.addDelivery({ lat: data.value.lat, lng: data.value.lng, status: data.value.status ?? 'HALT', id: data.key })
          } else {
            for (const [key, val] of Object.entries(data.value)) {
              if (key !== 'ongoing')
                this.addDelivery({ ...val as DeliveryItem, id: key })
            }
          }
        }
      }

      this._deliveryEventListener = await (firebase.addChildEventListener(listener, `/delivery/${this.user.uid}`))
    }
  }

  @action
  async watchOrders() {
    if (this.user) {

      const listener = (data: firebase.FBData) => {
        if (data.type === 'ChildAdded') {
          if (data.value.delivery && data.value.order) {
            this.addOrder({ delivery: data.value.delivery, order: data.value.order, id: data.key })
          } else {
            for (const [key, val] of Object.entries(data.value)) {
              this.addOrder({ ...val as { delivery: string, order: string }, id: key })
            }
          }
        }
      }
      this._ordersEventListener = await (firebase.addChildEventListener(listener, `/receiver/${this.user.uid}`))
    }
  }


  @action
  async updateCoordinates({ lat, lng }: { lat: number, lng: number }) {
    console.log(this._initialized, this.user)
    if (this._initialized && this.user && this.user.uid) {
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