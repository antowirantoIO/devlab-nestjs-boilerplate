import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { ActivityModule } from 'src/modules/activity/activity.module';
import { AuthModule } from 'src/modules/auth/auth.module';
import { AuthPublicController } from 'src/modules/auth/controllers/auth.public.controller';
import { CountryModule } from 'src/modules/country/country.module';
import { EmailModule } from 'src/modules/email/email.module';
import { HelloPublicController } from 'src/modules/hello/controllers/hello.public.controller';
import { PasswordHistoryModule } from 'src/modules/password-history/password-history.module';
import { RoleModule } from 'src/modules/role/role.module';
import { SessionModule } from 'src/modules/session/session.module';
import { SettingModule } from 'src/modules/setting/setting.module';
import { UserModule } from 'src/modules/user/user.module';
import { WORKER_CONNECTION_NAME } from 'src/worker/constants/worker.constant';
import { ENUM_WORKER_QUEUES } from 'src/worker/enums/worker.enum';

@Module({
    controllers: [HelloPublicController, AuthPublicController],
    providers: [],
    exports: [],
    imports: [
        SettingModule,
        UserModule,
        AuthModule,
        RoleModule,
        EmailModule,
        CountryModule,
        PasswordHistoryModule,
        SessionModule,
        ActivityModule,
        BullModule.registerQueue({
            connection: {
                name: WORKER_CONNECTION_NAME,
            },
            name: ENUM_WORKER_QUEUES.EMAIL_QUEUE,
        }),
    ],
})
export class RoutesPublicModule {}
