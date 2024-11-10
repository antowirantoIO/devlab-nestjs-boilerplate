import { Command } from 'nestjs-command';
import { Injectable } from '@nestjs/common';
import { AuthService } from 'src/modules/auth/services/auth.service';
import { UserService } from 'src/modules/user/services/user.service';
import { RoleDoc } from 'src/modules/role/repository/entities/role.entity';
import { RoleService } from 'src/modules/role/services/role.service';
import {
    ENUM_USER_GENDER,
    ENUM_USER_SIGN_UP_FROM,
} from 'src/modules/user/enums/user.enum';
import { CountryDoc } from 'src/modules/country/repository/entities/country.entity';
import { CountryService } from 'src/modules/country/services/country.service';
import { PasswordHistoryService } from 'src/modules/password-history/services/password-history.service';
import { ActivityService } from 'src/modules/activity/services/activity.service';
import { MessageService } from 'src/common/message/services/message.service';
import { ENUM_PASSWORD_HISTORY_TYPE } from 'src/modules/password-history/enums/password-history.enum';
import { SessionService } from 'src/modules/session/services/session.service';

@Injectable()
export class MigrationUserSeed {
    constructor(
        private readonly authService: AuthService,
        private readonly userService: UserService,
        private readonly roleService: RoleService,
        private readonly countryService: CountryService,
        private readonly passwordHistoryService: PasswordHistoryService,
        private readonly activityService: ActivityService,
        private readonly messageService: MessageService,
        private readonly sessionService: SessionService
    ) {}

    @Command({
        command: 'seed:user',
        describe: 'seed users',
    })
    async seeds(): Promise<void> {
        const password = 'aaAA@123';
        const passwordHash = await this.authService.createPassword(password);
        const superAdminRole: RoleDoc =
            await this.roleService.findOneByName('superadmin');
        const adminRole: RoleDoc =
            await this.roleService.findOneByName('admin');

        const country: CountryDoc =
            await this.countryService.findOneByAlpha2('ID');

        const memberRole: RoleDoc =
            await this.roleService.findOneByName('member');
        const userRole: RoleDoc = await this.roleService.findOneByName('user');

        try {
            const [superAdmin, admin, member, user] = await Promise.all([
                this.userService.create(
                    {
                        role: superAdminRole._id,
                        name: 'superadmin',
                        email: 'superadmin@mail.com',
                        country: country._id,
                        gender: ENUM_USER_GENDER.MALE,
                    },
                    passwordHash,
                    ENUM_USER_SIGN_UP_FROM.SEED
                ),
                this.userService.create(
                    {
                        role: adminRole._id,
                        name: 'admin',
                        email: 'admin@mail.com',
                        country: country._id,
                        gender: ENUM_USER_GENDER.MALE,
                    },
                    passwordHash,
                    ENUM_USER_SIGN_UP_FROM.SEED
                ),
                this.userService.create(
                    {
                        role: memberRole._id,
                        name: 'member',
                        email: 'member@mail.com',
                        country: country._id,
                        gender: ENUM_USER_GENDER.MALE,
                    },
                    passwordHash,
                    ENUM_USER_SIGN_UP_FROM.SEED
                ),
                this.userService.create(
                    {
                        role: userRole._id,
                        name: 'user',
                        email: 'user@mail.com',
                        country: country._id,
                        gender: ENUM_USER_GENDER.MALE,
                    },
                    passwordHash,
                    ENUM_USER_SIGN_UP_FROM.SEED
                ),
            ]);

            const promises = [
                this.activityService.createByAdmin(superAdmin, {
                    by: superAdmin._id,
                    description: this.messageService.setMessage(
                        'activity.user.createByAdmin'
                    ),
                }),
                this.passwordHistoryService.createByAdmin(superAdmin, {
                    by: superAdmin._id,
                    type: ENUM_PASSWORD_HISTORY_TYPE.SIGN_UP,
                }),
                this.activityService.createByAdmin(admin, {
                    by: superAdmin._id,
                    description: this.messageService.setMessage(
                        'activity.user.createByAdmin'
                    ),
                }),
                this.passwordHistoryService.createByAdmin(admin, {
                    by: superAdmin._id,
                    type: ENUM_PASSWORD_HISTORY_TYPE.SIGN_UP,
                }),
                this.activityService.createByAdmin(member, {
                    by: superAdmin._id,
                    description: this.messageService.setMessage(
                        'activity.user.createByAdmin'
                    ),
                }),
                this.passwordHistoryService.createByAdmin(member, {
                    by: superAdmin._id,
                    type: ENUM_PASSWORD_HISTORY_TYPE.SIGN_UP,
                }),
                this.activityService.createByAdmin(user, {
                    by: superAdmin._id,
                    description: this.messageService.setMessage(
                        'activity.user.createByAdmin'
                    ),
                }),
                this.passwordHistoryService.createByAdmin(user, {
                    by: superAdmin._id,
                    type: ENUM_PASSWORD_HISTORY_TYPE.SIGN_UP,
                }),
            ];

            await Promise.all(promises);
        } catch (err: any) {
            throw new Error(err);
        }

        return;
    }

    @Command({
        command: 'remove:user',
        describe: 'remove users',
    })
    async remove(): Promise<void> {
        try {
            await this.userService.deleteMany({});
            await this.activityService.deleteMany({});
            await this.passwordHistoryService.deleteMany({});
            await this.sessionService.resetLoginSession();
            await this.sessionService.deleteMany({});
        } catch (err: any) {
            throw new Error(err);
        }

        return;
    }
}
