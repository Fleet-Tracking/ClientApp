interface DeliveryItem {
  id: string
  lat: number
  lng: number
}

interface OrderItem {
  id: string
  delivery: string
  order: string
}

interface UserData {
  phone: string
  uid: string
}