export enum ORDER_STATUS {
  RECEVIED="DonutReceived", DELIVERED="DonutDelivered", PICKED_UP="DonutPickedUp", OLD_TO_STAY="DonutToOldToStay", 
  TECH_FAILURE="TechnicalFailure"
}

export type RecordType = "ORDER"

export interface ICompany {
  companyName: string;
  id: string;
}

export interface IOrder {
  companyId: string;
  id: string;
  orderStatus: ORDER_STATUS;
  name: string;
  deliveryDate: string;
  createdAt: string;
  updatedAt: string;
  deliveredAt: string;
  recordType: RecordType;
}
