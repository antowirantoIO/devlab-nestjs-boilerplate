import {
    Body,
    Controller,
    Delete,
    Get,
    Patch,
    Post,
    Put,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ENUM_API_KEY_TYPE } from 'src/common/api-key/constants/api-key.enum.constant';
import {
    API_KEY_DEFAULT_AVAILABLE_ORDER_BY,
    API_KEY_DEFAULT_AVAILABLE_SEARCH,
    API_KEY_DEFAULT_IS_ACTIVE,
    API_KEY_DEFAULT_ORDER_BY,
    API_KEY_DEFAULT_ORDER_DIRECTION,
    API_KEY_DEFAULT_PER_PAGE,
    API_KEY_DEFAULT_TYPE,
} from 'src/common/api-key/constants/api-key.list.constant';
import {
    ApiKeyAdminDeleteGuard,
    ApiKeyAdminGetGuard,
    ApiKeyAdminUpdateActiveGuard,
    ApiKeyAdminUpdateGuard,
    ApiKeyAdminUpdateInactiveGuard,
    ApiKeyAdminUpdateResetGuard,
} from 'src/common/api-key/decorators/api-key.admin.decorator';
import {
    ApiKeyPublicProtected,
    GetApiKey,
} from 'src/common/api-key/decorators/api-key.decorator';
import {
    ApiKeyAdminActiveDoc,
    ApiKeyAdminCreateDoc,
    ApiKeyAdminDeleteDoc,
    ApiKeyAdminGetDoc,
    ApiKeyAdminInactiveDoc,
    ApiKeyAdminListDoc,
    ApiKeyAdminResetDoc,
    ApiKeyAdminUpdateDateDoc,
    ApiKeyAdminUpdateNameDoc,
} from 'src/common/api-key/docs/api-key.admin.doc';
import { ApiKeyCreateRequestDto } from 'src/common/api-key/dtos/request/api-key.create.request.dto';
import { ApiKeyUpdateDateRequestDto } from 'src/common/api-key/dtos/request/api-key.update-date.request.dto';
import { ApiKeyUpdateNameRequestDto } from 'src/common/api-key/dtos/request/api-key.update-name.request.dto';
import { ApiKeyCreateResponseDto } from 'src/common/api-key/dtos/response/api-key.create.dto';
import { ApiKeyGetResponseDto } from 'src/common/api-key/dtos/response/api-key.get.response.dto';
import { ApiKeyListResponseDto } from 'src/common/api-key/dtos/response/api-key.list.response.dto';
import { ApiKeyResetResponseDto } from 'src/common/api-key/dtos/response/api-key.reset.dto';
import { ApiKeyDoc } from 'src/common/api-key/repository/entities/api-key.entity';
import { ApiKeyService } from 'src/common/api-key/services/api-key.service';
import { AuthJwtAccessAdminProtected } from 'src/common/auth/decorators/auth.jwt.decorator';
import {
    PaginationQuery,
    PaginationQueryFilterInBoolean,
    PaginationQueryFilterInEnum,
} from 'src/common/pagination/decorators/pagination.decorator';
import { PaginationListDto } from 'src/common/pagination/dtos/pagination.list.dto';
import { PaginationService } from 'src/common/pagination/services/pagination.service';
import {
    ENUM_POLICY_ACTION,
    ENUM_POLICY_SUBJECT,
} from 'src/common/policy/constants/policy.enum.constant';
import { PolicyAbilityProtected } from 'src/common/policy/decorators/policy.decorator';
import { RequestParamRequired } from 'src/common/request/decorators/request.decorator';
import {
    Response,
    ResponsePaging,
} from 'src/common/response/decorators/response.decorator';
import {
    IResponse,
    IResponsePaging,
} from 'src/common/response/interfaces/response.interface';

@ApiTags('common.admin.apiKey')
@Controller({
    version: '1',
    path: '/api-key',
})
export class ApiKeyAdminController {
    constructor(
        private readonly apiKeyService: ApiKeyService,
        private readonly paginationService: PaginationService
    ) {}

