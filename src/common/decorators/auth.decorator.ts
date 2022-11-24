import { UseGuards } from "@nestjs/common";
import { AuthGuard } from "common/guards/auth.guard";

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const Auth = () => UseGuards(AuthGuard);
