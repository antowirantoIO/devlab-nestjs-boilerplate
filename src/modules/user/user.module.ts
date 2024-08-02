import { Module } from '@nestjs/common';
import { UserService } from './services/user.service';
import { UserRepositoryModule } from 'src/modules/user/repository/user.repository.module';
import { UserStateHistoryService } from 'src/modules/user/services/user-state-history.service';
import { UserPasswordHistoryService } from 'src/modules/user/services/user-password-history.service';
import { UserLoginHistoryService } from 'src/modules/user/services/user-login-history.service';

@Module({
    imports: [UserRepositoryModule],
    exports: [
        UserService,
        UserStateHistoryService,
        UserPasswordHistoryService,
        UserLoginHistoryService,
    ],
    providers: [
        UserService,
        UserStateHistoryService,
        UserPasswordHistoryService,
        UserLoginHistoryService,
    ],
    controllers: [],
})
export class UserModule {}
