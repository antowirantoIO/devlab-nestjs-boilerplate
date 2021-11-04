import { Controller, Get, Query } from '@nestjs/common';
import { AuthJwtGuard } from 'src/auth/auth.decorator';
import { ENUM_PERMISSIONS } from 'src/permission/permission.constant';
import { PaginationService } from 'src/pagination/pagination.service';
import { PermissionService } from './permission.service';
import { PermissionDocument } from './permission.interface';
import { Response } from 'src/response/response.decorator';
import { IResponsePaging } from 'src/response/response.interface';
import { RequestQueryValidationPipe } from 'src/request/pipe/request.query.validation.pipe';
import { PermissionListValidation } from './validation/permission.list.validation';

@Controller('/permission')
export class PermissionController {
    constructor(
        private readonly paginationService: PaginationService,
        private readonly permissionService: PermissionService
    ) {}

    @Get('/')
    @AuthJwtGuard(ENUM_PERMISSIONS.PERMISSION_READ)
    @Response('permission.findAll')
    async findAll(
        @Query(RequestQueryValidationPipe)
        { page, perPage, sort, search }: PermissionListValidation
    ): Promise<IResponsePaging> {
        const skip = await this.paginationService.skip(page, perPage);
        const find: Record<string, any> = {};
        if (search) {
            find['$or'] = [
                {
                    name: {
                        $regex: new RegExp(search),
                        $options: 'i'
                    }
                }
            ];
        }

        const permissions: PermissionDocument[] = await this.permissionService.findAll(
            find,
            {
                skip: skip,
                limit: perPage,
                sort
            }
        );

        const totalData: number = await this.permissionService.getTotalData(
            find
        );
        const totalPage = await this.paginationService.totalPage(
            totalData,
            perPage
        );

        return {
            totalData,
            totalPage,
            currentPage: page,
            perPage,
            data: permissions
        };
    }
}
