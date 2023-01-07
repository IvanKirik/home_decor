export type CartType = {
  items: {
    product: {
      id: string,
      name: string,
      price: string,
      image: string,
      url: string,
    },
    quantity: number
  }[]
}
