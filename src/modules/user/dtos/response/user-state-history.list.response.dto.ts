import { faker } from '@faker-js/faker';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Exclude, Type } from 'class-transformer';
import { DatabaseIdResponseDto } from 'src/common/database/dtos/response/database.id.response.dto';
import { ENUM_USER_STATUS } from 'src/modules/user/constants/user.enum.constant';
import { UserShortResponseDto } from 'src/modules/user/dtos/response/user.short.response.dto';

export class UserStateHistoryListResponseDto extends DatabaseIdResponseDto {
    @ApiProperty({
        required: true,
        example: faker.string.uuid(),
    })
    readonly user: string;

    @ApiProperty({
        required: true,
        enum: ENUM_USER_STATUS,
        example: ENUM_USER_STATUS.ACTIVE,
    })
    readonly beforeState: ENUM_USER_STATUS;

    @ApiProperty({
        required: true,
        enum: ENUM_USER_STATUS,
        example: ENUM_USER_STATUS.ACTIVE,
    })
    readonly afterState: ENUM_USER_STATUS;

    @ApiProperty({
        required: true,
        type: () => UserShortResponseDto,
    })
    @Type(() => UserShortResponseDto)
    readonly by: UserShortResponseDto;

    @ApiProperty({
        description: 'Date created at',
        example: faker.date.recent(),
        required: true,
        nullable: false,
    })
    readonly createdAt: Date;

    @ApiProperty({
        description: 'Date updated at',
        example: faker.date.recent(),
        required: true,
        nullable: false,
    })
    readonly updatedAt: Date;

    @ApiHideProperty()
    @Exclude()
    readonly deletedAt?: Date;
}
