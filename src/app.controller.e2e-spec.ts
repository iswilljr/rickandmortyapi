/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Test, type TestingModule } from "@nestjs/testing";
import request from "supertest";
import { AppModule } from "./app.module";
import { getUrl } from "./common/helpers/get-url.helper";
import { type INestApplication, ValidationPipe } from "@nestjs/common";

describe("AppController (e2e)", () => {
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
      }),
    );

    await app.init();
  });

  afterAll(() => app.close());

  it("should get all endpoint urls", async () => {
    const expected = {
      character: getUrl({ endpoint: "character" }),
      location: getUrl({ endpoint: "location" }),
      episode: getUrl({ endpoint: "episode" }),
    };

    const response = await request(app.getHttpServer()).get("/").expect("Content-Type", /json/).expect(200, expected);
    expect(Object.keys(response.body)).toEqual(Object.keys(expected));
  });
});
