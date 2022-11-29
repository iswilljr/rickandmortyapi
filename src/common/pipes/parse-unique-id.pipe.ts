import { Injectable, PipeTransform } from "@nestjs/common";

@Injectable()
export class ParseUniqueIdPipe implements PipeTransform {
  transform(value: number[]): number[] {
    return Array.from(new Set(value));
  }
}
