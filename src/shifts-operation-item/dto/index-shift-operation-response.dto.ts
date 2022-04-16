export class IndexShiftOperationResponseDto {
  constructor({ meta, items }, limit: number) {
    const { totalItems, itemsPerPage, currentPage } = meta;

    this.current_page = currentPage;
    this.from = (currentPage - 1) * limit + 1;
    this.last_page = Math.ceil(totalItems / limit);
    this.per_page = itemsPerPage;
    this.to = currentPage * limit;
    this.total = totalItems;

    this.data = [];
    for (const i of items) {
      this.data.push(new IndexResponseDto(i));
    }
  }
  current_page: number;
  from: number;
  to: number;
  last_page: number;
  per_page: number;
  total: number;
  data: IndexResponseDto[];
}

export class IndexShiftOperationDataResponseDto {
  constructor({ id, created }) {
    this.id = Number(id);
    this.created = created;
    this.status = 'STATUS';
    this.booking_id = '0000';
  }

  id: number;
  created: string;
  status: string;
  booking_id: string;
  operationItems: IndexShiftOperationDataItemResponseDto[];
}

export class IndexShiftOperationDataItemResponseDto {
  constructor({ booking_item, container_id, appointment_id }) {
    this.booking_item = booking_item;
    this.container_id = container_id;
    this.appointment_id = appointment_id;
  }

  booking_item: string;
  container_id: string;
  appointment_id: string;
}

export class IndexResponseDto {
  constructor({ id, created, booking_item, container_id, appointment_id }) {
    this.id = Number(id);
    this.created = created;
    this.status = 'STATUS';
    this.booking_id = '0000';
    this.booking_item = booking_item;
    this.container_id = container_id;
    this.appointment_id = appointment_id;
  }
  id: number;
  created: string;
  status: string;
  booking_id: string;
  booking_item: string;
  container_id: string;
  appointment_id: string;
}
