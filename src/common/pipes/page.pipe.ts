import { Injectable, PipeTransform } from "@nestjs/common";

@Injectable()
export class ParsePagePipe implements PipeTransform {
  transform(value: number): number {
    return (value > 0 ? value : 1) - 1;
  }
}
