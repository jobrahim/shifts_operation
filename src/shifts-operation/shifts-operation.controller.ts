import {
  Controller,
  Post,
  Body,
  Res,
  HttpStatus,
  UseGuards,
  Get,
  Query,
  Req,
  Param,
  NotFoundException,
} from '@nestjs/common';
import { ShiftsOperationService } from './shifts-operation.service';

import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { MultipleCreateResponseDto } from 'src/shifts-operation-item/dto/multiple-create-response.dto';
import { CreateMultiplesOperationDto } from 'src/shifts-operation-item/dto/create-multiples-operation.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { IndexShiftOperationParamsDto } from 'src/shifts-operation-item/dto/index-shift-operation-params.dto';
import { IndexShiftOperationResponseDto } from 'src/shifts-operation-item/dto/index-shift-operation-response.dto';
import { DetailShiftResponseDto } from 'src/shifts-operation-item/dto/detail-shift-operation-response.dto';

@ApiBearerAuth()
@ApiTags('Shifts Operations')
@Controller('/shifts-operations')
export class ShiftsOperationController {
  constructor(
    private readonly shiftsOperationService: ShiftsOperationService,
  ) {}

  /**
   * Create multiples
   * @param createMultiplesOperatioDto
   * @param res
   */
  @ApiOperation({ summary: 'Create multiples' })
  @ApiResponse({
    status: 201,
    description: 'Create multiples Shifts Operations',
    type: MultipleCreateResponseDto,
  })
  @UseGuards(JwtAuthGuard)
  @Post('/operations')
  async create(
    @Body() createMultiplesOperatioDto: CreateMultiplesOperationDto,
    @Req() req,
    @Res() res,
  ) {
    try {
      // Se obtiene user del token
      const booking = createMultiplesOperatioDto.containers[0].booking_item;
      /* const user = req.user ? req.user : 'superadmin';
      const email = req.user ? req.user.email : 'ramoring@itl.com.ar'; */
      if (req.user === undefined) {
        throw new NotFoundException('User not found');
      }
      console.log('user from token: ', req.user);
      console.log('body: ', createMultiplesOperatioDto);
      const multiples = await this.shiftsOperationService.createOperation(
        booking,
        req.user,
        createMultiplesOperatioDto,
      );
      return res.status(HttpStatus.OK).json(multiples);
    } catch (error) {
      throw error;
    }
  }

  /**
   * View Details
   * Visualización del Detalle de Coordinaciones.
   * @param operation_id
   */

  @ApiOperation({ summary: 'View Details' })
  @ApiResponse({
    status: 200,
    description: 'Detail Shifts Operations',
    type: DetailShiftResponseDto,
  })
  @UseGuards(JwtAuthGuard)
  @Get('/operations/:operation_id')
  async detail(
    @Param('operation_id') operation_id: number,

    @Query('date') date: string,
    @Query('rangeHours') rangeHours: string,
    @Query('bookingId') bookingId: string,
    @Query('isoCode') isoCode: number,

    @Res() response,
  ): Promise<any> {
    try {
      const detOp = await this.shiftsOperationService.operationDetail(
        operation_id,
        date,
        rangeHours,
        bookingId,
        isoCode,
      );
      return response.status(HttpStatus.OK).json(detOp);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Index Shifts Operations
   * @param req request con los datos del usuario del JWT
   * @param response
   * @param page
   * @returns
   */

  @ApiOperation({ summary: 'List Shift Operation' })
  @ApiResponse({
    status: 200,
    description: 'Index Shifts Operations',
    type: IndexShiftOperationResponseDto,
  })
  @UseGuards(JwtAuthGuard)
  @Get('/operations')
  async getIndexShiftOperations(
    @Req() req,
    @Res() response,
    @Query() { page }: IndexShiftOperationParamsDto,
  ) {
    try {
      // Se valida que el usuario exista, por si omitimos el JWT
      const user = req.user ? req.user.username : 'superadmin';
      const indexOp = await this.shiftsOperationService.indexOperations(
        user,
        page,
      );
      return response.status(HttpStatus.OK).json(indexOp);
    } catch (error) {
      throw error;
    }
  }
}
