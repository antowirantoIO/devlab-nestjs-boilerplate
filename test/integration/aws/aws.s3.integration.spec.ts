import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { INTEGRATION_AWS_URL } from './aws.s3.constant';
import request from 'supertest';
import { CommonModule } from 'src/common/common.module';
import { RoutesModule } from 'src/router/routes/routes.module';

describe('Aws S3 Integration', () => {
    let app: INestApplication;

    const apiKey = 'qwertyuiop12345zxcvbnmkjh';
    const apiKeyHashed =
        'e11a023bc0ccf713cb50de9baa5140e59d3d4c52ec8952d9ca60326e040eda54';
    const xApiKey = `${apiKey}:${apiKeyHashed}`;

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [CommonModule, RoutesModule],
            controllers: [],
        }).compile();

        app = moduleRef.createNestApplication();

        await app.init();
    });

    it(`GET ${INTEGRATION_AWS_URL} Success`, async () => {
        const response = await request(app.getHttpServer()).get(
            INTEGRATION_AWS_URL
        );
        expect(response.status).toEqual(HttpStatus.OK);
        expect(response.body.statusCode).toEqual(HttpStatus.OK);

        return;
    });
});
