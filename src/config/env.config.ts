import * as Joi from "joi";

export const validationSchema = Joi.object({
  BASE_URL: Joi.string().uri().required(),
  POSTGRES_DB: Joi.string().required(),
  POSTGRES_HOST: Joi.string().required(),
  POSTGRES_PASSWORD: Joi.string().required(),
  POSTGRES_PORT: Joi.number().port().required(),
  POSTGRES_USER: Joi.string().required(),
  JWT_SECRET: Joi.string().required(),
  TOKEN: Joi.string().required(),
});
