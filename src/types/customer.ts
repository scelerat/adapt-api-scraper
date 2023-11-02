import { Policy } from './policy'
export interface Customer {
  name: string
  id: string
  email: string
  address: string
  policies: [Policy]
}
