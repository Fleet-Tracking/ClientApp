
type DeliveryStatus = 'HALT' | 'ONGOING' | 'COMPLETED'
interface DeliveryItem {
  id: string
  status: DeliveryStatus
  lat: number
  lng: number
}

interface RawOrderItem {
  id: string
  delivery: string
  order: string
}

interface FirebaseOrderItem {
  lat: number,
  lng: number,
  user: string
  status: DeliveryStatus
}

type FirebaseDeliveryItem = {
  lat: number,
  lng: number,
}

interface OrderItem {
  order: FirebaseOrderItem
  delivery?: FirebaseDeliveryItem
}

interface UserData {
  phone: string
  uid: string
}

interface NativeMap {
  addMarker(marker: any /* import('../node_modules/nativescript-google-maps-sdk/map-view').Marker */)
  addPolyline(shapes: any)
}
declare class MarkerAndroid {
  setPosition(position: any)
  remove()
}

declare module com {
  declare module google {
    declare module android {
      declare module gms {
        declare module maps {
          const OnMapReadyCallback: any

          declare module model {
            declare class BitmapDescriptorFactory {
              public static fromBitmap(image: any): BitmapDescriptorFactory
              public static fromAsset(image: string): BitmapDescriptorFactory
            }

            declare class Dash {
              constructor(n?: number)
            }

            declare class Dot {
              constructor(n?: number)
            }

            declare class Gap {
              constructor(n?: number)
            }
          }
        }
      }
    }
  }
}