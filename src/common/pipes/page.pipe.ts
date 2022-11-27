import { Injectable, PipeTransform } from "@nestjs/common";

@Injectable()
export class ParsePagePipe implements PipeTransform {
  transform(value: any): number {
    const page = Math.floor(Number(value));
    return (page > 0 ? page : 1) - 1;
  }
}
