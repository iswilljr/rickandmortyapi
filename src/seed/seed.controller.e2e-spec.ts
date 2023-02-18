/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Test, type TestingModule } from "@nestjs/testing";
import * as request from "supertest";
import { AppModule } from "../app.module";
import { type INestApplication, ValidationPipe } from "@nestjs/common";

describe("SeedController (e2e)", () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: { enableImplicitConversion: true },
      })
    );

    await app.init();
  });

  afterAll(() => app.close());

  it("should seed the database", async () => {
    const expected = {
      message: "OK",
    };

    await request(app.getHttpServer()).post("/seed").expect("Content-Type", /json/).expect(201, expected);
  });
});