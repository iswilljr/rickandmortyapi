import { Param, ParseArrayPipe } from "@nestjs/common";
import { ParseUniqueIdPipe } from "../../common/pipes/parse-unique-id.pipe";

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const Id = () => Param("id", new ParseArrayPipe({ items: Number }), ParseUniqueIdPipe);
