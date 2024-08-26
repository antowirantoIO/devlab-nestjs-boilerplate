import { Module } from '@nestjs/common';
import { CommandModule } from 'nestjs-command';
import { CommonModule } from 'src/common/common.module';
import { MigrationApiKeySeed } from 'src/migration/seeds/migration.api-key.seed';
import { MigrationCountrySeed } from 'src/migration/seeds/migration.country.seed';
import { MigrationEmailSeed } from 'src/migration/seeds/migration.email.seed';
import { MigrationRoleSeed } from 'src/migration/seeds/migration.role.seed';
import { MigrationUserSeed } from 'src/migration/seeds/migration.user.seed';
import { ActivityModule } from 'src/modules/activity/activity.module';
import { ApiKeyModule } from 'src/modules/api-key/api-key.module';
import { AuthModule } from 'src/modules/auth/auth.module';
import { CountryModule } from 'src/modules/country/country.module';
import { EmailModule } from 'src/modules/email/email.module';
import { PasswordHistoryModule } from 'src/modules/password-history/password-history.module';
import { RoleModule } from 'src/modules/role/role.module';
import { SessionModule } from 'src/modules/session/session.module';
import { UserModule } from 'src/modules/user/user.module';
@Module({
    imports: [
        CommonModule,
        CommandModule,
        ApiKeyModule,
        CountryModule,
        EmailModule,
        AuthModule,
        RoleModule,
        UserModule,
        ActivityModule,
        PasswordHistoryModule,
        SessionModule,
    ],
    providers: [
        MigrationApiKeySeed,
        MigrationCountrySeed,
        MigrationEmailSeed,
        MigrationUserSeed,
        MigrationRoleSeed,
    ],
    exports: [],
})
export class MigrationModule {}
