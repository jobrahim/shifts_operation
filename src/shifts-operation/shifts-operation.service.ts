import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateMultiplesOperationDto } from 'src/shifts-operation-item/dto/create-multiples-operation.dto';
import { CreateShiftsOperationItemDto } from 'src/shifts-operation-item/dto/create-shifts-operation-item.dto';
import {
  DetailShiftItemResponseDto,
  DetailShiftResponseDto,
} from 'src/shifts-operation-item/dto/detail-shift-operation-response.dto';
import { MultipleCreateResponseDto } from 'src/shifts-operation-item/dto/multiple-create-response.dto';
import { ShiftsOperationItemService } from 'src/shifts-operation-item/shifts-operation-item.service';
import { EntityManager, Repository } from 'typeorm';
import { ShiftsOperationEntity } from './entities/shifts-operation.entity';
import { CreateShiftsContainerDto } from '../shifts-operation-item/dto/create-shifts-container.dto';
import {
  IndexFinalResponseDto,
  IndexOperationResponseDto,
} from 'src/shifts-operation-item/dto/index-final-response.dto';
import {
  CreateOperationOrderDto,
  OrderServiceDto,
} from 'src/shifts-operation-item/dto/create-operation-order.dto';
import { StatusOrder } from 'src/shifts-operation-item/dto/create-operation-order.dto';
import { UpdateShiftsOperationDto } from './dto/update-shifts-operation.dto';
import { UpdateShiftsOperationItemDto } from 'src/shifts-operation-item/dto/update-shifts-operation-item.dto';
import {
  OperationType,
  ShiftsOperationItemEntity,
} from 'src/shifts-operation-item/entities/shifts-operation-item.entity';
import { UpdateOperationDto } from 'src/shifts-operation-item/dto/update-operation.dto';
import {
  BookingDto,
  WrapperDto,
  appointmentDto,
} from 'src/shifts-operation-item/dto/booking.dto';

@Injectable()
export class ShiftsOperationService {
  constructor(
    @Inject(forwardRef(() => ShiftsOperationItemService))
    private shiftsOperationItemService: ShiftsOperationItemService,
    @InjectRepository(ShiftsOperationEntity)
    private readonly shiftsOperationRepository: Repository<ShiftsOperationEntity>,
    @InjectRepository(ShiftsOperationItemEntity)
    private readonly shiftsOperationItemRepository: Repository<ShiftsOperationItemEntity>,
    @Inject('APPOINTMENTS_SERVICE')
    private readonly appointmentsService: ClientProxy,
    @Inject('RESOURCE_SERVICE')
    private readonly resourceService: ClientProxy,
    @Inject('TIMERANGE_SERVICE')
    private readonly timerangesService: ClientProxy,
    @Inject('SHIFTS_CONTAINER_SERVICE')
    private readonly shiftsContainerService: ClientProxy,
    private readonly repository: EntityManager,
    @Inject('SHIFTS_BOOKING_SERVICE')
    private readonly shiftsBookingService: ClientProxy,
    @Inject('OPERATION_ORDER_SERVICE')
    private readonly operationOrderService: ClientProxy,
    @Inject('PROFILE_SERVICE')
    private readonly profileService: ClientProxy,
  ) {}

