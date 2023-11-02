export interface Policy {
  id: string
  premium: number
  status: string
  effectiveDate: Date
  terminationDate: Date
  lastPaymentDate?: Date
}