    @ApiKeyAdminListDoc()
    @ResponsePaging('apiKey.list')
    @PolicyAbilityProtected({
        subject: ENUM_POLICY_SUBJECT.API_KEY,
        action: [ENUM_POLICY_ACTION.READ],
    })
    @AuthJwtAccessAdminProtected()
    @ApiKeyPublicProtected()
    @Get('/list')
    async list(
        @PaginationQuery(
            API_KEY_DEFAULT_PER_PAGE,
            API_KEY_DEFAULT_ORDER_BY,
            API_KEY_DEFAULT_ORDER_DIRECTION,
            API_KEY_DEFAULT_AVAILABLE_SEARCH,
            API_KEY_DEFAULT_AVAILABLE_ORDER_BY
        )
        { _search, _limit, _offset, _order }: PaginationListDto,
        @PaginationQueryFilterInBoolean('isActive', API_KEY_DEFAULT_IS_ACTIVE)
        isActive: Record<string, any>,
        @PaginationQueryFilterInEnum(
            'type',
            API_KEY_DEFAULT_TYPE,
            ENUM_API_KEY_TYPE
        )
        type: Record<string, any>
    ): Promise<IResponsePaging<ApiKeyListResponseDto>> {
        const find: Record<string, any> = {
            ..._search,
            ...isActive,
            ...type,
        };

        const apiKeys: ApiKeyDoc[] = await this.apiKeyService.findAll(find, {
            paging: {
                limit: _limit,
                offset: _offset,
            },
            order: _order,
        });
        const total: number = await this.apiKeyService.getTotal(find);
        const totalPage: number = this.paginationService.totalPage(
            total,
            _limit
        );
        const mapped = await this.apiKeyService.mapApiKeyList(apiKeys);

        return {
            _pagination: { totalPage, total },
            data: mapped,
        };
    }

    @ApiKeyAdminGetDoc()
    @Response('apiKey.get')
    @ApiKeyAdminGetGuard()
    @PolicyAbilityProtected({
        subject: ENUM_POLICY_SUBJECT.API_KEY,
        action: [ENUM_POLICY_ACTION.READ],
    })
    @AuthJwtAccessAdminProtected()
    @ApiKeyPublicProtected()
    @RequestParamRequired()
    @Get('/get/:apiKey')
    async get(
        @GetApiKey() apiKey: ApiKeyDoc
    ): Promise<IResponse<ApiKeyGetResponseDto>> {
        const mapped = await this.apiKeyService.mapApiKeyGet(apiKey);
        return { data: mapped };
    }

    @ApiKeyAdminCreateDoc()
    @Response('apiKey.create')
    @PolicyAbilityProtected({
        subject: ENUM_POLICY_SUBJECT.API_KEY,
        action: [ENUM_POLICY_ACTION.READ, ENUM_POLICY_ACTION.CREATE],
    })
    @AuthJwtAccessAdminProtected()
    @ApiKeyPublicProtected()
    @Post('/create')
    async create(
        @Body() body: ApiKeyCreateRequestDto
    ): Promise<IResponse<ApiKeyCreateResponseDto>> {
        const created: ApiKeyCreateResponseDto =
            await this.apiKeyService.create(body);

        return {
            data: created,
        };
    }

    @ApiKeyAdminResetDoc()
    @Response('apiKey.reset')
    @ApiKeyAdminUpdateResetGuard()
    @PolicyAbilityProtected({
        subject: ENUM_POLICY_SUBJECT.API_KEY,
        action: [ENUM_POLICY_ACTION.READ, ENUM_POLICY_ACTION.UPDATE],
    })
    @AuthJwtAccessAdminProtected()
    @ApiKeyPublicProtected()
    @RequestParamRequired()
    @Patch('/update/:apiKey/reset')
    async reset(
        @GetApiKey() apiKey: ApiKeyDoc
    ): Promise<IResponse<ApiKeyResetResponseDto>> {
        const updated: ApiKeyResetResponseDto =
            await this.apiKeyService.reset(apiKey);

        return {
            data: updated,
        };
    }

