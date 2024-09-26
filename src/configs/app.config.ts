import { registerAs } from '@nestjs/config';
import { version } from 'package.json';

export default registerAs(
    'app',
    (): Record<string, any> => ({
        name: process.env.APP_NAME,
        env: process.env.APP_ENV,
        timezone: process.env.APP_TIMEZONE,
        repoVersion: version,
        globalPrefix: '/api',

        debug: process.env.APP_DEBUG === 'true',

        http: {
            enable: process.env.HTTP_ENABLE === 'true',
            host: process.env.HTTP_HOST,
            port: Number.parseInt(process.env.HTTP_PORT),
        },
        urlVersion: {
            enable: process.env.URL_VERSIONING_ENABLE === 'true',
            prefix: 'v',
            version: process.env.URL_VERSION,
        },
    })
);
