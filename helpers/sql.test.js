const { sqlForPartialUpdate } = require("./sql");
const { BadRequestError } = require("../expressError");

describe("sqlForPartialUpdate", () => {
  test("works: correct output for valid input", () => {
    const dataToUpdate = { firstName: "Aliya", age: 32 };
    const jsToSql = { firstName: "first_name", age: "age" };
    
    const result = sqlForPartialUpdate(dataToUpdate, jsToSql);

    expect(result).toEqual({
      setCols: '"first_name"=$1, "age"=$2',
      values: ["Aliya", 32],
    });
  });

  test("works: input with missing jsToSql mapping uses default keys", () => {
    const dataToUpdate = { firstName: "Aliya", hobby: "Reading" };
    const jsToSql = { firstName: "first_name" };
    
    const result = sqlForPartialUpdate(dataToUpdate, jsToSql);

    expect(result).toEqual({
      setCols: '"first_name"=$1, "hobby"=$2',
      values: ["Aliya", "Reading"],
    });
  });

  test("works: input with no jsToSql mapping uses default keys", () => {
    const dataToUpdate = { lastName: "Smith", city: "New York" };
    const jsToSql = {}; // No mapping provided
    
    const result = sqlForPartialUpdate(dataToUpdate, jsToSql);

    expect(result).toEqual({
      setCols: '"lastName"=$1, "city"=$2',
      values: ["Smith", "New York"],
    });
  });

  test("throws BadRequestError if no data provided", () => {
    const dataToUpdate = {};
    const jsToSql = { firstName: "first_name" };

    expect(() => sqlForPartialUpdate(dataToUpdate, jsToSql))
      .toThrow(BadRequestError);
  });

  test("works: handles single field update", () => {
    const dataToUpdate = { firstName: "Aliya" };
    const jsToSql = { firstName: "first_name" };

    const result = sqlForPartialUpdate(dataToUpdate, jsToSql);

    expect(result).toEqual({
      setCols: '"first_name"=$1',
      values: ["Aliya"],
    });
  });
});
