import { PipeTransform, BadRequestException } from "@nestjs/common";

export class TaskStatusValidationPipe implements PipeTransform {
    readonly allowedStatus = ["OPEN", "IN_PROGRESS", "DONE"]
    transform (value: any) {
        value = value.toUpperCase();
        
        if(!this.isValidStatus(value)) {
            throw new BadRequestException(`Invalid value ${value}`)
        }

        console.log(value);
        

        return value;
    }

    isValidStatus(val: any): Boolean {
        const statusIndex = this.allowedStatus.indexOf(val);
        return statusIndex !== -1
    }
}