  async createOperation(
    bookingNumber: string,
    user,
    createMultiplesOperatioDto: CreateMultiplesOperationDto,
  ): Promise<any> {
    try {
      //--- finding the booking in N4 ---//
      const booking = await this.shiftsBookingService
        .send<any>({ cmd: 'booking' }, bookingNumber)
        .toPromise();
      console.log('booking ----->', booking);

      //--------------------------------//

      const operation = new ShiftsOperationEntity();
      const today = new Date().toISOString().substr(0, 23);

      const tzoffset = new Date().getTimezoneOffset() * 120000;
      //offset in milliseconds
      const localISOTime = new Date(Date.parse(today) - tzoffset)
        .toISOString()
        .slice(0, -1);
      operation.id = createMultiplesOperatioDto.id;
      operation.created = localISOTime;
      operation.changed = null;
      operation.user_id = user.username;
      operation.client_id = createMultiplesOperatioDto.client_id;
      operation.client_cuit = createMultiplesOperatioDto.client_cuit;
      operation.client_name = createMultiplesOperatioDto.client_name;
      operation.status = 'created';

      const shiftsOperation = await this.shiftsOperationRepository.save(
        operation,
      );

      let containers = [];
      containers = createMultiplesOperatioDto.containers;

      const listOfContainerResponse = [];
      let containerResponse;
      const newAppointment = [];
      let operationId = operation.id;
      const listOfOrders = [];
      for (const container of containers) {
        // Validar si el appointment existe
        console.log('call appointments-service');
        const appointment = await this.appointmentsService
          .send({ cmd: 'find-appointment' }, container.appointment_id)
          .toPromise();
        console.log('appointment', appointment);
        // Valida si el appointme existe
        if (!appointment) {
          listOfContainerResponse.push({
            success: false,
            message: `Appointment ${container.appointment_id} not found`,
          });
          continue;
        }

        // Persist container //
        const contDto = new CreateShiftsContainerDto();
        contDto.n4_unit_id = container.n4_unit_id;
        contDto.n4_ufv_gkey = container.n4_ufv_gkey;
        contDto.weight = container.weight;
        contDto.seal_agency = container.seal_agency;
        contDto.seal_customs = container.seal_customs;
        contDto.seal_others = container.seal_others;
        contDto.docs_customs = container.docs_customs;

        console.log('call shifts-container-service');
        const contSaved = await this.shiftsContainerService
          .send<any>({ cmd: 'create-shift-container' }, contDto)
          .toPromise();
        console.log('contSaved', contSaved);

        //---validate if container is saved correctly---//
        if (!contSaved) {
          listOfContainerResponse.push({
            success: false,
            message: 'Container not saved',
          });
          continue;
        }
        console.log('appointment.rangedate_id: ', appointment.rangedate_id);
        const rangeDate = await this.timerangesService
          .send<any>({ cmd: 'find-range-date' }, appointment.rangedate_id)
          .toPromise();
        console.log('rangeDate', rangeDate);

        const range = await this.timerangesService
          .send<any>({ cmd: 'find-range-franja' }, rangeDate.range_id)
          .toPromise();
        console.log('range', range);

        const date = await this.timerangesService
          .send<any>(
            { cmd: 'find-date-by-rangeDateId' },
            appointment.rangedate_id,
          )
          .toPromise();
        console.log('date', date);

        const operationItem = new CreateShiftsOperationItemDto();
        operationItem.type = container.type;
        operationItem.booking_item = container.booking_item;
        operationItem.appointment_id = container.appointment_id;
        operationItem.eqboiGkey = container.eqboiGkey;
        operationItem.shifts_operation = shiftsOperation.id;
        operationItem.container_id = contSaved.id;
        operationItem.n4_unit_id = container.n4_unit_id;
        console.log('operationItem.type: ', operationItem.type);

        operationItem.appointment_date = date;

        operationItem.appointment_range = range.range_id;

        if (Array.isArray(booking.dataJSON.Booking.itemList)) {
          for (const bookingItem of booking.dataJSON.Booking.itemList) {
            if (bookingItem.eqboiGkey === operationItem.eqboiGkey) {
              operationItem.container_iso = bookingItem.isoCode;
              console.log('bookingItem.eqboiGkey', bookingItem.eqboiGkey);
              console.log('operation.eqboiGkey', operationItem.eqboiGkey);
              operation.vesselVisit = booking.dataJSON.Booking.vesselVisit.id;

              console.log(
                'vesselVisit ',
                booking.dataJSON.Booking.vesselVisit.id,
              );
            }
          }
        } else {
          operationItem.container_iso =
            booking.dataJSON.Booking.itemList.isoCode;
          console.log('itemList', booking.dataJSON.Booking.itemList.isoCode);
          operation.vesselVisit = booking.dataJSON.Booking.vesselVisit.id;

          console.log('vesselVisit ', booking.dataJSON.Booking.vesselVisit.id);
        }
        await this.updateVessel(operation.id, operation);

        //-------------------------------------//

        console.log('operationItem:', operationItem);
        const item = await this.shiftsOperationItemService.create(
          operationItem,
        );

        console.log('item: ', item);

        //---------------- creating operation order in itl-order-entity ----------------//

        const operationOrderConsult = await this.operationOrderService
          .send<any>(
            { cmd: 'find-operation-order-by-container-id' },
            container.n4_unit_id,
          )
          .toPromise(); // consulta si existe una orden de operacion para el container

        console.log('operationOrderConsult: ', operationOrderConsult);

        if (operationOrderConsult !== null) {
          throw new NotFoundException(
            'Order for this container already exists',
          );
        } else {
          const order = new OrderServiceDto();
          const type = this.checkOperationType(operationItem.type);
          order.status = 'NEW';
          order.type = type;
          order.shifts_operation_id = shiftsOperation.id;
          order.shifts_operation_item = item.id;
          order.unitId = container.n4_unit_id;
          order.ufvGkey = '';
          order.transportServiceId = '';
          order.transportServiceId = '';
          order.tracking_id = '';
          order.billing_order_id = '';

          listOfOrders.push(order);
        }

        //---------------------------------------------------------------------------------------//
        operationId = item.operation_order_id; // asigning operation id to update booking on shiftBooking
        //---------------------------------------------------------------------------------------//
        //----------updating operation_order_id in shifts_operation_item table----------------//
        const newItem = new UpdateShiftsOperationItemDto();
        newItem.id = item.id;
        newItem.operation_order_id = item.operation_order_id;
        console.log('newItem', newItem);
        await this.shiftsOperationItemService.update(newItem.id, newItem);

        //---------------------------------------------------------------------------------//

        if (item) {
          containerResponse = {
            success: true,
            appointment_id: item.appointment_id,
            operation_item_id: item.id,
            container_id: operationItem.container_id,
            n4_unit_id: operationItem.n4_unit_id,
          };
        } else {
          containerResponse = {
            success: false,
            message: 'Operation item not saved',
          };
        }
        listOfContainerResponse.push(containerResponse);

        //-------------------------updating appointmentList of booking item ---------------------//

        const app = {
          eqboiGkey: parseInt(operationItem.eqboiGkey),
          lateArrival: false,
          apponitmentDate: operationItem.appointment_date,
          appointmentTimeFrom: range.start,
          appointmentTimeTo: range.end,
          appointmentQuantity: 1,
          unitNumber: container.n4_unit_id,
          seal1: container.seal_agency,
          seal2: container.seal_customs,
          seal3: container.seal_others,
          seal4: container.docs_customs,
          tons: parseInt(container.weight),
          oog: false,
          oogBackCm: 0,
          oogFrontCm: 0,
          oogLeftCm: 0,
          oogRightCm: 0,
          oogTopCm: 0,
          tareWtkg: 2000,
          customsDocuments: [container.docs_customs],
          vgmExo: true,
          twoCnt20InTruck: false,
          line: '',
          isoType: '',
          category: '',
          status: '',
        };

        newAppointment.push(app);

        console.log('newAppointment: ', newAppointment);
      }

      const operationCreated = await this.createOperationOrder(
        listOfOrders,
        createMultiplesOperatioDto,
        operation,
        user,
      );

      console.log('operation order created: ', operationCreated);

      await this.updateOperationOrderId(operationCreated);
      operationId = operationCreated.id;

      //---------------------------------------------------------------------------------//
      if (Array.isArray(booking.dataJSON.Booking.itemList)) {
        if (Array.isArray(newAppointment)) {
          let n = 0;
          for (const bookingItem of booking.dataJSON.Booking.itemList) {
            if (
              parseInt(bookingItem.eqboiGkey) === newAppointment[0].eqboiGkey
            ) {
              booking.dataJSON.Booking.itemList[n].appointmentList =
                newAppointment;
            }
            n++;
          }
        }
      } else {
        booking.dataJSON.Booking.itemList.appointmentList = newAppointment;
      }

      console.log(
        'booking.dataJSON.Booking.itemList',
        booking.dataJSON.Booking.itemList,
      );
      //---------------------------------------------------------------------------------//

      await this.updateBooking(
        operationId,
        user,
        booking,
        createMultiplesOperatioDto.client_id,
        createMultiplesOperatioDto.client_cuit,
        createMultiplesOperatioDto.client_name,
      );
      const resp: any = new MultipleCreateResponseDto();
      resp.operation_id = operation.id;
      resp.quantity = containers.length;
      resp.containers = listOfContainerResponse;

      return resp;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async updateOperationOrderId(operationCreated) {
    const orders = await this.operationOrderService
      .send<any>({ cmd: 'find-orders' }, operationCreated.id)
      .toPromise();
    console.log('orders: ', orders);
    const items = await this.shiftsOperationItemRepository.find({
      where: { shifts_operation: orders[0].shifts_operation_id },
    });

    for (const item of items) {
      item.operation_order_id = operationCreated.id;
      await this.shiftsOperationItemRepository.save(item);
    }
  }

  //------------ this function is used to update the booking with the new appointmentList  in N4 ------------//
  async updateBooking(
    bookingNumber,
    user,
    booking,
    client_id,
    client_cuit,
    client_name,
  ) {
    const bookingForUpdate = new BookingDto();

    bookingForUpdate.listWrapper = booking.dataJSON;

    console.log('bookingForUpdate', bookingForUpdate);
    bookingForUpdate.listWrapper.Booking.consignee.id = client_id;
    bookingForUpdate.listWrapper.Booking.consignee.cuit = client_cuit;
    bookingForUpdate.listWrapper.Booking.consignee.name = client_name;
    console.log(
      'bookingForUpdate itemList --->',
      bookingForUpdate.listWrapper.Booking.itemList,
    );
    console.log(
      'booking for update consignee: ',
      bookingForUpdate.listWrapper.Booking.consignee,
    );

    const bookingUpdated = {
      bookingNumber: bookingNumber,
      email: user.email,
      user: user.username,
      booking: bookingForUpdate,
    };

    const bookingResult = await this.shiftsBookingService
      .send<any>({ cmd: 'update-booking' }, bookingUpdated)
      .toPromise();

    return bookingResult;
  }

  //------------ this function is used to create the operation order in itl-order-entity ------------//

  async createOperationOrder(
    listOfOrders,
    createMultiplesOperatioDto,
    operation,
    user,
  ) {
    const operationOrder = new CreateOperationOrderDto();
    operationOrder.type = listOfOrders[0].type.name;
    operationOrder.user_creator = createMultiplesOperatioDto.user_id;
    operationOrder.updated = '';
    operationOrder.client_id = createMultiplesOperatioDto.client_id;
    operationOrder.client_cuit = createMultiplesOperatioDto.client_cuit;
    operationOrder.vesselVissit = operation.vesselVisit;
    operationOrder.booking_id =
      createMultiplesOperatioDto.containers[0].booking_item;
    // const opType = this.checkOperationType(operationItem.type);

    const profile = await this.profileService
      .send<any>({ cmd: 'get-profile' }, user.userId)
      .toPromise();

    console.log('organization id: ', profile.organizations.id);

    operationOrder.order_service = listOfOrders;

    (operationOrder.subscriber = {
      order_service_id: 1,
      organization_id: profile.organizations.id,
      role: 'CREATOR',
    }),
      console.log('operationOrder', operationOrder);

    const order = await this.operationOrderService
      .send<any>({ cmd: 'create-order-integration' }, operationOrder)
      .toPromise();
    console.log('order created: ', order);
    return order;
  }

  checkOperationType(operationItem) {
    let opType;
    switch (operationItem) {
      case OperationType.EXPO:
        opType = {
          id: 1,
          code: 'EXPORT',
          name: 'EXPO',
          bussines_unit: 'PORT',
        };
        break;
      case OperationType.IMPO:
        opType = {
          id: 2,
          code: 'IMPORT',
          name: 'IMPO',
          bussines_unit: 'PORT',
        };
        break;
      case OperationType.EMPTY:
        opType = {
          id: 3,
          code: 'EMPTY',
          name: 'EMPTY',
          bussines_unit: 'PORT',
        };
    }
    return opType;
  }

  //------------ this function is used to update the vesselVissit in shifts_operation table ------------//
  async updateVessel(
    id: number,
    operation: UpdateShiftsOperationDto,
  ): Promise<any> {
    const operationSaved = new UpdateShiftsOperationDto();
    operationSaved.id = id;
    operationSaved.vesselVisit = operation.vesselVisit;
    await this.shiftsOperationRepository.save(operationSaved);
    return operationSaved;
  }

  findOne(id: number): Promise<ShiftsOperationEntity> {
    return this.shiftsOperationRepository.findOne(id);
  }

  async indexOperations(userID: string, page = 0, limit = 5) {
    const pagination =
      'DECLARE @num_pagina INT = ' +
      page +
      ' DECLARE @reg_x_pagina INT = ' +
      limit +
      ' select so.id, si.type, si.booking_item, si.appointment_date, si.appointment_range, si.container_id, si.appointment_id, si.eqboiGkey, si.container_iso ' +
      'from shifts_operation_entity so inner join shifts_operation_item_entity si ' +
      ' on si.shifts_operation_id = so.id ' +
      'where so.user_id = ' +
      "'" +
      userID +
      "'" +
      ' ' +
      ' ORDER BY si.appointment_date DESC' +
      ' OFFSET (@num_pagina - 1) * @reg_x_pagina ROWS ' +
      'FETCH NEXT @reg_x_pagina ROWS ONLY';

    console.log(pagination);

    const query =
      ' select so.id, si.type, si.booking_item, si.appointment_date, si.appointment_range, si.container_id, si.appointment_id, si.eqboiGkey, si.container_iso ' +
      'from shifts_operation_entity so inner join shifts_operation_item_entity si ' +
      ' on si.shifts_operation_id = so.id ' +
      'where so.user_id = ' +
      "'" +
      userID +
      "'";

    const queryResult = await this.shiftsOperationRepository.query(query);

    const p = queryResult.length;

    const lastP = Math.ceil(p / limit);

    console.log('p', p);

    console.log('ultP', lastP);

    const operations = await this.repository.query(pagination);
    console.log(operations);

    const pag = operations.length / limit; //await this.shiftsOperationRepository.query(lastPage);

    // const pag = lastPageResult; //lastPageResult[0].val;
    console.log('lastPageResult:', pag);

    if (page > lastP) {
      throw new NotFoundException('page not found');
    }

    const response = new IndexOperationResponseDto();
    response.current_page = page;
    response.from = (page - 1) * limit;
    if (page.toString() === lastP.toString()) {
      const n = operations.length;
      response.to = response.from + n;
      response.per_page = n;
    } else {
      response.to = page * limit;
      response.per_page = limit;
    }
    response.last_page = lastP;

    response.data = [];

    for (const operation of operations) {
      const items = new IndexFinalResponseDto();
      items.id = operation.id;
      items.type = operation.type;

      items.turno = operation.appointment_date;
      items.hora = operation.appointment_range;
      // items.created = '2020-01-01';
      items.booking_id = operation.booking_item;
      items.billofLading = 'null';
      const booking = await this.shiftsBookingService
        .send<any>({ cmd: 'booking' }, operation.booking_item)
        .toPromise();

      items.vesselVoyage = booking.dataJSON.Booking.vesselVisit.id;

      items.vessel_visit_plus =
        booking.dataJSON.Booking.vesselVisit.vessel.name +
        ' ' +
        booking.dataJSON.Booking.vesselVisit.outVoyageNumber;

      items.outCallNumber = booking.dataJSON.Booking.vesselVisit.outCallNumber;

      items.iso_code = operation.container_iso;
      items.status = 'created';

      response.data.push(items);
    }

    return response;
  }

  async operationDetail(
    operation_id: number,
    date: string,
    rangeHours: string,
    bookingItem: string,
    isoCode: number,
  ) {
    console.clear();
    console.log(
      `operation_id ${operation_id}, date ${date}, rangeHours ${rangeHours}, bookingId ${bookingItem}, isoCode ${isoCode},`,
    );

    const filtro = {
      date,
      rangeHours,
      bookingItem,
      isoCode,
    };
    const operation = await this.shiftsOperationRepository.findOne(
      operation_id,
      {
        relations: ['shifts_operation_item'],
      },
    );
    console.log(
      '-------------------------------------------------------------------',
    );
    console.log(operation);
    console.log(
      '-------------------------------------------------------------------',
    );
    const response = new DetailShiftResponseDto(operation);

    for (const item of operation.shifts_operation_item) {
      console.log('call find-appointment');
      const appointment = await this.appointmentsService
        .send<any>({ cmd: 'find-appointment' }, item.appointment_id)
        .toPromise();
      console.log(appointment);
      if (!appointment) throw new NotFoundException('appointment not found');

      console.log('call find-range-date');
      const rango = await this.timerangesService
        .send<any>({ cmd: 'find-range-date' }, appointment.rangedate_id)
        .toPromise();

      console.log(rango);

      if (!rango) throw new NotFoundException('rango not found');

      console.log('call find-range-franja');
      const { range_id: franjaHoraria } = await this.timerangesService
        .send<any>({ cmd: 'find-range-franja' }, rango.range_id)
        .toPromise();
      console.log('franjaHoraria: ' + franjaHoraria);
      if (!franjaHoraria) throw new NotFoundException('franja not found');
      console.log('call find-n4_unit');
      const detailShiftItem = await this.shiftsContainerService
        .send<any>({ cmd: 'find-n4_unit' }, item.container_id)
        .toPromise();
      console.log(detailShiftItem);
      if (!detailShiftItem) throw new NotFoundException('n4_unit not found');
      const {
        id: n4UnitId,
        n4_unit_id,
        n4_ufv_gkey,
        weight,
        seal_customs,
        seal_agency,
        seal_others,
        docs_customs,
      } = detailShiftItem;
      console.log({ detailShiftItem });
      const responseItem = new DetailShiftItemResponseDto();
      responseItem.booking_line = 'booking_line';
      responseItem.booking_item = item.booking_item;
      responseItem.container_id = item.container_id;
      responseItem.container_iso = item.container_iso;
      responseItem.appointment_id = item.appointment_id;
      responseItem.appointment_date = appointment.created;
      responseItem.appointment_range = franjaHoraria;
      responseItem.appointment_status = appointment.status;
      responseItem.n4UnitId = n4UnitId;
      responseItem.n4_unit_id = n4_unit_id;
      responseItem.n4_ufv_gkey = n4_ufv_gkey;
      responseItem.weight = weight;
      responseItem.seal_customs = seal_customs;
      responseItem.seal_agency = seal_agency;
      responseItem.seal_others = seal_others;
      responseItem.docs_customs = docs_customs;

      const filterOk = this.validoFiltro(filtro, responseItem);
      console.log('filterOk: ' + filterOk);
      if (filterOk) {
        response.itemsDetails.push(responseItem);
      }
    }

    return response;
  }
  validoFiltro(filtro, responseItem) {
    console.log({ filtro });
    console.log({ responseItem });
    const { date, rangeHours, bookingItem, isoCode } = filtro;
    const { appointment_date, appointment_range, booking_item, container_iso } =
      responseItem;
    const fechas = appointment_date.split('T');
    const fecha = fechas[0];
    let valido = false;
    if (
      (date === fecha || date === undefined) &&
      (rangeHours === appointment_range || rangeHours === undefined) &&
      (bookingItem === booking_item || bookingItem === undefined) &&
      (isoCode === container_iso || isoCode === undefined)
    ) {
      valido = true;
    }
    if (
      date === undefined &&
      rangeHours === undefined &&
      bookingItem === undefined &&
      isoCode === undefined
    ) {
      valido = true;
    }

    return valido;
  }
}