    @ApiKeyAdminUpdateNameDoc()
    @Response('apiKey.updateName')
    @ApiKeyAdminUpdateGuard()
    @PolicyAbilityProtected({
        subject: ENUM_POLICY_SUBJECT.API_KEY,
        action: [ENUM_POLICY_ACTION.READ, ENUM_POLICY_ACTION.UPDATE],
    })
    @AuthJwtAccessAdminProtected()
    @ApiKeyPublicProtected()
    @RequestParamRequired()
    @Put('/update/:apiKey')
    async updateName(
        @Body() body: ApiKeyUpdateNameRequestDto,
        @GetApiKey() apiKey: ApiKeyDoc
    ): Promise<IResponse<void>> {
        await this.apiKeyService.update(apiKey, body);

        return;
    }

    @ApiKeyAdminInactiveDoc()
    @Response('apiKey.inactive')
    @ApiKeyAdminUpdateInactiveGuard()
    @PolicyAbilityProtected({
        subject: ENUM_POLICY_SUBJECT.API_KEY,
        action: [ENUM_POLICY_ACTION.READ, ENUM_POLICY_ACTION.UPDATE],
    })
    @AuthJwtAccessAdminProtected()
    @ApiKeyPublicProtected()
    @RequestParamRequired()
    @Patch('/update/:apiKey/inactive')
    async inactive(@GetApiKey() apiKey: ApiKeyDoc): Promise<void> {
        await this.apiKeyService.inactive(apiKey);

        return;
    }

    @ApiKeyAdminActiveDoc()
    @Response('apiKey.active')
    @ApiKeyAdminUpdateActiveGuard()
    @PolicyAbilityProtected({
        subject: ENUM_POLICY_SUBJECT.API_KEY,
        action: [ENUM_POLICY_ACTION.READ, ENUM_POLICY_ACTION.UPDATE],
    })
    @AuthJwtAccessAdminProtected()
    @ApiKeyPublicProtected()
    @RequestParamRequired()
    @Patch('/update/:apiKey/active')
    async active(@GetApiKey() apiKey: ApiKeyDoc): Promise<void> {
        await this.apiKeyService.active(apiKey);

        return;
    }

    @ApiKeyAdminUpdateDateDoc()
    @Response('apiKey.updateDate')
    @ApiKeyAdminUpdateGuard()
    @PolicyAbilityProtected({
        subject: ENUM_POLICY_SUBJECT.API_KEY,
        action: [ENUM_POLICY_ACTION.READ, ENUM_POLICY_ACTION.UPDATE],
    })
    @AuthJwtAccessAdminProtected()
    @ApiKeyPublicProtected()
    @RequestParamRequired()
    @Put('/update/:apiKey/date')
    async updateDate(
        @Body() body: ApiKeyUpdateDateRequestDto,
        @GetApiKey() apiKey: ApiKeyDoc
    ): Promise<IResponse<void>> {
        await this.apiKeyService.updateDate(apiKey, body);

        return;
    }

    @ApiKeyAdminDeleteDoc()
    @Response('apiKey.delete')
    @ApiKeyAdminDeleteGuard()
    @PolicyAbilityProtected({
        subject: ENUM_POLICY_SUBJECT.API_KEY,
        action: [ENUM_POLICY_ACTION.READ, ENUM_POLICY_ACTION.DELETE],
    })
    @AuthJwtAccessAdminProtected()
    @ApiKeyPublicProtected()
    @RequestParamRequired()
    @Delete('/delete/:apiKey')
    async delete(@GetApiKey() apiKey: ApiKeyDoc): Promise<void> {
        await this.apiKeyService.delete(apiKey);

        return;
    }
}
