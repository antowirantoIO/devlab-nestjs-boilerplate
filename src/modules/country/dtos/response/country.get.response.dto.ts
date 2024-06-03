import { faker } from '@faker-js/faker';
import { ApiProperty } from '@nestjs/swagger';

export class CountryGetResponseDto {
    @ApiProperty({
        required: true,
        type: String,
        description: 'Country name',
        example: faker.location.country(),
        maxLength: 100,
        minLength: 1,
    })
    readonly name: string;

    @ApiProperty({
        required: true,
        type: String,
        description: 'Country code, Alpha 2 code version',
        example: faker.location.countryCode('alpha-2'),
        maxLength: 2,
        minLength: 2,
    })
    readonly alpha2Code: string;

    @ApiProperty({
        required: true,
        type: String,
        description: 'Country code, Alpha 3 code version',
        example: faker.location.countryCode('alpha-3'),
        maxLength: 3,
        minLength: 3,
    })
    readonly alpha3Code: string;

    @ApiProperty({
        required: true,
        type: String,
        description: 'Country code, Numeric code version',
        example: faker.location.countryCode('numeric'),
        maxLength: 3,
        minLength: 3,
    })
    readonly numericCode: string;

    @ApiProperty({
        required: true,
        type: String,
        description: 'Country code, FIPS version',
        example: faker.location.countryCode('alpha-2'),
        maxLength: 2,
        minLength: 2,
    })
    readonly fipsCode: string;

    @ApiProperty({
        required: true,
        type: String,
        description: 'Country phone code',
        example: [faker.helpers.arrayElement(['62', '65'])],
        maxLength: 4,
        minLength: 4,
        isArray: true,
        default: [],
    })
    readonly phoneCode: string[];

    @ApiProperty({
        required: true,
        example: faker.location.country(),
    })
    readonly continent: string;

    @ApiProperty({
        required: true,
        example: faker.location.timeZone(),
    })
    readonly timeZone: string;

    @ApiProperty({
        required: false,
        description: 'Top level domain',
        example: faker.internet.domainSuffix(),
    })
    readonly domain?: string;
}
