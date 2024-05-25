import {
    AwsS3MultipartPartEntity,
    AwsS3MultipartPartSchema,
} from 'src/common/aws/repository/entities/aws.s3-multipart-part.entity';
import {
    DatabaseEntity,
    DatabaseProp,
    DatabaseSchema,
} from 'src/common/database/decorators/database.decorator';
import { IDatabaseDocument } from 'src/common/database/interfaces/database.interface';

@DatabaseEntity({ timestamps: false, _id: false })
export class AwsS3MultipartEntity {
    @DatabaseProp({
        required: true,
        type: String,
    })
    uploadId: string;

    @DatabaseProp({
        required: true,
        type: Number,
    })
    lastPartNumber: number;

    @DatabaseProp({
        required: true,
        type: Number,
    })
    maxPartNumber: number;

    @DatabaseProp({
        required: true,
        nullable: false,
        default: [],
        schema: AwsS3MultipartPartSchema,
    })
    parts: AwsS3MultipartPartEntity[];
}

export const AwsS3MultipartSchema = DatabaseSchema(AwsS3MultipartEntity);
export type AwsS3MultipartDoc = IDatabaseDocument<AwsS3MultipartEntity>;
