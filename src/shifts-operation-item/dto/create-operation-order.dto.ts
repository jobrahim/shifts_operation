export class CreateOperationOrderDto {
  id: number;
  created: string;
  type: string;
  user_creator: string;
  updated: string;
  client_id: string;
  client_cuit: string;
  vesselVissit: string;
  booking_id: string;
  order_service: any;
  subscriber: Subscriber;
}

export class OrderServiceDto {
  id: number;
  user_creator: string;
  status: string;
  type: any;
  operation: any;
  shifts_operation_id: number;
  shifts_operation_item: number;
  unitId: string;
  ufvGkey: string;
  transportServiceId: string;
  tracking_id: string;
  billing_order_id: string;
}

export class Subscriber {
  order_service_id: any;
  organization_id: number;
  role: string;
}

export enum StatusOrder {
  NEW = 'NEW',
  PROCESING = 'PROCESING',
  ERROR = 'ERROR',
  FINALIZED = 'FINALIZED',
}

export enum Role {
  OWNER = 'OWNER',
  READER = 'READER',
  CREATOR = 'CREATOR',
}
