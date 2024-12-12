import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Job } from 'bullmq';
import { EmailResetPasswordDto } from 'src/modules/email/dtos/email.reset-password.dto';
import { EmailSendDto } from 'src/modules/email/dtos/email.send.dto';
import { EmailTempPasswordDto } from 'src/modules/email/dtos/email.temp-password.dto';
import { EmailWorkerDto } from 'src/modules/email/dtos/email.worker.dto';
import { ENUM_SEND_EMAIL_PROCESS } from 'src/modules/email/enums/email.enum';
import { IEmailProcessor } from 'src/modules/email/interfaces/email.processor.interface';
import { EmailService } from 'src/modules/email/services/email.service';
import { ENUM_WORKER_QUEUES } from 'src/worker/enums/worker.enum';

@Processor(ENUM_WORKER_QUEUES.EMAIL_QUEUE)
export class EmailProcessor extends WorkerHost implements IEmailProcessor {
    private readonly debug: boolean;
    private readonly logger = new Logger(EmailProcessor.name);

    constructor(
        private readonly emailService: EmailService,
        private readonly configService: ConfigService
    ) {
        super();

        this.debug = this.configService.get<boolean>('debug.enable');
    }

    async process(job: Job<EmailWorkerDto, any, string>): Promise<void> {
        try {
            const jobName = job.name;
            switch (jobName) {
                case ENUM_SEND_EMAIL_PROCESS.TEMPORARY_PASSWORD:
                    await this.processTempPassword(
                        job.data.send,
                        job.data.data as EmailTempPasswordDto
                    );

                    break;
                case ENUM_SEND_EMAIL_PROCESS.CHANGE_PASSWORD:
                    await this.processChangePassword(job.data.send);

                    break;
                case ENUM_SEND_EMAIL_PROCESS.WELCOME:
                    await this.processWelcome(job.data.send);

                    break;
                case ENUM_SEND_EMAIL_PROCESS.CREATE:
                    await this.processCreate(
                        job.data.send,
                        job.data.data as EmailTempPasswordDto
                    );

                    break;
                case ENUM_SEND_EMAIL_PROCESS.RESET_PASSWORD:
                    await this.processResetPassword(
                        job.data.send,
                        job.data.data as EmailResetPasswordDto
                    );

                    break;
                default:
                    break;
            }
        } catch (error: any) {
            if (this.debug) {
                this.logger.error(error);
            }
        }

        return;
    }

    async processWelcome(data: EmailSendDto): Promise<boolean> {
        return this.emailService.sendWelcome(data);
    }

    async processChangePassword(data: EmailSendDto): Promise<boolean> {
        return this.emailService.sendChangePassword(data);
    }

    async processTempPassword(
        data: EmailSendDto,
        tempPassword: EmailTempPasswordDto
    ): Promise<boolean> {
        return this.emailService.sendTempPassword(data, tempPassword);
    }

    async processCreate(
        data: EmailSendDto,
        tempPassword: EmailTempPasswordDto
    ): Promise<boolean> {
        return this.emailService.sendCreate(data, tempPassword);
    }

    async processResetPassword(
        data: EmailSendDto,
        resetPassword: EmailResetPasswordDto
    ): Promise<boolean> {
        return this.emailService.sendResetPassword(data, resetPassword);
    }
}
