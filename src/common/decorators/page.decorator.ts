import { ParseIntPipe, Query } from "@nestjs/common";
import { ParsePagePipe } from "common/pipes/page.pipe";

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const Page = () => Query("page", ParseIntPipe, ParsePagePipe);
