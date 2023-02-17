import { ParseUniqueIdPipe } from "./parse-unique-id.pipe";

const data = [1, 2, 2, 3, 3];
const expected = [1, 2, 3];

describe("CcPipe", () => {
  it("should be defined", () => {
    const pipe = new ParseUniqueIdPipe();
    expect(pipe).toBeDefined();
    expect(pipe.transform).toBeDefined();
  });

  it("should transform data properly", () => {
    const pipe = new ParseUniqueIdPipe();

    expect(pipe.transform(data)).toEqual(expected);
    expect(pipe.transform(data.concat(data))).toEqual(expected);
  });

  it("should call transform method", () => {
    const pipe = new ParseUniqueIdPipe();

    const transform = jest.fn(pipe.transform);

    transform(data);
    transform(data.concat(data));

    expect(transform).toBeCalledTimes(2);
  });
});
