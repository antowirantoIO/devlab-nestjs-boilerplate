import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { DatabaseRepositoryBase } from 'src/common/database/bases/database.repository';
import { InjectDatabaseModel } from 'src/common/database/decorators/database.decorator';
import {
    SettingDoc,
    SettingEntity,
} from 'src/modules/setting/repository/entities/setting.entity';

@Injectable()
export class SettingRepository extends DatabaseRepositoryBase<
    SettingEntity,
    SettingDoc
> {
    constructor(
        @InjectDatabaseModel(SettingEntity.name)
        private readonly settingModel: Model<SettingEntity>
    ) {
        super(settingModel);
    }
}
