import { HttpException, HttpStatus } from '@nestjs/common';
import * as moment from 'moment';

export default (data: any) => {
  try {
    return moment(data, 'DD/MM/YYYY', true).toDate();
  } catch (error) {
    console.error(error);
    throw new HttpException(
      'Erro de Validação de Data!',
      HttpStatus.BAD_GATEWAY,
    );
  }
};
