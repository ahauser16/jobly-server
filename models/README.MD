# `models` folder file notes/explanations/diagrams

## Table of Contents

- [models folder file notes/explanations/diagrams](#models-folder-file-notesexplanationsdiagrams)
  - [Tests](#tests)
    - [_testCommon.js](#_testcommonjs)
      - [_testCommon.js diagram](#_testCommonjs-diagram)
      - [Explanation of _testCommon.js Sequence Diagram](#explanation-of-_testCommonjs-Sequence-Diagram)
      - [Code Overview](#_testCommonjs-code-overview)
    - [company.test.js](#companytestjs)
      - [company.test.js sequence diagram](#companytestjs-sequence-diagram)
      - [Explanation of company.test.js sequence diagram](#explanation-of-companytestjs-sequence-diagram)
      - [Code Overview](#companytestjs-code-overview)
    - [user.test.js](#usertestjs)
      - [user.test.js Diagram](#usertestjs-Diagram)
      - [Explanation of user.test.js sequence diagram](#explanation-of-usertestjs-sequence-diagram)
      - [Code Overview](#usertestjs-Code-Overview) 
  - [Scripts](#scripts)
    - [company.js](#companyjs)
        - [company.js sequence diagram with explanation](#companyjs-sequence-diagram-with-explanation)
    - [user.js](#userjs) 
      - [user.js Explanation](#userjs-explanation) 
      - [user.js Diagram](#userjs-diagram) 
      - [Code Overview](#code-overview-2)

## Tests

### `_testCommon.js`

This file contains common setup and teardown functions for tests. These functions help ensure that the database is in a consistent state before and after each test.

#### \_testCommon.js diagram

```mermaid
sequenceDiagram
    participant Test
    participant DB
    participant bcrypt

    Test->>DB: [commonBeforeAll()] runs SQL query that deletes all entries from [companies] table
    Test->>DB: [commonBeforeAll()] runs SQL query that deletes all entries from [users] table
    Test->>DB: [commonBeforeAll()] runs SQL query that inserts sample data (c1, c2, c3) into [companies] table
    Test->>bcrypt: [commonBeforeAll()] hashes the password "password1"
    bcrypt->>Test: Return hashed "password1"
    Test->>bcrypt: [commonBeforeAll()] hashes the password "password2"
    bcrypt->>Test: Return hashed "password2"
    Test->>DB: [commonBeforeAll()] runs SQL query that inserts sample data (u1, u2) into the [users] table with hashed passwords
    Test->>DB: [commonBeforeEach()] runs SQL query that starts a new database transaction before each test
    Test->>DB: [commonAfterEach()] runs SQL query that rolls back the database transaction after each test
    Test->>DB: [commonAfterAll()] runs SQL query that closes the database connection after all tests
```

#### Explanation of _testCommon.js Sequence Diagram

The sequence diagram illustrates the order of operations that are tested in the `_testCommon.js`file. Here is a step-by-step explanation of what the diagram is illustrating:

1. **Test Setup `commonBeforeAll`**:

   - The test framework initiates the setup process by calling the `commonBeforeAll` function.
   - The `commonBeforeAll` function sends a query to the database (`DB`) to delete all records from the `companies` table.
   - The `commonBeforeAll` function sends another query to the database to delete all records from the `users` table.
   - The `commonBeforeAll` function sends a query to the database to insert sample data into the `companies` table (with handles `c1`, `c2`, and `c3`).
   - The `commonBeforeAll` function calls the `bcrypt` library to hash the password `password1`.
   - The `bcrypt` library returns the hashed password `password1` to the `commonBeforeAll` function.
   - The `commonBeforeAll` function calls the `bcrypt` library to hash the password `password2`.
   - The `bcrypt` library returns the hashed password `password2` to the `commonBeforeAll` function.
   - The `commonBeforeAll` function sends a query to the database to insert sample data into the `users` table (with usernames `u1` and `u2` and their respective hashed passwords).

2. **Test Initialization `commonBeforeEach`**:

   - Before each test, the test framework calls the `commonBeforeEach` function.
   - The `commonBeforeEach` function sends a query to the database to begin a new transaction.

3. **Test Cleanup `commonAfterEach`**:

   - After each test, the test framework calls the `commonAfterEach` function.
   - The `commonAfterEach` function sends a query to the database to roll back the transaction, ensuring that any changes made during the test are not saved.

4. **Test Teardown `commonAfterAll`**:
   - After all tests have run, the test framework calls the `commonAfterAll` function.
   - The `commonAfterAll` function sends a query to the database to end the connection.

This sequence diagram provides a visual representation of the order of operations that are tested in the `_testCommon.js` file, ensuring that the database is in a consistent state before and after each test.

#### _testCommonjs Code Overview

1. Imports and Setup

- `bcrypt`: Library for hashing passwords.
- `db`: Database connection.
- `BCRYPT_WORK_FACTOR`: Configuration for the bcrypt hashing algorithm.

```javascript
const bcrypt = require("bcrypt");
const db = require("../db.js");
const { BCRYPT_WORK_FACTOR } = require("../config");
```

2. Function: `commonBeforeAll`

This function runs once before all tests. It:

- Deletes all records from the `companies` and `users` tables.
- Inserts sample data into the `companies` table.
- Inserts sample data into the `users` table with hashed passwords.

```javascript
async function commonBeforeAll() {
  // noinspection SqlWithoutWhere
  await db.query("DELETE FROM companies");
  // noinspection SqlWithoutWhere
  await db.query("DELETE FROM users");

  await db.query(`
    INSERT INTO companies(handle, name, num_employees, description, logo_url)
    VALUES ('c1', 'C1', 1, 'Desc1', 'http://c1.img'),
           ('c2', 'C2', 2, 'Desc2', 'http://c2.img'),
           ('c3', 'C3', 3, 'Desc3', 'http://c3.img')`);

  await db.query(
    `
        INSERT INTO users(username,
                          password,
                          first_name,
                          last_name,
                          email)
        VALUES ('u1', $1, 'U1F', 'U1L', 'u1@email.com'),
               ('u2', $2, 'U2F', 'U2L', 'u2@email.com')
        RETURNING username`,
    [
      await bcrypt.hash("password1", BCRYPT_WORK_FACTOR),
      await bcrypt.hash("password2", BCRYPT_WORK_FACTOR),
    ]
  );
}
```

3. Function: `commonBeforeEach`
   This function runs before each test. It starts a new database transaction.

```javascript
async function commonBeforeEach() {
  await db.query("BEGIN");
}
```

4. Function: `commonAfterEach`
   This function runs after each test. It rolls back the database transaction, ensuring that any changes made during the test are not saved.

```javascript
async function commonAfterEach() {
  await db.query("ROLLBACK");
}
```

5. Function: `commonAfterAll`
   This function runs once after all tests. It closes the database connection.

```javascript
async function commonAfterAll() {
  await db.end();
}
```

6. Export the Functions:

```javascript
module.exports = {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
};
```

7. Understanding `beforeEach` and `afterEach`
   In the context of testing, `beforeEach` and `afterEach` are hooks provided by testing frameworks like Jest to run code before and after each test case, respectively.

- `beforeEach`: Runs a specific piece of code before each test case. This is useful for setting up a consistent state before each test.
  - In this file, `commonBeforeEach` starts a new database transaction before each test.
    `afterEach`: Runs a specific piece of code after each test case. This is useful for cleaning up after each test to ensure tests do not affect each other.
  - In this file, `commonAfterEach` rolls back the database transaction after each test.

Running Tests with Coverage and the `-i` Flag
To run the tests with coverage and ensure they run in order (in band), you can use the following command:

```javascript
jest --coverage -i
```

- `--coverage`: Generates a test coverage report, showing which parts of your code are covered by tests.
- `-i` (in band): Ensures that tests run sequentially rather than in parallel. This is useful when tests might interfere with each other if run simultaneously.

### `company.test.js`

The `company.test.js` file contains tests for the `Company` class using the `jest` testing framework. The tests include `creating`, `finding`, `getting`, `updating`, and `deleting` companies.

#### company.test.js sequence diagram

```mermaid
sequenceDiagram
    participant TestSuite
    participant TestEnv as Test Environment
    participant Company
    participant DB as Database

    %% Test environment setup
    TestSuite->>TestEnv: commonBeforeAll()
    TestSuite->>TestEnv: commonBeforeEach()

    %% Test: create()
    TestSuite->>Company: create(newCompany)
    Company->>DB: Check duplicate handle
    DB-->>Company: Duplicate check result
    Company->>DB: Insert company data
    DB-->>Company: Return inserted company details
    Company-->>TestSuite: New company or BadRequestError

    %% Test: findAll()
    TestSuite->>Company: findAll()
    Company->>DB: Query all companies
    DB-->>Company: Return all company records
    Company-->>TestSuite: List of companies

    %% Test: get()
    TestSuite->>Company: get(handle)
    Company->>DB: Query company by handle
    DB-->>Company: Return company record or NotFoundError
    Company-->>TestSuite: Company details

    %% Test: update()
    TestSuite->>Company: update(handle, updateData)
    Company->>DB: Update company record
    DB-->>Company: Return updated company record
    Company-->>TestSuite: Updated company object or NotFoundError/BadRequestError

    %% Test: remove()
    TestSuite->>Company: remove(handle)
    Company->>DB: Delete company by handle
    DB-->>Company: Confirm deletion or NotFoundError
    Company-->>TestSuite: undefined

    %% Test environment teardown
    TestSuite->>TestEnv: commonAfterEach()
    TestSuite->>TestEnv: commonAfterAll()
```

#### Explanation of company.test.js sequence diagram

##### testing `create` method

**Create a Company**:
- The test calls the `create` method with new company data.
- The `Company` class checks for duplicate companies in the database.
- If a duplicate is found, a `BadRequestError` is thrown.
- Otherwise, the new company is inserted into the database, and the new company data is returned to the test.

##### testing `findAll` method
**Find All Companies**:
- The test calls the `findAll` method.
- The `Company` class retrieves all companies from the database and returns them to the test.

##### testing `get` method
**Get a Company**:
- The test calls the `get` method with a company handle.
- The `Company` class retrieves the company data from the database.
- If the company is not found, a `NotFoundError` is thrown.
- Otherwise, the company data is returned to the test.

##### testing `update` method
**Update a Company**:
- The test calls the `update` method with a company handle and data.
- The `Company` class generates the SQL for a partial update and updates the company data in the database.
- If the company is not found, a `NotFoundError` is thrown.
- Otherwise, the updated company data is returned to the test.

##### testing `remove` method
**Remove a Company**:
- The test calls the `remove` method with a company handle.
- The `Company` class deletes the company from the database.
- If the company is not found, a `NotFoundError` is thrown.
- Otherwise, `undefined` is returned to the test.

#### Code Overview

1. Imports and Setup

- `db`: Database connection.
- `BadRequestError`, `NotFoundError`: Custom error classes.
- `Company`: The Company class to be tested.
- `commonBeforeAll`, `commonBeforeEach`, `commonAfterEach`, `commonAfterAll`: Common setup and teardown functions.

```javascript
"use strict";

const db = require("../db.js");
const { BadRequestError, NotFoundError } = require("../expressError");
const Company = require("./company.js");
const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);
```

2. Test Suite: `create`

- Test for Successful Creation:
  - Verifies that a new company can be created and retrieved from the database.
- Test for Duplicate Creation:
  - Verifies that creating a duplicate company throws a `BadRequestError`.

```javascript
describe("create", function () {
  const newCompany = {
    handle: "new",
    name: "New",
    description: "New Description",
    numEmployees: 1,
    logoUrl: "http://new.img",
  };

  test("works", async function () {
    let company = await Company.create(newCompany);
    expect(company).toEqual(newCompany);

    const result = await db.query(
      `SELECT handle, name, description, num_employees, logo_url
           FROM companies
           WHERE handle = 'new'`
    );
    expect(result.rows).toEqual([
      {
        handle: "new",
        name: "New",
        description: "New Description",
        num_employees: 1,
        logo_url: "http://new.img",
      },
    ]);
  });

  test("bad request with dupe", async function () {
    try {
      await Company.create(newCompany);
      await Company.create(newCompany);
      fail();
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });
});
```

3. Test Suite: `findAll`

- Test for Retrieving All Companies
  - Verifies that all companies can be retrieved from the database.

```javascript
describe("findAll", function () {
  test("works: no filter", async function () {
    let companies = await Company.findAll();
    expect(companies).toEqual([
      {
        handle: "c1",
        name: "C1",
        description: "Desc1",
        numEmployees: 1,
        logoUrl: "http://c1.img",
      },
      {
        handle: "c2",
        name: "C2",
        description: "Desc2",
        numEmployees: 2,
        logoUrl: "http://c2.img",
      },
      {
        handle: "c3",
        name: "C3",
        description: "Desc3",
        numEmployees: 3,
        logoUrl: "http://c3.img",
      },
    ]);
  });
});
```

4. Test Suite: `get`

- Test for Retrieving a Company:
  - Verifies that a company can be retrieved by its handle.
- Test for Non-Existent Company:
  - Verifies that retrieving a non-existent company throws a `NotFoundError`.

```javascript
describe("get", function () {
  test("works", async function () {
    let company = await Company.get("c1");
    expect(company).toEqual({
      handle: "c1",
      name: "C1",
      description: "Desc1",
      numEmployees: 1,
      logoUrl: "http://c1.img",
    });
  });

  test("not found if no such company", async function () {
    try {
      await Company.get("nope");
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});
```

5. Test Suite: `update`
   - Test for Successful Update:
     - Verifies that a company's data can be updated.
   - Test for Update with Null Fields:
     - Verifies that a company's data can be updated with null fields.
   - Test for Non-Existent Company:
     - Verifies that updating a non-existent company throws a `NotFoundError`.
   - Test for Update with No Data:
     - Verifies that updating a company with no data throws a `BadRequestError`.

```javascript
describe("update", function () {
  const updateData = {
    name: "New",
    description: "New Description",
    numEmployees: 10,
    logoUrl: "http://new.img",
  };

  test("works", async function () {
    let company = await Company.update("c1", updateData);
    expect(company).toEqual({
      handle: "c1",
      ...updateData,
    });

    const result = await db.query(
      `SELECT handle, name, description, num_employees, logo_url
           FROM companies
           WHERE handle = 'c1'`
    );
    expect(result.rows).toEqual([
      {
        handle: "c1",
        name: "New",
        description: "New Description",
        num_employees: 10,
        logo_url: "http://new.img",
      },
    ]);
  });

  test("works: null fields", async function () {
    const updateDataSetNulls = {
      name: "New",
      description: "New Description",
      numEmployees: null,
      logoUrl: null,
    };

    let company = await Company.update("c1", updateDataSetNulls);
    expect(company).toEqual({
      handle: "c1",
      ...updateDataSetNulls,
    });

    const result = await db.query(
      `SELECT handle, name, description, num_employees, logo_url
           FROM companies
           WHERE handle = 'c1'`
    );
    expect(result.rows).toEqual([
      {
        handle: "c1",
        name: "New",
        description: "New Description",
        num_employees: null,
        logo_url: null,
      },
    ]);
  });

  test("not found if no such company", async function () {
    try {
      await Company.update("nope", updateData);
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });

  test("bad request with no data", async function () {
    try {
      await Company.update("c1", {});
      fail();
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });
});
```

6. Test Suite: `remove`

- Test for Successful Removal:
  - Verifies that a company can be removed from the database.
- Test for Non-Existent Company:
  - Verifies that removing a non-existent company throws a `NotFoundError`.

```javascript
describe("remove", function () {
  test("works", async function () {
    await Company.remove("c1");
    const res = await db.query(
      "SELECT handle FROM companies WHERE handle='c1'"
    );
    expect(res.rows.length).toEqual(0);
  });

  test("not found if no such company", async function () {
    try {
      await Company.remove("nope");
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});
```

7. Understanding `beforeEach` and `afterEach`
   In the context of testing, `beforeEach` and `afterEach` are hooks provided by testing frameworks like Jest to run code before and after each test case, respectively.

- `beforeEach`: Runs a specific piece of code before each test case. This is useful for setting up a consistent state before each test.
  - In this file, `commonBeforeEach` starts a new database transaction before each test.
- `afterEach`: Runs a specific piece of code after each test case. This is useful for cleaning up after each test to ensure tests do not affect each other.
  - In this file, `commonAfterEach` rolls back the database transaction after each test.

8. Running Tests with Coverage and the `-i` Flag
   To run the tests with coverage and ensure they run in order (in band), you can use the following command:

- `--coverage`: Generates a test coverage report, showing which parts of your code are covered by tests.
- `-i` (in band): Ensures that tests run sequentially rather than in parallel. This is useful when tests might interfere with each other if run simultaneously.

```javascript
jest --coverage -i
```

### `user.test.js`

This sequence diagram illustrates the test flow in user.test.js. Each test setup interacts with the test environment (e.g., database setup/teardown) and executes specific User methods. The tests validate outcomes against expected results.

#### user.test.js Diagram

```mermaid
sequenceDiagram
    participant TestSuite
    participant TestEnv as Test Environment
    participant User
    participant DB as Database

    TestSuite->>TestEnv: commonBeforeAll()
    TestSuite->>TestEnv: commonBeforeEach()
    TestSuite->>User: Call User.authenticate()
    User->>DB: Query user by username
    DB-->>User: Return user record
    User-->>TestSuite: User object or UnauthorizedError

    TestSuite->>User: Call User.register()
    User->>DB: Check username duplication
    DB-->>User: Duplicate check result
    User->>DB: Insert new user
    DB-->>User: Return user details
    User-->>TestSuite: User object or BadRequestError

    TestSuite->>User: Call User.findAll()
    User->>DB: Query all users
    DB-->>User: Return all user records
    User-->>TestSuite: List of users

    TestSuite->>User: Call User.get(username)
    User->>DB: Query user by username
    DB-->>User: Return user record
    User-->>TestSuite: User object or NotFoundError

    TestSuite->>User: Call User.update(username, data)
    User->>DB: Update user data
    DB-->>User: Return updated user record
    User-->>TestSuite: Updated user object or NotFoundError

    TestSuite->>User: Call User.remove(username)
    User->>DB: Delete user by username
    DB-->>User: Confirm deletion or NotFoundError
    User-->>TestSuite: undefined

    TestSuite->>TestEnv: commonAfterEach()
    TestSuite->>TestEnv: commonAfterAll()
```

#### Explanation of user.test.js sequence diagram

**Participants**
1. TestSuite: The testing framework or suite that orchestrates and runs the test cases for the User class methods.
2. TestEnv (Test Environment): The setup and teardown utilities that manage the test environment, ensuring a clean state before and after tests are executed.
3. User: The User class containing the core functionality being tested (e.g., user authentication, registration, and data manipulation).
4. DB (Database): Represents the database where user data is stored, queried, and modified during the tests.

**Process Flow**
1. Test Environment Setup
   - TestSuite->>TestEnv: `commonBeforeAll()`
     - The `commonBeforeAll` function initializes the test environment. This includes setting up the database schema, loading initial data, and preparing any other prerequisites needed for the tests.
   - TestSuite->>TestEnv: `commonBeforeEach()`
     - The `commonBeforeEach` function resets the database or environment to a consistent state before each test case. This ensures that tests are independent and do not interfere with one another.

2. Testing User.authenticate()
   - TestSuite->>User: Call User.authenticate()
     - The test suite invokes the `User.authenticate` method with a username and password.
   - User->>DB: Query user by username
     - The `User.authenticate` method queries the database to find the user record matching the provided username.
   - DB-->>User: Return user record
     - The database returns the user record if the username exists.
   - User-->>TestSuite: User object or `UnauthorizedError`
     - If the password matches, the method returns a user object to the test suite. Otherwise, it raises an `UnauthorizedError`.

3. Testing User.register()
- TestSuite->>User: Call `User.register()`
  - The test suite calls the `User.register` method to add a new user to the database.
- User->>DB: Check username duplication
  - The `User.register` method queries the database to ensure that the username is not already in use.
- DB-->>User: Duplicate check result
  - The database responds with the result of the duplication check.
- User->>DB: Insert new user
  - If no duplication is found, the method inserts the new user into the database.
- DB-->>User: Return user details
  - The database returns the details of the newly created user.
- User-->>TestSuite: User object or `BadRequestError`
  - If successful, the method returns the new user object. If the username already exists, it raises a `BadRequestError`.

4. Testing User.findAll()
- TestSuite->>User: Call User.findAll()
  - The test suite invokes the `User.findAll` method to retrieve all users.
- User->>DB: Query all users
  - The method queries the database for all user records.
- DB-->>User: Return all user records
  - The database responds with a list of all user records.
- User-->>TestSuite: List of users
  - The method returns the list of users to the test suite.

5. Testing User.get(username)
- TestSuite->>User: Call User.get(username)
  - The test suite calls the `User.get` method with a username to retrieve a specific user's details.
- User->>DB: Query user by username
  - The method queries the database to find the user record by the provided username.
- DB-->>User: Return user record
  - If the username exists, the database returns the user record.
- User-->>TestSuite: User object or `NotFoundError`
  - If the user is found, the method returns the user object. Otherwise, it raises a `NotFoundError`.

6. Testing User.update(username, data)
- TestSuite->>User: Call User.update(username, data)
  - The test suite calls the User.update method with a username and updated data.
- User->>DB: Update user data
  - The method updates the user record in the database with the new data.
- DB-->>User: Return updated user record
  - The database returns the updated user record.
- User-->>TestSuite: Updated user object or NotFoundError
  - If successful, the method returns the updated user object. If the username does not exist, it raises a NotFoundError.

7. Testing User.remove(username)
- TestSuite->>User: Call User.remove(username)
  - The test suite invokes the User.remove method to delete a user by their username.
- User->>DB: Delete user by username
  - The method deletes the user record from the database.
- DB-->>User: Confirm deletion or NotFoundError
  - If the deletion is successful, the database confirms the action. If the username does not exist, it raises a NotFoundError.
- User-->>TestSuite: undefined
  - The method returns undefined to indicate successful deletion.

8. Test Environment Teardown
- TestSuite->>TestEnv: `commonAfterEach()`
  - The `commonAfterEach` function resets the test environment after each test case, ensuring no lingering effects.
- TestSuite->>TestEnv: `commonAfterAll()`
  - The `commonAfterAll` function performs final cleanup operations, such as closing database connections or deleting temporary files, after all test cases have been executed.

#### user.test.js Code Overview

1. Imports and Setup:
- `db`: Database connection.
- `NotFoundError`, `BadRequestError`, `UnauthorizedError`: Custom error classes.
- `User`: The `User` class to be tested.
- `commonBeforeAll`, `commonBeforeEach`, `commonAfterEach`, `commonAfterAll`: Common setup and teardown functions.
```javascript
"use strict";

const {
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
} = require("../expressError");
const db = require("../db.js");
const User = require("./user.js");
const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);
```

2. Test Suite: `authenticate`
- Test for Successful Authentication:
  - Verifies that a user can be authenticated with the correct username and password.
- Test for Non-Existent User:
  - Verifies that an `UnauthorizedError` is thrown if the user does not exist.
- Test for Incorrect Password:
  - Verifies that an `UnauthorizedError` is thrown if the password is incorrect.
```javascript
describe("authenticate", function () {
  test("works", async function () {
    const user = await User.authenticate("u1", "password1");
    expect(user).toEqual({
      username: "u1",
      firstName: "U1F",
      lastName: "U1L",
      email: "u1@email.com",
      isAdmin: false,
    });
  });

  test("unauth if no such user", async function () {
    try {
      await User.authenticate("nope", "password");
      fail();
    } catch (err) {
      expect(err instanceof UnauthorizedError).toBeTruthy();
    }
  });

  test("unauth if wrong password", async function () {
    try {
      await User.authenticate("u1", "wrong");
      fail();
    } catch (err) {
      expect(err instanceof UnauthorizedError).toBeTruthy();
    }
  });
});
```

3. Test Suite: `register`
- Test for Successful Registration:
  - Verifies that a new user can be registered and retrieved from the database.
- Test for Admin Registration:
  - Verifies that a new admin user can be registered and retrieved from the database.
- Test for Duplicate Registration:
  - Verifies that registering a duplicate user throws a `BadRequestError`.
```javascript
describe("register", function () {
  const newUser = {
    username: "new",
    firstName: "Test",
    lastName: "Tester",
    email: "test@test.com",
    isAdmin: false,
  };

  test("works", async function () {
    let user = await User.register({
      ...newUser,
      password: "password",
    });
    expect(user).toEqual(newUser);
    const found = await db.query("SELECT * FROM users WHERE username = 'new'");
    expect(found.rows.length).toEqual(1);
    expect(found.rows[0].is_admin).toEqual(false);
    expect(found.rows[0].password.startsWith("$2b$")).toEqual(true);
  });

  test("works: adds admin", async function () {
    let user = await User.register({
      ...newUser,
      password: "password",
      isAdmin: true,
    });
    expect(user).toEqual({ ...newUser, isAdmin: true });
    const found = await db.query("SELECT * FROM users WHERE username = 'new'");
    expect(found.rows.length).toEqual(1);
    expect(found.rows[0].is_admin).toEqual(true);
    expect(found.rows[0].password.startsWith("$2b$")).toEqual(true);
  });

  test("bad request with dup data", async function () {
    try {
      await User.register({
        ...newUser,
        password: "password",
      });
      await User.register({
        ...newUser,
        password: "password",
      });
      fail();
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });
});
```

4. Test Suite: `findAll`
- Test for Retrieving All Users:
- Verifies that all users can be retrieved from the database.
```javascript
describe("findAll", function () {
  test("works", async function () {
    const users = await User.findAll();
    expect(users).toEqual([
      {
        username: "u1",
        firstName: "U1F",
        lastName: "U1L",
        email: "u1@email.com",
        isAdmin: false,
      },
      {
        username: "u2",
        firstName: "U2F",
        lastName: "U2L",
        email: "u2@email.com",
        isAdmin: false,
      },
    ]);
  });
});
```

5. Test Suite: `get`
   - Test for Retrieving a User:
     - Verifies that a user can be retrieved by their username.
   - Test for Non-Existent User:
     - Verifies that retrieving a non-existent user throws a NotFoundError.
```javascript
describe("get", function () {
  test("works", async function () {
    let user = await User.get("u1");
    expect(user).toEqual({
      username: "u1",
      firstName: "U1F",
      lastName: "U1L",
      email: "u1@email.com",
      isAdmin: false,
    });
  });

  test("not found if no such user", async function () {
    try {
      await User.get("nope");
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});
```

6. Test Suite: `update`
- Test for Successful Update:
  - Verifies that a user's data can be updated.
- Test for Updating Password:
  - Verifies that a user's password can be updated.
- Test for Non-Existent User:
  - Verifies that updating a non-existent user throws a `NotFoundError`.
- Test for Update with No Data:
  - Verifies that updating a user with no data throws a `BadRequestError`.
```javascript
describe("update", function () {
  const updateData = {
    firstName: "NewF",
    lastName: "NewF",
    email: "new@email.com",
    isAdmin: true,
  };

  test("works", async function () {
    let job = await User.update("u1", updateData);
    expect(job).toEqual({
      username: "u1",
      ...updateData,
    });
  });

  test("works: set password", async function () {
    let job = await User.update("u1", {
      password: "new",
    });
    expect(job).toEqual({
      username: "u1",
      firstName: "U1F",
      lastName: "U1L",
      email: "u1@email.com",
      isAdmin: false,
    });
    const found = await db.query("SELECT * FROM users WHERE username = 'u1'");
    expect(found.rows.length).toEqual(1);
    expect(found.rows[0].password.startsWith("$2b$")).toEqual(true);
  });

  test("not found if no such user", async function () {
    try {
      await User.update("nope", {
        firstName: "test",
      });
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });

  test("bad request if no data", async function () {
    expect.assertions(1);
    try {
      await User.update("c1", {});
      fail();
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });
});
```

7. Test Suite: `remove`
- Test for Successful Removal:
  - Verifies that a user can be removed from the database.
- Test for Non-Existent User:
  - Verifies that removing a non-existent user throws a `NotFoundError`.
```javascript
describe("remove", function () {
  test("works", async function () {
    await User.remove("u1");
    const res = await db.query(
        "SELECT * FROM users WHERE username='u1'");
    expect(res.rows.length).toEqual(0);
  });

  test("not found if no such user", async function () {
    try {
      await User.remove("nope");
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});
```

8. Understanding `beforeEach` and `afterEach`
In the context of testing, `beforeEach` and `afterEach` are hooks provided by testing frameworks like Jest to run code before and after each test case, respectively.

- `beforeEach`: Runs a specific piece of code before each test case. This is useful for setting up a consistent state before each test.
  - In this file, `commonBeforeEach` starts a new database transaction before each test.
- `afterEach`: Runs a specific piece of code after each test case. This is useful for cleaning up after each test to ensure tests do not affect each other.
  - In this file, `commonAfterEach` rolls back the database transaction after each test.

9. Running Tests with Coverage and the `-i` Flag
To run the tests with coverage and ensure they run in order (in band), you can use the following command:
```javascript
jest --coverage -i
```
- `--coverage`: Generates a test coverage report, showing which parts of your code are covered by tests.
- `-i` (in band): Ensures that tests run sequentially rather than in parallel. This is useful when tests might interfere with each other if run simultaneously.

## Scripts

### `company.js`

The `company.js` file contains the `Company` class, which provides methods for interacting with the companies table in the database. The methods include `creating`, `finding`, `getting`, `updating`, and `deleting` companies.

#### company.js sequence diagram with explanation

##### `create` method diagram

**Create a Company**:

- The client calls the `create` method with company data.
- The `Company` class checks for duplicate companies in the database.
- If a duplicate is found, a `BadRequestError` is thrown.
- Otherwise, the new company is inserted into the database, and the new company data is returned to the client.

```mermaid
sequenceDiagram
    participant Client
    participant Company
    participant DB

    Client->>Company: Call create({ handle, name, description, numEmployees, logoUrl })
    Company->>DB: SELECT handle FROM companies WHERE handle = $1
    DB->>Company: Return result
    alt Duplicate company
        Company->>Client: Throw BadRequestError
    else
        Company->>DB: INSERT INTO companies (handle, name, description, num_employees, logo_url) VALUES ($1, $2, $3, $4, $5)
        DB->>Company: Return new company data
        Company->>Client: Return new company
    end
```

##### `findAll` method diagram

**Find All Companies**:

- The client calls the `findAll` method.
- The `Company` class retrieves all companies from the database and returns them to the client.

```mermaid
sequenceDiagram
participant Client
participant Company
participant DB
    Client->>Company: Call findAll()
    Company->>DB: SELECT handle, name, description, num_employees AS "numEmployees", logo_url AS "logoUrl" FROM companies ORDER BY name
    DB->>Company: Return all companies
    Company->>Client: Return all companies
```

##### `get` method diagram

**Find All Companies**:

- The client calls the `get` method.
- The `Company` class retrieves all companies from the database and returns them to the client.

```mermaid
sequenceDiagram
participant Client
participant Company
participant DB
    Client->>Company: Call get(handle)
    Company->>DB: SELECT handle, name, description, num_employees AS "numEmployees", logo_url AS "logoUrl" FROM companies WHERE handle = $1
    DB->>Company: Return company data
    alt Company not found
        Company->>Client: Throw NotFoundError
    else
        Company->>Client: Return company
    end
```

##### `update` method diagram

**Update a Company**:

- The client calls the `update` method with a company handle and data.
- The `Company` class generates the SQL for a partial update and updates the company data in the database.
- If the company is not found, a `NotFoundError` is thrown.
- Otherwise, the updated company data is returned to the client.

```mermaid
sequenceDiagram
participant Client
participant Company
participant DB
    Client->>Company: Call update(handle, data)
    Company->>Company: Call sqlForPartialUpdate(data, { numEmployees: "num_employees", logoUrl: "logo_url" })
    Company->>DB: UPDATE companies SET ... WHERE handle = $1 RETURNING handle, name, description, num_employees AS "numEmployees", logo_url AS "logoUrl"
    DB->>Company: Return updated company data
    alt Company not found
        Company->>Client: Throw NotFoundError
    else
        Company->>Client: Return updated company
    end
```

##### `remove` method diagram

**Remove a Company**:

- The client calls the `remove` method with a company handle.
- The `Company` class deletes the company from the database.
- If the company is not found, a `NotFoundError` is thrown.
- Otherwise, `undefined` is returned to the client.

```mermaid
sequenceDiagram
participant Client
participant Company
participant DB
    Client->>Company: Call remove(handle)
    Company->>DB: DELETE FROM companies WHERE handle = $1 RETURNING handle
    DB->>Company: Return deleted company handle
    alt Company not found
        Company->>Client: Throw NotFoundError
    else
        Company->>Client: Return undefined
    end
```

#### Explanation of `company.js`

1. Imports and Setup:

- `db`: Database connection.
- `BadRequestError`, `NotFoundError`: Custom error classes.
- `sqlForPartialUpdate`: Helper function for generating SQL for partial updates.

```javascript
"use strict";

const db = require("../db");
const { BadRequestError, NotFoundError } = require("../expressError");
const { sqlForPartialUpdate } = require("../helpers/sql");
```

2. Class: `Company`
   - Method: `create`
     - Creates a new company in the database.
     - Throws `BadRequestError` if the company already exists.

```javascript
static async create({ handle, name, description, numEmployees, logoUrl }) {
  const duplicateCheck = await db.query(
        `SELECT handle
         FROM companies
         WHERE handle = $1`,
      [handle]);

  if (duplicateCheck.rows[0])
    throw new BadRequestError(`Duplicate company: ${handle}`);

  const result = await db.query(
        `INSERT INTO companies
         (handle, name, description, num_employees, logo_url)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING handle, name, description, num_employees AS "numEmployees", logo_url AS "logoUrl"`,
      [
        handle,
        name,
        description,
        numEmployees,
        logoUrl,
      ],
  );
  const company = result.rows[0];

  return company;
}
```

2. Class: `Company`
   - Method: `findAll`
     - Retrieves all companies from the database.

```javascript
static async findAll() {
  const companiesRes = await db.query(
        `SELECT handle,
                name,
                description,
                num_employees AS "numEmployees",
                logo_url AS "logoUrl"
         FROM companies
         ORDER BY name`);
  return companiesRes.rows;
}
```

2. Class: `Company`
   - Method: `get`
     - Retrieves a company by its handle.
     - Throws `NotFoundError` if the company does not exist.

```javascript
static async get(handle) {
  const companyRes = await db.query(
        `SELECT handle,
                name,
                description,
                num_employees AS "numEmployees",
                logo_url AS "logoUrl"
         FROM companies
         WHERE handle = $1`,
      [handle]);

  const company = companyRes.rows[0];

  if (!company) throw new NotFoundError(`No company: ${handle}`);

  return company;
}
```

2. Class: `Company`
   - Method: `get`
     - Updates a company's data.
     - Throws `NotFoundError` if the company does not exist.

```javascript
static async update(handle, data) {
  const { setCols, values } = sqlForPartialUpdate(
      data,
      {
        numEmployees: "num_employees",
        logoUrl: "logo_url",
      });
  const handleVarIdx = "$" + (values.length + 1);

  const querySql = `UPDATE companies
                    SET ${setCols}
                    WHERE handle = ${handleVarIdx}
                    RETURNING handle,
                              name,
                              description,
                              num_employees AS "numEmployees",
                              logo_url AS "logoUrl"`;
  const result = await db.query(querySql, [...values, handle]);
  const company = result.rows[0];

  if (!company) throw new NotFoundError(`No company: ${handle}`);

  return company;
}
```

2. Class: `Company`
   - Method: `remove`
     - Deletes a company from the database.
     - Throws `NotFoundError` if the company does not exist.

```javascript
static async remove(handle) {
  const result = await db.query(
        `DELETE
         FROM companies
         WHERE handle = $1
         RETURNING handle`,
      [handle]);
  const company = result.rows[0];

  if (!company) throw new NotFoundError(`No company: ${handle}`);
}
```

3. Export the Class

```javascript
module.exports = Company;
```

### `user.js`

This file contains the `User` class, which provides methods for interacting with the `users` table in the database.

#### user.js Explanation

This sequence diagram shows how the User class functions are executed and interact with external dependencies (e.g., db, bcrypt, and helper utilities). Each function represents a specific user-related operation, like authentication, registration, or updating user details.

#### user.js Diagram

```mermaid
sequenceDiagram
    participant Client
    participant User
    participant DB as Database
    participant BCrypt as Bcrypt
    participant SQLHelper as SQL Helper

    Client->>User: authenticate(username, password)
    User->>DB: Query user by username
    DB-->>User: Return user record
    User->>BCrypt: Compare password hash
    BCrypt-->>User: Password match result
    User-->>Client: User object or UnauthorizedError

    Client->>User: register(userData)
    User->>DB: Check username duplication
    DB-->>User: Duplicate check result
    User->>BCrypt: Hash password
    BCrypt-->>User: Return hashed password
    User->>DB: Insert user record
    DB-->>User: Return user details
    User-->>Client: User object or BadRequestError

    Client->>User: findAll()
    User->>DB: Query all users
    DB-->>User: Return user records
    User-->>Client: List of users

    Client->>User: get(username)
    User->>DB: Query user by username
    DB-->>User: Return user record or NotFoundError
    User-->>Client: User details

    Client->>User: update(username, data)
    User->>BCrypt: Hash password (if included)
    BCrypt-->>User: Return hashed password
    User->>SQLHelper: Generate SQL for partial update
    User->>DB: Update user data
    DB-->>User: Return updated user details
    User-->>Client: Updated user object or NotFoundError

    Client->>User: remove(username)
    User->>DB: Delete user by username
    DB-->>User: Confirm deletion or NotFoundError
    User-->>Client: undefined

```

#### company.test.js Code Overview

This file contains the `User` class, which provides methods for interacting with the `users` table in the database.

1. Imports and Setup:

- `db`: Database connection.
- `bcrypt`: Library for hashing passwords.
- `sqlForPartialUpdate`: Helper function for generating SQL for partial updates.
- `NotFoundError`, `BadRequestError`, `UnauthorizedError`: Custom error classes.
- `BCRYPT_WORK_FACTOR`: Configuration for the bcrypt hashing algorithm.

```javascript
"use strict";

const db = require("../db");
const bcrypt = require("bcrypt");
const { sqlForPartialUpdate } = require("../helpers/sql");
const {
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
} = require("../expressError");

const { BCRYPT_WORK_FACTOR } = require("../config.js");
```

2. Class: `User`
   - Method: `authenticate`
     - Authenticates a user with a username and password.
     - Throws `UnauthorizedError` if the user is not found or the password is incorrect.

```javascript
static async authenticate(username, password) {
  const result = await db.query(
        `SELECT username,
                password,
                first_name AS "firstName",
                last_name AS "lastName",
                email,
                is_admin AS "isAdmin"
         FROM users
         WHERE username = $1`,
      [username],
  );

  const user = result.rows[0];

  if (user) {
    const isValid = await bcrypt.compare(password, user.password);
    if (isValid === true) {
      delete user.password;
      return user;
    }
  }

  throw new UnauthorizedError("Invalid username/password");
}
```

3. Class: `User`
   - Method: `register`
     - Registers a new user with the provided data.
     - Throws `BadRequestError` if the username already exists.

```javascript
static async register({ username, password, firstName, lastName, email, isAdmin }) {
  const duplicateCheck = await db.query(
        `SELECT username
         FROM users
         WHERE username = $1`,
      [username],
  );

  if (duplicateCheck.rows[0]) {
    throw new BadRequestError(`Duplicate username: ${username}`);
  }

  const hashedPassword = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);

  const result = await db.query(
        `INSERT INTO users
         (username,
          password,
          first_name,
          last_name,
          email,
          is_admin)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING username, first_name AS "firstName", last_name AS "lastName", email, is_admin AS "isAdmin"`,
      [
        username,
        hashedPassword,
        firstName,
        lastName,
        email,
        isAdmin,
      ],
  );

  const user = result.rows[0];

  return user;
}
```

4. Class: `User`
   - Method: `findAll`
     - Retrieves all users from the database.

```javascript
static async findAll() {
  const result = await db.query(
        `SELECT username,
                first_name AS "firstName",
                last_name AS "lastName",
                email,
                is_admin AS "isAdmin"
         FROM users
         ORDER BY username`,
  );

  return result.rows;
}
```

5. Class: `User`
   - Method: `get`
     - Retrieves a user by their username.
     - Throws `NotFoundError` if the user does not exist.

```javascript
static async get(username) {
  const userRes = await db.query(
        `SELECT username,
                first_name AS "firstName",
                last_name AS "lastName",
                email,
                is_admin AS "isAdmin"
         FROM users
         WHERE username = $1`,
      [username],
  );

  const user = userRes.rows[0];

  if (!user) throw new NotFoundError(`No user: ${username}`);

  return user;
}
```

6. Class: `User`
   - Method: `update`
     - Updates a user's data.
     - Throws `NotFoundError` if the user does not exist.

```javascript
static async update(username, data) {
  if (data.password) {
    data.password = await bcrypt.hash(data.password, BCRYPT_WORK_FACTOR);
  }

  const { setCols, values } = sqlForPartialUpdate(
      data,
      {
        firstName: "first_name",
        lastName: "last_name",
        isAdmin: "is_admin",
      });
  const usernameVarIdx = "$" + (values.length + 1);

  const querySql = `UPDATE users
                    SET ${setCols}
                    WHERE username = ${usernameVarIdx}
                    RETURNING username,
                              first_name AS "firstName",
                              last_name AS "lastName",
                              email,
                              is_admin AS "isAdmin"`;
  const result = await db.query(querySql, [...values, username]);
  const user = result.rows[0];

  if (!user) throw new NotFoundError(`No user: ${username}`);

  delete user.password;
  return user;
}
```

7. Class: `User`
   - Method: `remove`
     - Deletes a user from the database.
     - Throws `NotFoundError` if the user does not exist.

```javascript
static async remove(username) {
  let result = await db.query(
        `DELETE
         FROM users
         WHERE username = $1
         RETURNING username`,
      [username],
  );
  const user = result.rows[0];

  if (!user) throw new NotFoundError(`No user: ${username}`);
}
```

8. Export the Class:

```javascript
module.exports = User;
```
