import {applyDecorators} from '@nestjs/common';
import {ValidateIf, ValidationOptions} from 'class-validator';

export function IsNullable(validationOptions?: ValidationOptions) {
    return applyDecorators(
        // ValidateIf는 조건에 따라 다른 validator들을 적용할지 말지를 결정하는 데코레이터
        // 여기서는 "값이 null이 아닐때만" 검증을 수행하게 함
        ValidateIf((ovject, value) => value !== null, validationOptions),
    )
}