export type ScreenRecord = {
  id: string | null
  screen_id: string
  customer_name: string | null
  brand: string | null
  type: string | null
  license_plate: string | null
  year: string | number | null
  estimated_time: string | null
  service: string | null
  is_active?: boolean | null
  display_number?: number | null
}

export type SocketScreenUpdate = {
  screen_id: string
  payload: ScreenRecord & { is_active?: boolean | null }
}
