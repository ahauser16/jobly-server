# `routes` folder file notes/explanations/diagrams

Postman workspace located here: `https://winter-shadow-436327.postman.co/workspace/New-Team-Workspace~6f9d5494-beb9-4808-bfe5-ae04abd3e5e0/request/11268906-f9793f48-b6e2-49a2-a7eb-d5759b0e9726?action=share&creator=11268906&ctx=documentation`

## Table of Contents

- [routes folder file notes/explanations/diagrams](#routes-folder-file-notesexplanationsdiagrams)
  - [Postman Notes](#postman-notes)
    - [Registeration of New User](#registeration-of-new-user)
    - [Authentication of Registered User](#authentication-of-registered-user)
    - [User-Add New User-Request Sent By Admin](#user-add-new-user-request-sent-by-admin)
    - [User-Retrieve All Users](#user-retrieve-all-users)
    - [User-Retrieve User By Username](#user-retrieve-user-by-username)
    - [User-Update User Data By Username](#user-update-user-data-by-username)
    - [User-Delete User Data By Username](#user-delete-user-data-by-username)
    - [Company-Add New](#company-add-new)
    - [Company-Retrieve All Companies](#company-retrieve-all-companies)
    - [Company-Retrieve Company By Handle](#company-retrieve-company-by-handle)
    - [Company-Update Company Data By Handle](#company-update-company-data-by-handle)
    - [Company-Delete Company By Handle](#delete-company-by-company-handle)
  - [Tests](#tests)
  - [\_testCommon.js](#_testcommonjs)
    - [\_testCommon.js diagram](#_testcommonjs-diagram)
    - [\_testCommon.js diagram explanation](#_testcommonjs-diagram-explanation)
    - [\_testCommon.js code overview](#_testcommonjs-code-overview)
  - [auth.test.js](#authtestjs)
    - [auth.test.js sequence diagram](#authtestjs-sequence-diagram)
    - [auth.test.js diagram explanation](#authtestjs-diagram-explanation)
    - [auth.test.js code overview](#authtestjs-code-overview)
  - [companies.test.js](#companiestestjs)
    - [companies.test.js diagram](#companiestestjs-diagram)
    - [companies.test.js diagram explanation](#companiestestjs-diagram-explanation)
    - [companies.test.js code overview](#companiestestjs-code-overview)
  - [users.test.js](#userstestjs)
    - [users.test.js diagram](#userstestjs-diagram)
    - [users.test.js diagram explanation](#userstestjs-diagram-explanation)
    - [users.test.js Code Overview](#userstestjs-code-overview)
  - [Scripts](#scripts)
  - [auth.js](#authjs)
    - [auth.js sequence diagram](#authjs-sequence-diagram)
    - [auth.js diagram explanation](#authjs-diagram-explanation)
    - [auth.js Code Overview](#authjs-code-overview)
  - [companies.js](#companiesjs)
    - [companies.js sequence diagram](#companiesjs-sequence-diagram)
    - [companies.js diagram explanation](#companiesjs-diagram-explanation)
    - [companies.js Code Overview](#companiesjs-code-overview)
  - [users.js](#usersjs)
    - [users.js sequence diagram](#usersjs-sequence-diagram)
    - [users.js diagram explanation](#usersjs-diagram-explanation)
    - [users.js code overview](#usersjs-code-overview)

### Tests

### Postman Notes

The `jobly` database has the test user account `username: newuser5000` with `password: password123abc` which was created to test the `http://localhost:3001/auth/register` route that (1) registers a new user and (2) returns a JWT token and then used to test the `http://localhost:3001/auth/token` route that (1) authenticates a registered user and (2) returns a JWT token. The full json body of each Postman request that initially registered and authenticated "newuser5000" as well as the token created during registeration and authentication.

[Back to TOC](#routes-folder-file-notesexplanationsdiagrams)

#### Registeration of New User
`POST /auth/register:   { user } => { token }`
- user must include { username, password, firstName, lastName, email }
- Returns JWT token which can be used to authenticate further requests.
- Authorization required: none

json body associated with Postman request: `http://localhost:3001/auth/register`
```json
{
  "username": "newuser5000",
  "password": "password123abc",
  "firstName": "John",
  "lastName": "Doe",
  "email": "jdoe@example.com"
}
```

json token generated from Postman request: `http://localhost:3001/auth/register`

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im5ld3VzZXI1MDAwIiwiaXNBZG1pbiI6ZmFsc2UsImlhdCI6MTczMjY0MDYwMX0.1dWhBf67W-Co7zvlIUcfqnPPJYjJOnk7y-NC7oloBls"
}
```

[Back to TOC](#routes-folder-file-notesexplanationsdiagrams)

#### Authentication of Registered User
`POST /auth/token:  { username, password } => { token }`
- Returns JWT token which can be used to authenticate further requests.
- Authorization required: none

json body associated with Postman request: `http://localhost:3001/auth/token`
```json
{
  "username": "newuser5000",
  "password": "password123abc"
}
```

json token generated from Postman request: `http://localhost:3001/auth/token`
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im5ld3VzZXI1MDAwIiwiaXNBZG1pbiI6ZmFsc2UsImlhdCI6MTczMjY0MDkzMn0.WK6UEUWQshznsM9s_f5Q5Nk9pXyiXqikC71nZp_RW9c"
}
```

[Back to TOC](#routes-folder-file-notesexplanationsdiagrams)

#### User-Add New User-Request Sent By Admin

`POST / { user }  => { user, token }`

- Authorization required: login
- Adds a new user, however, this is not the registration endpoint. Instead, this route is only for admin users to add new users. The new user being added can be an admin. This returns the newly created user and an authentication token (see below).

example of json body:

```json
{
  "username": "newuser7000",
  "password": "newpassword123abc",
  "firstName": "Jane",
  "lastName": "Doe",
  "email": "janedoe@example.com",
  "isAdmin": true
}
```

example of json response

```json
{
  "user": {
    "username": "newuser7000",
    "firstName": "Jane",
    "lastName": "Doe",
    "email": "janedoe@example.com",
    "isAdmin": true
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im5ld3VzZXI3MDAwIiwiaXNBZG1pbiI6dHJ1ZSwiaWF0IjoxNzMyNjY0NDA0fQ.l78XK8H9jxoQ_oAu5-0jlHiAYtS6tfTtx0BzYXSmgRE"
}
```

[Back to TOC](#routes-folder-file-notesexplanationsdiagrams)

#### User-Retrieve All Users
`GET / => { users: [ {username, firstName, lastName, email }, ... ] }`
- Returns list of all users.
- Authorization required: login

I successfully sent a GET request to the `http://localhost:3001/users` route using the same `Authorization` header value that I used for the registeration and authorization Postman requests since this route requires the user to be logged in.  An example of the json response is below.

json response example:
```json
{
    "users": [
        {
            "username": "newuser",
            "firstName": "New",
            "lastName": "User",
            "email": "newuser@example.com",
            "isAdmin": false
        },
        {
            "username": "newuser5000",
            "firstName": "John",
            "lastName": "Doe",
            "email": "jdoe@example.com",
            "isAdmin": false
        },
        {
            "username": "newuser7000",
            "firstName": "Jane",
            "lastName": "Doe",
            "email": "janedoe@example.com",
            "isAdmin": true
        },
        {
            "username": "testadmin",
            "firstName": "Test",
            "lastName": "Admin!",
            "email": "joel@joelburton.com",
            "isAdmin": true
        },
        {
            "username": "testuser",
            "firstName": "Test",
            "lastName": "User",
            "email": "joel@joelburton.com",
            "isAdmin": false
        }
    ]
}
```

[Back to TOC](#routes-folder-file-notesexplanationsdiagrams)

#### User-Retrieve User By Username
`GET /[username] => { user }`
 - Returns `{ username, firstName, lastName, isAdmin }`
 - Authorization required: login

I successfully made a Postman GET request to `http://localhost:3001/users` that queried the dataset for the user name "newuser5000" and the final query URL is: `http://localhost:3001/users/newuser5000`.  I used the same `Authorization` header value that I used for the registeration and authorization Postman requests since this route requires the user to be logged in.  An example of the json response is below.

example of response:
```json
{
    "user": {
        "username": "newuser5000",
        "firstName": "John",
        "lastName": "Doe",
        "email": "jdoe@example.com",
        "isAdmin": false
    }
}
```
[Back to TOC](#routes-folder-file-notesexplanationsdiagrams)

#### User-Update User Data By Username
`PATCH /[username] { user } => { user }`
- Data can include: `{ firstName, lastName, password, email }`
- Returns `{ username, firstName, lastName, email, isAdmin }`
- Authorization required: login
 
I successfully made a Postman PATCH request to `http://localhost:3001/users` that queried the dataset for the user name "newuser5000", updated that user's `firstName`, `lastName` and `email` and so the final query URL is: `http://localhost:3001/users/newuser5000`.  I used the same `Authorization` header value that I used for the registeration and authorization Postman requests since this route requires the user to be logged in.  An example of the json body for the request and the response is below.

example of json body for the request:
```json
{
    "firstName": "UpdatedFirstName",
    "lastName": "UpdatedLastName",
    "email": "updated@example.com"
}
```

example of json response:
```json
{
    "user": {
        "username": "newuser5000",
        "firstName": "UpdatedFirstName",
        "lastName": "UpdatedLastName",
        "email": "updated@example.com",
        "isAdmin": false
    }
}
```

[Back to TOC](#routes-folder-file-notesexplanationsdiagrams)
---
#### User-Delete User Data By Username
`DELETE /[username]  =>  { deleted: username }`
- Authorization required: login
I successfully made a Postman DELETE request to `http://localhost:3001/users` that queried the dataset for the user name "newuser7000", deleted that user and so the final query URL is: `http://localhost:3001/users/newuser7000`.  I used the same `Authorization` header value that I used for the registeration and authorization Postman requests since this route requires the user to be logged in.  An example of the  response is below.

example of body of request:
```json
{
    "deleted": "newuser7000"
}
```
[Back to TOC](#routes-folder-file-notesexplanationsdiagrams)


---
#### Company-Add New
`POST / { company } =>  { company }`
- company should be `{ handle, name, description, numEmployees, logoUrl }`
- Returns `{ handle, name, description, numEmployees, logoUrl }`
- Authorization required: login

I successfully sent a POST request to the `http://localhost:3001/companies` route using the same `Authorization` value that I used for the registeration and authorization Postman requests since this route requires the user to be logged in. The json body and json response is below with the test company information. Keep in mind this "exampleco" is the default company handle to delete in the DELETE Company By Handle route [below](#delete-company-by-company-handle)

json body associated with Postman request: `http://localhost:3001/companies`

```json
{
  "handle": "exampleco",
  "name": "Example Company",
  "description": "This is an example company.",
  "numEmployees": 100,
  "logoUrl": "http://example.com/logo.png"
}
```

json token generated from Postman request: `http://localhost:3001/auth/token`

```json
{
  "company": {
    "handle": "exampleco",
    "name": "Example Company",
    "description": "This is an example company.",
    "numEmployees": 100,
    "logoUrl": "http://example.com/logo.png"
  }
}
```

[Back to TOC](#routes-folder-file-notesexplanationsdiagrams)

#### Company-Retrieve All Companies
`GET / => { companies: [ { handle, name, description, numEmployees, logoUrl }, ...] }`
- Can filter on provided search filters:
  - `minEmployees`
  - `maxEmployees`
  - `nameLike` (will find case-insensitive, partial matches)
- Authorization required: none
 
I successfully sent a GET request to the `http://localhost:3001/companies` route and added logic to the `companies.js` route and `company.js` model that allows filtering using the `minEMployees`, `nameLike` and `maxEmployees` params in Postman. The following example queries the API dataset for a company's name that contains the term "hall" and has between 700 and 750 employees `http://localhost:3001/companies?minEmployees=700&nameLike=hall&maxEmployees=750`. The user was not required to be logged in to make this request.

[Back to TOC](#routes-folder-file-notesexplanationsdiagrams)

#### Company-Retrieve Company By Handle
`GET /[handle]  =>  { company }`
- Company is `{ handle, name, description, numEmployees, logoUrl, jobs }` where jobs is `[{ id, title, salary, equity }, ...]`
- Authorization required: none

I successfully sent a GET request to the `http://localhost:3001/companies` route to search for a company with the `handle` value of "hall-davis" so the complete URL of the request is `http://localhost:3001/companies/hall-davis`. An example of the json response is below. The user was not required to be logged in to make this request.

example response from GET request

```json
{
  "company": {
    "handle": "hall-davis",
    "name": "Hall-Davis",
    "description": "Adult go economic off into. Suddenly happy according only common. Father plant wrong free traditional.",
    "numEmployees": 749,
    "logoUrl": "/logos/logo2.png"
  }
}
```

example response from DELETE request

```json
{
  "deleted": "exampleco"
}
```

[Back to TOC](#routes-folder-file-notesexplanationsdiagrams)

#### Company-Update Company Data By Handle
`PATCH /[handle] { fld1, fld2, ... } => { company }`
- Patches company data.
- fields can be: `{ name, description, numEmployees, logo_url }`
- Returns `{ handle, name, description, numEmployees, logo_url }`
- Authorization required: login

I successfully sent a PATCH request to the `http://localhost:3001/companies` route to update the company with the `handle` value of "hall-davis" so the complete URL of the request is `http://localhost:3001/companies/hall-davis`. The request included the `json` body below and required the user to be logged in so I used the same token value as the initial registration/authentication of the user below. An example of the json response is below.

**`Content-Type`**: `application/json`
**`Authentication` header value**: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im5ld3VzZXI1MDAwIiwiaXNBZG1pbiI6ZmFsc2UsImlhdCI6MTczMjY0MDkzMn0.WK6UEUWQshznsM9s_f5Q5Nk9pXyiXqikC71nZp_RW9c`

**example response from request**

```json
{
  "company": {
    "handle": "hall-davis",
    "name": "hall-davis Updated",
    "description": "Updated description for the company.",
    "numEmployees": 200,
    "logoUrl": "http://example.com/newlogo.png"
  }
}
```

[Back to TOC](#routes-folder-file-notesexplanationsdiagrams)

#### Company-Delete Company By Handle
`DELETE /[handle]  =>  { deleted: handle }`
- Authorization: login
I successfully sent a DELETE request to the `http://localhost:3001/companies` route to delete the company with the `handle` value of "exampleco" so the complete URL of the request is `http://localhost:3001/companies/exampleco`. The request required the user to be logged in so I used the same token value as the initial registration/authentication of the user below. An example of the json response is below.

example of company response:

```json
{
  "deleted": "exampleco"
}
```

[Back to TOC](#routes-folder-file-notesexplanationsdiagrams)

### \_testCommon.js

This file contains common setup and teardown functions for tests in the routes folder. These functions help ensure that the database is in a consistent state before and after each test.

[Back to TOC](#routes-folder-file-notesexplanationsdiagrams)

#### \_testCommon.js diagram

```mermaid
sequenceDiagram
    participant Test
    participant DB
    participant Company
    participant User
    participant Token as createToken

    Test->>DB: commonBeforeAll() -> DELETE FROM users
    Test->>DB: commonBeforeAll() -> DELETE FROM companies

    Test->>Company: commonBeforeAll() -> Company.create({ handle: "c1", ... })
    Company->>DB: INSERT INTO companies (c1)
    DB-->>Company: Return inserted company details

    Test->>Company: commonBeforeAll() -> Company.create({ handle: "c2", ... })
    Company->>DB: INSERT INTO companies (c2)
    DB-->>Company: Return inserted company details

    Test->>Company: commonBeforeAll() -> Company.create({ handle: "c3", ... })
    Company->>DB: INSERT INTO companies (c3)
    DB-->>Company: Return inserted company details

    Test->>User: commonBeforeAll() -> User.register({ username: "u1", ... })
    User->>DB: INSERT INTO users (u1)
    DB-->>User: Return inserted user details

    Test->>User: commonBeforeAll() -> User.register({ username: "u2", ... })
    User->>DB: INSERT INTO users (u2)
    DB-->>User: Return inserted user details

    Test->>User: commonBeforeAll() -> User.register({ username: "u3", ... })
    User->>DB: INSERT INTO users (u3)
    DB-->>User: Return inserted user details

    Test->>DB: commonBeforeEach() -> BEGIN transaction

    Test->>DB: commonAfterEach() -> ROLLBACK transaction

    Test->>DB: commonAfterAll() -> Close connection

    Test->>Token: createToken({ username: "u1", isAdmin: false })
    Token-->>Test: Return token

    Note right of Test: Export functions and token
```

[Back to TOC](#routes-folder-file-notesexplanationsdiagrams)

#### \_testCommon.js diagram explanation

1. Test Setup (`commonBeforeAll`):

- The test framework initiates the setup process by calling the `commonBeforeAll` function.
- The `commonBeforeAll` function sends a query to the database (`DB`) to delete all records from the `users` table.
- The `commonBeforeAll` function sends another query to the database to delete all records from the `companies` table.
- The `commonBeforeAll` function calls the Company.create method three times to insert sample data into the `companies` table with handles `c1`, `c2`, and `c3`.
- The `commonBeforeAll` function calls the User.register method three times to insert sample data into the `users` table with usernames `u1`, `u2`, and `u3`.

2. Test Initialization (`commonBeforeEach`):

- Before each test, the test framework calls the `commonBeforeEach` function.
- The `commonBeforeEach` function sends a query to the database to begin a new transaction.

3. Test Cleanup (`commonAfterEach`):

- After each test, the test framework calls the `commonAfterEach` function.
- The `commonAfterEach` function sends a query to the database to roll back the transaction, ensuring that any changes made during the test are not saved.

4. Test Teardown (`commonAfterAll`):

- After all tests have run, the test framework calls the `commonAfterAll` function.
- The `commonAfterAll` function sends a query to the database to close the connection.

5. Token Creation:

- The `createToken` function is called to create a JWT token for user `u1`.
- The token is returned and stored in the `u1Token` variable.

6. Export Functions and Token:

The `commonBeforeAll`, `commonBeforeEach`, `commonAfterEach`, `commonAfterAll` functions and the `u1Token` are exported for use in other test files.

[Back to TOC](#routes-folder-file-notesexplanationsdiagrams)

#### \_testCommonjs code overview

1. Imports and Setup:

- `DB`: Database connection.
- `User`: The `User` model for interacting with the `users` table.
- `Company`: The `Company` model for interacting with the `companies` table.
- `createToken`: Function to create JSON Web Tokens (JWT).

```javascript
"use strict";

const `DB` = require("../`DB`.js");
const User = require("../models/user");
const Company = require("../models/company");
const { createToken } = require("../helpers/tokens");
```

2. Function: `commonBeforeAll`

- This function runs once before all tests. It:
  - Deletes all records from the `users` and `companies` tables.
  - Inserts sample data into the `companies` table.
  - Registers sample users with hashed passwords.

```javascript
async function `commonBeforeAll`() {
  // noinspection SqlWithoutWhere
  await `DB`.query("DELETE FROM users");
  // noinspection SqlWithoutWhere
  await `DB`.query("DELETE FROM companies");

  await Company.create(
      {
        handle: "c1",
        name: "C1",
        numEmployees: 1,
        description: "Desc1",
        logoUrl: "http://c1.img",
      });
  await Company.create(
      {
        handle: "c2",
        name: "C2",
        numEmployees: 2,
        description: "Desc2",
        logoUrl: "http://c2.img",
      });
  await Company.create(
      {
        handle: "c3",
        name: "C3",
        numEmployees: 3,
        description: "Desc3",
        logoUrl: "http://c3.img",
      });

  await User.register({
    username: "u1",
    firstName: "U1F",
    lastName: "U1L",
    email: "user1@user.com",
    password: "password1",
    isAdmin: false,
  });
  await User.register({
    username: "u2",
    firstName: "U2F",
    lastName: "U2L",
    email: "user2@user.com",
    password: "password2",
    isAdmin: false,
  });
  await User.register({
    username: "u3",
    firstName: "U3F",
    lastName: "U3L",
    email: "user3@user.com",
    password: "password3",
    isAdmin: false,
  });
}
```

3. Function: `commonBeforeEach`
   - This function runs before each test. It starts a new database transaction.

```javascript
async function commonBeforeEach() {
  await `DB`.query("BEGIN");
}
```

4. Function: `commonAfterEach`
   This function runs after each test. It rolls back the database transaction, ensuring that any changes made during the test are not saved.

```javascript
async function commonAfterEach() {
  await `DB`.query("ROLLBACK");
}
```

5. Function: `commonAfterAll`
   - This function runs once after all tests. It closes the database connection.

```javscript
async function commonAfterAll() {
  await `DB`.end();
}
```

6. Token for Testing:
   - Creates a JWT token for user `u1` to be used in tests.

```javascript
const u1Token = createToken({ username: "u1", isAdmin: false });
```

7. Export the Functions and Token:

```javascript
module.exports = {
  `commonBeforeAll`,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  u1Token,
};
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
jest --coverage -i'


```

- `--coverage`: Generates a test coverage report, showing which parts of your code are covered by tests.
- `-i` (in band): Ensures that tests run sequentially rather than in parallel. This is useful when tests might interfere with each other if run simultaneously.

[Back to TOC](#routes-folder-file-notesexplanationsdiagrams)

### auth.test.js

#### auth.test.js sequence diagram

```mermaid
sequenceDiagram
    participant Test
    participant DB
    participant App
    participant Auth as Auth Routes

    Test->>DB: commonBeforeAll() -> DELETE FROM users
    Test->>DB: commonBeforeAll() -> DELETE FROM companies
    Test->>DB: commonBeforeAll() -> INSERT INTO companies (c1, c2, c3)
    Test->>DB: commonBeforeAll() -> INSERT INTO users (u1, u2, u3)

    Test->>DB: commonBeforeEach() -> BEGIN transaction

    Test->>App: [Token Creation] POST /auth/token
    App->>Auth: Auth.authenticate(username, password)
    Auth->>DB: SELECT * FROM users WHERE username = 'u1'
    DB-->>Auth: Return user record
    Auth-->>App: Return JWT token
    App-->>Test: Return response with token

    Test->>App: [Unauthorized Access] POST /auth/token
    App->>Auth: Auth.authenticate(username, password)
    Auth->>DB: SELECT * FROM users WHERE username = 'no-such-user'
    DB-->>Auth: Return empty result
    Auth-->>App: Return 401 Unauthorized
    App-->>Test: Return response with 401 status

    Test->>App: [Wrong Password] POST /auth/token
    App->>Auth: Auth.authenticate(username, password)
    Auth->>DB: SELECT * FROM users WHERE username = 'u1'
    DB-->>Auth: Return user record
    Auth-->>App: Return 401 Unauthorized (wrong password)
    App-->>Test: Return response with 401 status

    Test->>App: [Bad Request with Missing Data] POST /auth/token
    App->>Auth: Auth.authenticate(username, password)
    Auth-->>App: Return 400 Bad Request (missing data)
    App-->>Test: Return response with 400 status

    Test->>App: [Bad Request with Invalid Data] POST /auth/token
    App->>Auth: Auth.authenticate(username, password)
    Auth-->>App: Return 400 Bad Request (invalid data)
    App-->>Test: Return response with 400 status

    Test->>App: [User Registration] POST /auth/register
    App->>Auth: Auth.register(userData)
    Auth->>DB: INSERT INTO users (new user)
    DB-->>Auth: Return inserted user details
    Auth-->>App: Return JWT token
    App-->>Test: Return response with token

    Test->>App: [Bad Request with Missing Fields] POST /auth/register
    App->>Auth: Auth.register(userData)
    Auth-->>App: Return 400 Bad Request (missing fields)
    App-->>Test: Return response with 400 status

    Test->>App: [Bad Request with Invalid Data] POST /auth/register
    App->>Auth: Auth.register(userData)
    Auth-->>App: Return 400 Bad Request (invalid data)
    App-->>Test: Return response with 400 status

    Test->>DB: commonAfterEach() -> ROLLBACK transaction

    Test->>DB: commonAfterAll() -> Close connection
```

[Back to TOC](#routes-folder-file-notesexplanationsdiagrams)

#### auth.test.js diagram explanation

Explanation of Each Step

1. Test Setup (`commonBeforeAll`):

- The test framework initiates the setup process by calling the `commonBeforeAll` function.
- The `commonBeforeAll` function sends queries to the database (`DB`) to delete all records from the `users` and `companies` tables.
- The `commonBeforeAll` function inserts sample data into the `companies` and `users` tables.

2. Test Initialization (`commonBeforeEach`):

- Before each test, the test framework calls the `commonBeforeEach` function.
- The `commonBeforeEach` function sends a query to the database to begin a new transaction.

3. Test Cleanup (`commonAfterEach`):

- After each test, the test framework calls the `commonAfterEach` function.
- The `commonAfterEach` function sends a query to the database to roll back the transaction, ensuring that any changes made during the test are not saved.

4. Test Teardown (`commonAfterAll`):

- After all tests have run, the test framework calls the `commonAfterAll` function.
- The `commonAfterAll` function sends a query to the database to close the connection.

5. Token Creation (`POST /auth/token`):

- The test framework sends a POST request to the `/auth/token` endpoint with valid credentials.
- The `Auth.authenticate` function queries the database for the user record and returns a JWT token if the credentials are correct.
- The test framework verifies that the response contains a token.

6. Unauthorized Access (`POST /auth/token`):

- The test framework sends a POST request to the `/auth/token` endpoint with a non-existent username.
- The `Auth.authenticate` function queries the database and returns a 401 Unauthorized status if the user does not exist.
- The test framework verifies that the response status is 401.

7. Wrong Password (`POST /auth/token`):

- The test framework sends a POST request to the `/auth/token` endpoint with an incorrect password.
- The `Auth.authenticate` function queries the database and returns a 401 Unauthorized status if the password is incorrect.
- The test framework verifies that the response status is 401.

8. Bad Request with Missing Data (`POST /auth/token`):

- The test framework sends a POST request to the `/auth/token` endpoint with missing data.
- The `Auth.authenticate` function returns a 400 Bad Request status if the data is incomplete.
- The test framework verifies that the response status is 400.

9. Bad Request with Invalid Data (`POST /auth/token`):

- The test framework sends a POST request to the `/auth/token` endpoint with invalid data.
- The `Auth.authenticate` function returns a 400 Bad Request status if the data is invalid.
- The test framework verifies that the response status is 400.

10. User Registration (`POST /auth/register`):

- The test framework sends a POST request to the `/auth/register` endpoint with valid user data.
- The `Auth.register` function inserts the new user into the database and returns a JWT token.
- The test framework verifies that the response contains a token.

11. Bad Request with Missing Fields (`POST /auth/register`):

- The test framework sends a POST request to the `/auth/register` endpoint with missing fields.
- The `Auth.register` function returns a 400 Bad Request status if the data is incomplete.
- The test framework verifies that the response status is 400.

12. Bad Request with Invalid Data (`POST /auth/register`):

- The test framework sends a POST request to the `/auth/register` endpoint with invalid data.
- The `Auth.register` function returns a 400 Bad Request status if the data is invalid.
- The test framework verifies that the response status is 400.

[Back to TOC](#routes-folder-file-notesexplanationsdiagrams)

#### auth.test.js code overview

This file contains tests for the authentication routes using the `jest` testing framework.

1. Imports and Setup

- `request`: Library for testing HTTP requests.
- `app`: The Express application.
- `commonBeforeAll`, `commonBeforeEach`, `commonAfterEach`, `commonAfterAll`: Common setup and teardown functions.

2. Test Suite: `POST /auth/token`

- Test for Successful Token Generation:
  - Verifies that a token is generated for a valid username and password.
- Test for Non-Existent User:
  - Verifies that a 401 status code is returned for a non-existent user.
- Test for Incorrect Password:
  - Verifies that a 401 status code is returned for an incorrect password.
- Test for Missing Data:
  - Verifies that a 400 status code is returned for missing data.
- Test for Invalid Data:
  - Verifies that a 400 status code is returned for invalid data.

```javascript
describe("POST /auth/token", function () {
  test("works", async function () {
    const resp = await request(app).post("/auth/token").send({
      username: "u1",
      password: "password1",
    });
    expect(resp.body).toEqual({
      token: expect.any(String),
    });
  });

  test("unauth with non-existent user", async function () {
    const resp = await request(app).post("/auth/token").send({
      username: "no-such-user",
      password: "password1",
    });
    expect(resp.statusCode).toEqual(401);
  });

  test("unauth with wrong password", async function () {
    const resp = await request(app).post("/auth/token").send({
      username: "u1",
      password: "nope",
    });
    expect(resp.statusCode).toEqual(401);
  });

  test("bad request with missing data", async function () {
    const resp = await request(app).post("/auth/token").send({
      username: "u1",
    });
    expect(resp.statusCode).toEqual(400);
  });

  test("bad request with invalid data", async function () {
    const resp = await request(app).post("/auth/token").send({
      username: 42,
      password: "above-is-a-number",
    });
    expect(resp.statusCode).toEqual(400);
  });
});
```

3. Test Suite: `POST /auth/register`

- Test for Successful Registration:
  - Verifies that a new user can be registered and a token is generated.
- Test for Missing Fields:
  - Verifies that a 400 status code is returned for missing fields.
- Test for Invalid Data:
  - Verifies that a 400 status code is returned for invalid data.

```javascript
describe("POST /auth/register", function () {
  test("works for anon", async function () {
    const resp = await request(app).post("/auth/register").send({
      username: "new",
      firstName: "first",
      lastName: "last",
      password: "password",
      email: "new@email.com",
    });
    expect(resp.statusCode).toEqual(201);
    expect(resp.body).toEqual({
      token: expect.any(String),
    });
  });

  test("bad request with missing fields", async function () {
    const resp = await request(app).post("/auth/register").send({
      username: "new",
    });
    expect(resp.statusCode).toEqual(400);
  });

  test("bad request with invalid data", async function () {
    const resp = await request(app).post("/auth/register").send({
      username: "new",
      firstName: "first",
      lastName: "last",
      password: "password",
      email: "not-an-email",
    });
    expect(resp.statusCode).toEqual(400);
  });
});
```

4. Understanding `beforeEach` and `afterEach`
   In the context of testing, `beforeEach` and `afterEach` are hooks provided by testing frameworks like Jest to run code before and after each test case, respectively.

`beforeEach`: Runs a specific piece of code before each test case. This is useful for setting up a consistent state before each test.
In this file, `commonBeforeEach` starts a new database transaction before each test.
`afterEach`: Runs a specific piece of code after each test case. This is useful for cleaning up after each test to ensure tests do not affect each other.
In this file, `commonAfterEach` rolls back the database transaction after each test.

5. Running Tests with Coverage and the `-i` Flag
   To run the tests with coverage and ensure they run in order (in band), you can use the following command:

```javascript
jest --coverage -i
```

- `--coverage`: Generates a test coverage report, showing which parts of your code are covered by tests.
- `-i` (in band): Ensures that tests run sequentially rather than in parallel. This is useful when tests might interfere with each other if run simultaneously.

[Back to TOC](#routes-folder-file-notesexplanationsdiagrams)

### companies.test.js

#### companies.test.js diagram

```mermaid
sequenceDiagram
    participant Test
    participant DB
    participant App

    Test->>DB: commonBeforeAll() -> DELETE FROM users
    Test->>DB: commonBeforeAll() -> DELETE FROM companies
    Test->>DB: commonBeforeAll() -> INSERT INTO companies (c1, c2, c3)
    Test->>DB: commonBeforeAll() -> INSERT INTO users (u1, u2, u3)

    Test->>DB: commonBeforeEach() -> BEGIN transaction

    Test->>App: [Company Creation] POST /companies
    App->>DB: INSERT INTO companies (new)
    DB-->>App: Return inserted company details
    App-->>Test: Return response with company details

    Test->>App: [Bad Request with Missing Data] POST /companies
    App-->>Test: Return 400 Bad Request (missing data)

    Test->>App: [Bad Request with Invalid Data] POST /companies
    App-->>Test: Return 400 Bad Request (invalid data)

    Test->>App: [Retrieve All Companies] GET /companies
    App->>DB: SELECT * FROM companies
    DB-->>App: Return all companies
    App-->>Test: Return response with companies

    Test->>DB: [Error Handling] DROP TABLE companies CASCADE
    Test->>App: GET /companies
    App-->>Test: Return 500 Internal Server Error

    Test->>App: [Retrieve Company by Handle] GET /companies/c1
    App->>DB: SELECT * FROM companies WHERE handle = 'c1'
    DB-->>App: Return company details
    App-->>Test: Return response with company details

    Test->>App: [Retrieve Company without Jobs] GET /companies/c2
    App->>DB: SELECT * FROM companies WHERE handle = 'c2'
    DB-->>App: Return company details
    App-->>Test: Return response with company details

    Test->>App: [Company Not Found] GET /companies/nope
    App-->>Test: Return 404 Not Found

    Test->>App: [Update Company] PATCH /companies/c1
    App->>DB: UPDATE companies SET name = 'C1-new' WHERE handle = 'c1'
    DB-->>App: Return updated company details
    App-->>Test: Return response with updated company details

    Test->>App: [Unauthorized Update] PATCH /companies/c1
    App-->>Test: Return 401 Unauthorized

    Test->>App: [Company Not Found on Update] PATCH /companies/nope
    App-->>Test: Return 404 Not Found

    Test->>App: [Invalid Handle Change Attempt] PATCH /companies/c1
    App-->>Test: Return 400 Bad Request (handle change attempt)

    Test->>App: [Invalid Data on Update] PATCH /companies/c1
    App-->>Test: Return 400 Bad Request (invalid data)

    Test->>App: [Delete Company] DELETE /companies/c1
    App->>DB: DELETE FROM companies WHERE handle = 'c1'
    DB-->>App: Confirm deletion
    App-->>Test: Return response with deletion confirmation

    Test->>App: [Unauthorized Deletion] DELETE /companies/c1
    App-->>Test: Return 401 Unauthorized

    Test->>App: [Company Not Found on Deletion] DELETE /companies/nope
    App-->>Test: Return 404 Not Found

    Test->>DB: commonAfterEach() -> ROLLBACK transaction

    Test->>DB: commonAfterAll() -> Close connection
```

[Back to TOC](#routes-folder-file-notesexplanationsdiagrams)

#### companies.test.js diagram explanation

**Explanation of Each Step**

1. Test Setup (`commonBeforeAll`):

   - The test framework initiates the setup process by calling the `commonBeforeAll` function.
   - The `commonBeforeAll` function sends queries to the database (`DB`) to delete all records from the `users` and `companies` tables.
   - The `commonBeforeAll` function inserts sample data into the `companies` and `users` tables.

2. Test Initialization (`commonBeforeEach`):

   - Before each test, the test framework calls the `commonBeforeEach` function.
   - The `commonBeforeEach` function sends a query to the database to begin a new transaction.

3. Test Cleanup (`commonAfterEach`):

   - After each test, the test framework calls the `commonAfterEach` function.
   - The `commonAfterEach` function sends a query to the database to roll back the transaction, ensuring that any changes made during the test are not saved.

4. Test Teardown (`commonAfterAll`):

   - After all tests have run, the test framework calls the `commonAfterAll` function.
   - The `commonAfterAll` function sends a query to the database to close the connection.

5. Company Creation (`POST /companies`):

   - The test framework sends a POST request to the `/companies` endpoint with valid company data.
   - The application inserts the new company into the database and returns the company details.
   - The test framework verifies that the response contains the company details.

6. Bad Request with Missing Data (`POST /companies`):

   - The test framework sends a POST request to the `/companies` endpoint with missing data.
   - The application returns a 400 Bad Request status.
   - The test framework verifies that the response status is 400.

7. Bad Request with Invalid Data (`POST /companies`):

   - The test framework sends a POST request to the `/companies` endpoint with invalid data.
   - The application returns a 400 Bad Request status.
   - The test framework verifies that the response status is 400.

8. Retrieve All Companies (`GET /companies`):

   - The test framework sends a GET request to the `/companies` endpoint.
   - The application retrieves all companies from the database and returns them.
   - The test framework verifies that the response contains the list of companies.

9. Error Handling (`GET /companies`):

   - The test framework drops the `companies` table to simulate an error.
   - The test framework sends a GET request to the `/companies` endpoint.
   - The application returns a 500 Internal Server Error status.
   - The test framework verifies that the response status is 500.

10. Retrieve Company by Handle (`GET /companies/:handle`):

    - The test framework sends a GET request to the `/companies/c1` endpoint.
    - The application retrieves the company details from the database and returns them.
    - The test framework verifies that the response contains the company details.

11. Retrieve Company without Jobs (`GET /companies/:handle`):

    - The test framework sends a GET request to the `/companies/c2` endpoint.
    - The application retrieves the company details from the database and returns them.
    - The test framework verifies that the response contains the company details.

12. Company Not Found (`GET /companies/:handle`):

    - The test framework sends a GET request to the /companies/nope endpoint.
    - The application returns a 404 Not Found status.
    - The test framework verifies that the response status is 404.

13. Update Company (`PATCH /companies/:handle`):

    - The test framework sends a PATCH request to the `/companies/c1` endpoint with valid data.
    - The application updates the company details in the database and returns the updated details.
    - The test framework verifies that the response contains the updated company details.

14. Unauthorized Update (`PATCH /companies/:handle`):

    - The test framework sends a PATCH request to the `/companies/c1` endpoint without authorization.
    - The application returns a 401 Unauthorized status.
    - The test framework verifies that the response status is 401.

15. Company Not Found on Update (`PATCH /companies/:handle`):

    - The test framework sends a PATCH request to the `/companies/nope` endpoint.
    - The application returns a 404 Not Found status.
    - The test framework verifies that the response status is 404.

16. Invalid Handle Change Attempt (`PATCH /companies/:handle`):

    - The test framework sends a PATCH request to the /companies/c1 endpoint with an attempt to change the handle.
    - The application returns a 400 Bad Request status.
    - The test framework verifies that the response status is 400.

17. Invalid Data on Update (`PATCH /companies/:handle`):

    - The test framework sends a PATCH request to the `/companies/c1` endpoint with invalid data.
    - The application returns a 400 Bad Request status.
    - The test framework verifies that the response status is 400.

18. Delete Company (`DELETE /companies/:handle`):

    - The test framework sends a DELETE request to the `/companies/c1` endpoint.
    - The application deletes the company from the database and returns a confirmation.
    - The test framework verifies that the response contains the deletion confirmation.

19. Unauthorized Deletion (`DELETE /companies/:handle`):

    - The test framework sends a DELETE request to the `/companies/c1` endpoint without authorization.
    - The application returns a 401 Unauthorized status.
    - The test framework verifies that the response status is 401.

20. Company Not Found on Deletion (`DELETE /companies/:handle`):
    - The test framework sends a DELETE request to the `/companies/nope` endpoint.
    - The application returns a 404 Not Found status.
    - The test framework verifies that the response status is 404.

[Back to TOC](#routes-folder-file-notesexplanationsdiagrams)

#### companies.test.js code overview

This file contains tests for the company routes using the jest testing framework.

1. Imports and Setup

- `request`: Library for testing HTTP requests.
- `DB`: Database connection.
- `app`: The Express application.
- `commonBeforeAll`, `commonBeforeEach`, `commonAfterEach`, `commonAfterAll`: Common setup and teardown functions.
  `u1Token`: JWT token for user `u1`.

```javascript
"use strict";

const request = require("supertest");

const `DB` = require("../`DB`");
const app = require("../app");

const {
  `commonBeforeAll`,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  u1Token,
} = require("./_testCommon");

beforeAll(`commonBeforeAll`);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);
```

2. Test Suite: `POST /companies`

- Test for Successful Creation:
  - Verifies that a new company can be created with valid data.
- Test for Missing Data:
  - Verifies that a 400 status code is returned for missing data.
- Test for Invalid Data:
  - Verifies that a 400 status code is returned for invalid data.

```javascript
describe("POST /companies", function () {
  const newCompany = {
    handle: "new",
    name: "New",
    logoUrl: "http://new.img",
    description: "DescNew",
    numEmployees: 10,
  };

  test("ok for users", async function () {
    const resp = await request(app)
      .post("/companies")
      .send(newCompany)
      .set("authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toEqual(201);
    expect(resp.body).toEqual({
      company: newCompany,
    });
  });

  test("bad request with missing data", async function () {
    const resp = await request(app)
      .post("/companies")
      .send({
        handle: "new",
        numEmployees: 10,
      })
      .set("authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toEqual(400);
  });

  test("bad request with invalid data", async function () {
    const resp = await request(app)
      .post("/companies")
      .send({
        ...newCompany,
        logoUrl: "not-a-url",
      })
      .set("authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toEqual(400);
  });
});
```

3. Test Suite: `GET /companies`

- Test for Retrieving All Companies:
  - Verifies that all companies can be retrieved.
- Test for Error Handling:
  - Verifies that a 500 status code is returned when an error occurs.

```javascript
describe("GET /companies", function () {
  test("ok for anon", async function () {
    const resp = await request(app).get("/companies");
    expect(resp.body).toEqual({
      companies: [
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
      ],
    });
  });

  test("fails: test next() handler", async function () {
    await `DB`.query("DROP TABLE companies CASCADE");
    const resp = await request(app)
      .get("/companies")
      .set("authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toEqual(500);
  });
});
```

4. Test Suite: `GET /companies/:handle`

- Test for Retrieving a Company:
  - Verifies that a company can be retrieved by its handle.
- Test for Non-Existent Company:
  - Verifies that a 404 status code is returned for a non-existent company.

```javascript
describe("GET /companies/:handle", function () {
  test("works for anon", async function () {
    const resp = await request(app).get(`/companies/c1`);
    expect(resp.body).toEqual({
      company: {
        handle: "c1",
        name: "C1",
        description: "Desc1",
        numEmployees: 1,
        logoUrl: "http://c1.img",
      },
    });
  });

  test("works for anon: company w/o jobs", async function () {
    const resp = await request(app).get(`/companies/c2`);
    expect(resp.body).toEqual({
      company: {
        handle: "c2",
        name: "C2",
        description: "Desc2",
        numEmployees: 2,
        logoUrl: "http://c2.img",
      },
    });
  });

  test("not found for no such company", async function () {
    const resp = await request(app).get(`/companies/nope`);
    expect(resp.statusCode).toEqual(404);
  });
});
```

5. Test Suite: `PATCH /companies/:handle`

- Test for Successful Update:
  - Verifies that a company's data can be updated.
- Test for Unauthorized Access:
  - Verifies that a 401 status code is returned for unauthorized access.
- Test for Non-Existent Company:
  - Verifies that a 404 status code is returned for a non-existent company.
- Test for Invalid Handle Change:
  - Verifies that a 400 status code is returned for an invalid handle change.
- Test for Invalid Data:
  - Verifies that a 400 status code is returned for invalid data.

```javascript
describe("PATCH /companies/:handle", function () {
  test("works for users", async function () {
    const resp = await request(app)
      .patch(`/companies/c1`)
      .send({
        name: "C1-new",
      })
      .set("authorization", `Bearer ${u1Token}`);
    expect(resp.body).toEqual({
      company: {
        handle: "c1",
        name: "C1-new",
        description: "Desc1",
        numEmployees: 1,
        logoUrl: "http://c1.img",
      },
    });
  });

  test("unauth for anon", async function () {
    const resp = await request(app).patch(`/companies/c1`).send({
      name: "C1-new",
    });
    expect(resp.statusCode).toEqual(401);
  });

  test("not found on no such company", async function () {
    const resp = await request(app)
      .patch(`/companies/nope`)
      .send({
        name: "new nope",
      })
      .set("authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toEqual(404);
  });

  test("bad request on handle change attempt", async function () {
    const resp = await request(app)
      .patch(`/companies/c1`)
      .send({
        handle: "c1-new",
      })
      .set("authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toEqual(400);
  });

  test("bad request on invalid data", async function () {
    const resp = await request(app)
      .patch(`/companies/c1`)
      .send({
        logoUrl: "not-a-url",
      })
      .set("authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toEqual(400);
  });
});
```

6. Test Suite: `DELETE /companies/:handle`

- Test for Successful Deletion:
  - Verifies that a company can be deleted.
- Test for Unauthorized Access:
  - Verifies that a 401 status code is returned for unauthorized access.
- Test for Non-Existent Company:
  - Verifies that a 404 status code is returned for a non-existent company.

```javascript
describe("DELETE /companies/:handle", function () {
  test("works for users", async function () {
    const resp = await request(app)
      .delete(`/companies/c1`)
      .set("authorization", `Bearer ${u1Token}`);
    expect(resp.body).toEqual({ deleted: "c1" });
  });

  test("unauth for anon", async function () {
    const resp = await request(app).delete(`/companies/c1`);
    expect(resp.statusCode).toEqual(401);
  });

  test("not found for no such company", async function () {
    const resp = await request(app)
      .delete(`/companies/nope`)
      .set("authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toEqual(404);
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

```javascript
jest --coverage -i
```

- `--coverage`: Generates a test coverage report, showing which parts of your code are covered by tests.
- `-i` (in band): Ensures that tests run sequentially rather than in parallel. This is useful when tests might interfere with each other if run simultaneously.

[Back to TOC](#routes-folder-file-notesexplanationsdiagrams)

### users.test.js

#### users.test.js Diagram

```mermaid
sequenceDiagram
    participant Test
    participant DB
    participant App
    participant User

    Test->>DB: commonBeforeAll() -> DELETE FROM users
    Test->>DB: commonBeforeAll() -> DELETE FROM companies
    Test->>DB: commonBeforeAll() -> INSERT INTO companies (c1, c2, c3)
    Test->>DB: commonBeforeAll() -> INSERT INTO users (u1, u2, u3)

    Test->>DB: commonBeforeEach() -> BEGIN transaction

    Test->>App: [User Creation] POST /users
    App->>DB: INSERT INTO users (new user)
    DB-->>App: Return inserted user details
    App-->>Test: Return response with user details and token

    Test->>App: [Admin Creation] POST /users
    App->>DB: INSERT INTO users (new admin)
    DB-->>App: Return inserted admin details
    App-->>Test: Return response with admin details and token

    Test->>App: [Unauthorized User Creation] POST /users
    App-->>Test: Return 401 Unauthorized

    Test->>App: [Bad Request with Missing Data] POST /users
    App-->>Test: Return 400 Bad Request (missing data)

    Test->>App: [Bad Request with Invalid Data] POST /users
    App-->>Test: Return 400 Bad Request (invalid data)

    Test->>App: [Retrieve All Users] GET /users
    App->>DB: SELECT * FROM users
    DB-->>App: Return all users
    App-->>Test: Return response with users

    Test->>App: [Unauthorized Access] GET /users
    App-->>Test: Return 401 Unauthorized

    Test->>DB: [Error Handling] DROP TABLE users CASCADE
    Test->>App: GET /users
    App-->>Test: Return 500 Internal Server Error

    Test->>App: [Retrieve User by Username] GET /users/u1
    App->>DB: SELECT * FROM users WHERE username = 'u1'
    DB-->>App: Return user details
    App-->>Test: Return response with user details

    Test->>App: [Unauthorized Access] GET /users/u1
    App-->>Test: Return 401 Unauthorized

    Test->>App: [User Not Found] GET /users/nope
    App-->>Test: Return 404 Not Found

    Test->>App: [Update User] PATCH /users/u1
    App->>DB: UPDATE users SET firstName = 'New' WHERE username = 'u1'
    DB-->>App: Return updated user details
    App-->>Test: Return response with updated user details

    Test->>App: [Unauthorized Update] PATCH /users/u1
    App-->>Test: Return 401 Unauthorized

    Test->>App: [User Not Found on Update] PATCH /users/nope
    App-->>Test: Return 404 Not Found

    Test->>App: [Invalid Data on Update] PATCH /users/u1
    App-->>Test: Return 400 Bad Request (invalid data)

    Test->>App: [Update Password] PATCH /users/u1
    App->>DB: UPDATE users SET password = 'new-password' WHERE username = 'u1'
    DB-->>App: Return updated user details
    App-->>Test: Return response with updated user details
    Test->>User: User.authenticate('u1', 'new-password')
    User->>DB: SELECT * FROM users WHERE username = 'u1'
    DB-->>User: Return user details
    User-->>Test: Return user object

    Test->>App: [Delete User] DELETE /users/u1
    App->>DB: DELETE FROM users WHERE username = 'u1'
    DB-->>App: Confirm deletion
    App-->>Test: Return response with deletion confirmation

    Test->>App: [Unauthorized Deletion] DELETE /users/u1
    App-->>Test: Return 401 Unauthorized

    Test->>App: [User Not Found on Deletion] DELETE /users/nope
    App-->>Test: Return 404 Not Found

    Test->>DB: commonAfterEach() -> ROLLBACK transaction

    Test->>DB: commonAfterAll() -> Close connection
```

[Back to TOC](#routes-folder-file-notesexplanationsdiagrams)

#### users.test.js diagram explanation

**Explanation of Each Step**

1. Test Setup (`commonBeforeAll`):

- The test framework initiates the setup process by calling the `commonBeforeAll` function.
- The `commonBeforeAll` function sends queries to the database (`DB`) to delete all records from the `users` and `companies` tables.
- The `commonBeforeAll` function inserts sample data into the `companies` and `users` tables.

2. Test Initialization (`commonBeforeEach`):

- Before each test, the test framework calls the `commonBeforeEach` function.
- The `commonBeforeEach` function sends a query to the database to begin a new transaction.

3. Test Cleanup (`commonAfterEach`):

- After each test, the test framework calls the `commonAfterEach` function.
- The `commonAfterEach` function sends a query to the database to roll back the transaction, ensuring that any changes made during the test are not saved.

4. Test Teardown (`commonAfterAll`):

- After all tests have run, the test framework calls the `commonAfterAll` function.
- The `commonAfterAll` function sends a query to the database to close the connection.

5. User Creation (`POST /users`):

- The test framework sends a POST request to the `/users` endpoint with valid user data.
- The application inserts the new user into the database and returns the user details and a token.
- The test framework verifies that the response contains the user details and token.

6. Admin Creation (`POST /users`):

- The test framework sends a POST request to the `/users` endpoint with valid admin data.
- The application inserts the new admin into the database and returns the admin details and a token.
- The test framework verifies that the response contains the admin details and token.

7. Unauthorized User Creation (`POST /users`):

- The test framework sends a POST request to the `/users` endpoint without authorization.
- The application returns a 401 Unauthorized status.
- The test framework verifies that the response status is 401.

8. Bad Request with Missing Data (`POST /users`):

- The test framework sends a POST request to the `/users` endpoint with missing data.
- The application returns a 400 Bad Request status.
- The test framework verifies that the response status is 400.

9. Bad Request with Invalid Data (`POST /users`):

- The test framework sends a POST request to the `/users` endpoint with invalid data.
- The application returns a 400 Bad Request status.
- The test framework verifies that the response status is 400.

10. Retrieve All Users (`GET /users`):

- The test framework sends a GET request to the `/users` endpoint.
- The application retrieves all users from the database and returns them.
- The test framework verifies that the response contains the list of users.

11. Unauthorized Access (`GET /users`):

- The test framework sends a GET request to the `/users` endpoint without authorization.
- The application returns a 401 Unauthorized status.
- The test framework verifies that the response status is 401.

12. Error Handling (`GET /users`):

- The test framework drops the `users` table to simulate an error.
- The test framework sends a GET request to the `/users` endpoint.
- The application returns a 500 Internal Server Error status.
- The test framework verifies that the response status is 500.

13. Retrieve User by Username (`GET /users/:username`):

- The test framework sends a GET request to the `/users/u1` endpoint.
- The application retrieves the user details from the database and returns them.
- The test framework verifies that the response contains the user details.

14. Unauthorized Access (`GET /users/:username`):

- The test framework sends a GET request to the `/users/u1` endpoint without authorization.
- The application returns a 401 Unauthorized status.
- The test framework verifies that the response status is 401.

15. User Not Found (`GET /users/:username`):

- The test framework sends a GET request to the `/users/nope` endpoint.
- The application returns a 404 Not Found status.
- The test framework verifies that the response status is 404.

16. Update User (`PATCH /users/:username`):

- The test framework sends a PATCH request to the `/users/u1` endpoint with valid data.
- The application updates the user details in the database and returns the updated details.
- The test framework verifies that the response contains the updated user details.

17. Unauthorized Update (`PATCH /users/:username`):

- The test framework sends a PATCH request to the `/users/u1` endpoint without authorization.
- The application returns a 401 Unauthorized status.
- The test framework verifies that the response status is 401.

18. User Not Found on Update (`PATCH /users/:username`):

- The test framework sends a PATCH request to the `/users/nope` endpoint.
- The application returns a 404 Not Found status.
- The test framework verifies that the response status is 404.

19. Invalid Data on Update (`PATCH /users/:username`):

- The test framework sends a PATCH request to the `/users/u1` endpoint with invalid data.
- The application returns a 400 Bad Request status.
- The test framework verifies that the response status is 400.

20. Update Password (`PATCH /users/:username`):

- The test framework sends a PATCH request to the `/users/u1` endpoint with a new password.
- The application updates the user password in the database and returns the updated details.
- The test framework verifies that the response contains the updated user details.
- The test framework calls the `User.authenticate` method to verify the new password.
- The `User.authenticate` method queries the database and returns the user details if the password is correct.
- The test framework verifies that the authentication is successful.

21. Delete User (`DELETE /users/:username`):

- The test framework sends a DELETE request to the `/users/u1` endpoint.
- The application deletes the user from the database and returns a confirmation.
- The test framework verifies that the response contains the deletion confirmation.

22. Unauthorized Deletion (`DELETE /users/:username`):

- The test framework sends a DELETE request to the `/users/u1` endpoint without authorization.
- The application returns a 401 Unauthorized status.
- The test framework verifies that the response status is 401.

23. User Not Found on Deletion (`DELETE /users/:username`):

- The test framework sends a DELETE request to the `/users/nope` endpoint.
- The application returns a 404 Not Found status.
- The test framework verifies that the response status is 404.

[Back to TOC](#routes-folder-file-notesexplanationsdiagrams)

#### users.test.js code overview

This file contains tests for the user routes using the `jest` testing framework.

- `request`: Library for testing HTTP requests.
- `DB`: Database connection.
- `app`: The Express application.
- `User`: The `User` model.
- `commonBeforeAll`, `commonBeforeEach`, `commonAfterEach`, `commonAfterAll`: Common setup and teardown functions.
  u1Token: JWT token for user u1.

1. Imports and Setup:

```javascript
"use strict";

const request = require("supertest");

const `DB` = require("../`DB`.js");
const app = require("../app");
const User = require("../models/user");

const {
  `commonBeforeAll`,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  u1Token,
} = require("./_testCommon");

beforeAll(`commonBeforeAll`);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);
```

2. Test Suite: `POST /users`

- Test for Successful Creation (Non-Admin):
  - Verifies that a new non-admin user can be created.
- Test for Successful Creation (Admin):
  - Verifies that a new admin user can be created.
- Test for Unauthorized Access:
  - Verifies that a 401 status code is returned for unauthorized access.
- Test for Missing Data:
  - Verifies that a 400 status code is returned for missing data.
- Test for Invalid Data:
  - Verifies that a 400 status code is returned for invalid data.

```javascript
describe("POST /users", function () {
  test("works for users: create non-admin", async function () {
    const resp = await request(app)
      .post("/users")
      .send({
        username: "u-new",
        firstName: "First-new",
        lastName: "Last-newL",
        password: "password-new",
        email: "new@email.com",
        isAdmin: false,
      })
      .set("authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toEqual(201);
    expect(resp.body).toEqual({
      user: {
        username: "u-new",
        firstName: "First-new",
        lastName: "Last-newL",
        email: "new@email.com",
        isAdmin: false,
      },
      token: expect.any(String),
    });
  });

  test("works for users: create admin", async function () {
    const resp = await request(app)
      .post("/users")
      .send({
        username: "u-new",
        firstName: "First-new",
        lastName: "Last-newL",
        password: "password-new",
        email: "new@email.com",
        isAdmin: true,
      })
      .set("authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toEqual(201);
    expect(resp.body).toEqual({
      user: {
        username: "u-new",
        firstName: "First-new",
        lastName: "Last-newL",
        email: "new@email.com",
        isAdmin: true,
      },
      token: expect.any(String),
    });
  });

  test("unauth for anon", async function () {
    const resp = await request(app).post("/users").send({
      username: "u-new",
      firstName: "First-new",
      lastName: "Last-newL",
      password: "password-new",
      email: "new@email.com",
      isAdmin: true,
    });
    expect(resp.statusCode).toEqual(401);
  });

  test("bad request if missing data", async function () {
    const resp = await request(app)
      .post("/users")
      .send({
        username: "u-new",
      })
      .set("authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toEqual(400);
  });

  test("bad request if invalid data", async function () {
    const resp = await request(app)
      .post("/users")
      .send({
        username: "u-new",
        firstName: "First-new",
        lastName: "Last-newL",
        password: "password-new",
        email: "not-an-email",
        isAdmin: true,
      })
      .set("authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toEqual(400);
  });
});
```

3. Test Suite: `GET /users`

- Test for Retrieving All Users:
  - Verifies that all users can be retrieved.
- Test for Unauthorized Access:
  - Verifies that a 401 status code is returned for unauthorized access.
- Test for Error Handling:
  - Verifies that a 500 status code is returned when an error occurs.

```javascript
describe("GET /users", function () {
  test("works for users", async function () {
    const resp = await request(app)
      .get("/users")
      .set("authorization", `Bearer ${u1Token}`);
    expect(resp.body).toEqual({
      users: [
        {
          username: "u1",
          firstName: "U1F",
          lastName: "U1L",
          email: "user1@user.com",
          isAdmin: false,
        },
        {
          username: "u2",
          firstName: "U2F",
          lastName: "U2L",
          email: "user2@user.com",
          isAdmin: false,
        },
        {
          username: "u3",
          firstName: "U3F",
          lastName: "U3L",
          email: "user3@user.com",
          isAdmin: false,
        },
      ],
    });
  });

  test("unauth for anon", async function () {
    const resp = await request(app).get("/users");
    expect(resp.statusCode).toEqual(401);
  });

  test("fails: test next() handler", async function () {
    await `DB`.query("DROP TABLE users CASCADE");
    const resp = await request(app)
      .get("/users")
      .set("authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toEqual(500);
  });
});
```

4. Test Suite: `GET /users/:username`

- Test for Retrieving a User:
  - Verifies that a user can be retrieved by their username.
- Test for Unauthorized Access:
  - Verifies that a 401 status code is returned for unauthorized access.
- Test for Non-Existent User:
  - Verifies that a 404 status code is returned for a non-existent user.

```javascript
describe("GET /users/:username", function () {
  test("works for users", async function () {
    const resp = await request(app)
      .get(`/users/u1`)
      .set("authorization", `Bearer ${u1Token}`);
    expect(resp.body).toEqual({
      user: {
        username: "u1",
        firstName: "U1F",
        lastName: "U1L",
        email: "user1@user.com",
        isAdmin: false,
      },
    });
  });

  test("unauth for anon", async function () {
    const resp = await request(app).get(`/users/u1`);
    expect(resp.statusCode).toEqual(401);
  });

  test("not found if user not found", async function () {
    const resp = await request(app)
      .get(`/users/nope`)
      .set("authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toEqual(404);
  });
});
```

5. Test Suite: `PATCH /users/:username`

- Test for Successful Update:
  - Verifies that a user's data can be updated.
- Test for Unauthorized Access:
  - Verifies that a 401 status code is returned for unauthorized access.
- Test for Non-Existent User:
  - Verifies that a 404 status code is returned for a non-existent user.
- Test for Invalid Data:
  - Verifies that a 400 status code is returned for invalid data.
- Test for Updating Password:
  - Verifies that a user's password can be updated.

```javascript
describe("PATCH /users/:username", () => {
  test("works for users", async function () {
    const resp = await request(app)
      .patch(`/users/u1`)
      .send({
        firstName: "New",
      })
      .set("authorization", `Bearer ${u1Token}`);
    expect(resp.body).toEqual({
      user: {
        username: "u1",
        firstName: "New",
        lastName: "U1L",
        email: "user1@user.com",
        isAdmin: false,
      },
    });
  });

  test("unauth for anon", async function () {
    const resp = await request(app).patch(`/users/u1`).send({
      firstName: "New",
    });
    expect(resp.statusCode).toEqual(401);
  });

  test("not found if no such user", async function () {
    const resp = await request(app)
      .patch(`/users/nope`)
      .send({
        firstName: "Nope",
      })
      .set("authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toEqual(404);
  });

  test("bad request if invalid data", async function () {
    const resp = await request(app)
      .patch(`/users/u1`)
      .send({
        firstName: 42,
      })
      .set("authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toEqual(400);
  });

  test("works: set new password", async function () {
    const resp = await request(app)
      .patch(`/users/u1`)
      .send({
        password: "new-password",
      })
      .set("authorization", `Bearer ${u1Token}`);
    expect(resp.body).toEqual({
      user: {
        username: "u1",
        firstName: "U1F",
        lastName: "U1L",
        email: "user1@user.com",
        isAdmin: false,
      },
    });
    const isSuccessful = await User.authenticate("u1", "new-password");
    expect(isSuccessful).toBeTruthy();
  });
});
```

6. Test Suite: `DELETE /users/:username`

- Test for Successful Deletion:
  - Verifies that a user can be deleted.
- Test for Unauthorized Access:
  - Verifies that a 401 status code is returned for unauthorized access.
- Test for Non-Existent User:
  - Verifies that a 404 status code is returned for a non-existent user.

```javascript
describe("DELETE /users/:username", function () {
  test("works for users", async function () {
    const resp = await request(app)
      .delete(`/users/u1`)
      .set("authorization", `Bearer ${u1Token}`);
    expect(resp.body).toEqual({ deleted: "u1" });
  });

  test("unauth for anon", async function () {
    const resp = await request(app).delete(`/users/u1`);
    expect(resp.statusCode).toEqual(401);
  });

  test("not found if user missing", async function () {
    const resp = await request(app)
      .delete(`/users/nope`)
      .set("authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toEqual(404);
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

```javascript
jest --coverage -i
```

- `--coverage`: Generates a test coverage report, showing which parts of your code are covered by tests.
- `-i` (in band): Ensures that tests run sequentially rather than in parallel. This is useful when tests might interfere with each other if run simultaneously.

[Back to TOC](#routes-folder-file-notesexplanationsdiagrams)

### Scripts

### auth.js

This file contains the routes for handling authentication in the Jobly application.

1. Imports and Setup

- `jsonschema`: Library for validating JSON objects against a schema.
- `User`: The `User` model for interacting with the `users` table.
- `express`: The main framework used to build the web server.
- `createToken`: Function to create JSON Web Tokens (JWT).
- `userAuthSchema`, `userRegisterSchema`: JSON schemas for validating user authentication and registration data.
- `BadRequestError`: Custom error class for handling bad requests.

```javascript
"use strict";

const jsonschema = require("jsonschema");
const User = require("../models/user");
const express = require("express");
const router = new express.Router();
const { createToken } = require("../helpers/tokens");
const userAuthSchema = require("../schemas/userAuth.json");
const userRegisterSchema = require("../schemas/userRegister.json");
const { BadRequestError } = require("../expressError");
```

2. Route: `POST /auth/token`

- Validates the request body against the `userAuthSchema`.
- Authenticates the user with the provided username and password.
- Creates a JWT token for the authenticated user.
- Returns the token in the response.

```javascript
router.post("/token", async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, userAuthSchema);
    if (!validator.valid) {
      const errs = validator.errors.map((e) => e.stack);
      throw new BadRequestError(errs);
    }

    const { username, password } = req.body;
    const user = await User.authenticate(username, password);
    const token = createToken(user);
    return res.json({ token });
  } catch (err) {
    return next(err);
  }
});
```

3. Route: `POST /auth/register`

- Validates the request body against the `userRegisterSchema`.
- Registers a new user with the provided data.
- Creates a JWT token for the new user.
- Returns the token in the response.

```javascript
router.post("/register", async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, userRegisterSchema);
    if (!validator.valid) {
      const errs = validator.errors.map((e) => e.stack);
      throw new BadRequestError(errs);
    }

    const newUser = await User.register({ ...req.body, isAdmin: false });
    const token = createToken(newUser);
    return res.status(201).json({ token });
  } catch (err) {
    return next(err);
  }
});
```

4. Export the Router:

```javascript
module.exports = router;
```

[Back to TOC](#routes-folder-file-notesexplanationsdiagrams)

#### auth.js sequence diagram

```mermaid
sequenceDiagram
    participant Client
    participant App
    participant Auth as Auth Routes
    participant User
    participant DB

    Client->>App: POST /auth/token
    App->>Auth: router.post("/token")
    Auth->>jsonschema: jsonschema.validate(req.body, userAuthSchema)
    jsonschema-->>Auth: Return validation result
    alt Validation fails
        Auth-->>App: Return 400 Bad Request
        App-->>Client: Return response with 400 status
    else Validation succeeds
        Auth->>User: User.authenticate(username, password)
        User->>DB: SELECT * FROM users WHERE username = $1
        DB-->>User: Return user record
        User-->>Auth: Return user object
        Auth->>createToken: createToken(user)
        createToken-->>Auth: Return JWT token
        Auth-->>App: Return JWT token
        App-->>Client: Return response with token
    end

    Client->>App: POST /auth/register
    App->>Auth: router.post("/register")
    Auth->>jsonschema: jsonschema.validate(req.body, userRegisterSchema)
    jsonschema-->>Auth: Return validation result
    alt Validation fails
        Auth-->>App: Return 400 Bad Request
        App-->>Client: Return response with 400 status
    else Validation succeeds
        Auth->>User: User.register({ ...req.body, isAdmin: false })
        User->>DB: Check username duplication
        DB-->>User: Duplicate check result
        User->>DB: INSERT INTO users (new user)
        DB-->>User: Return inserted user details
        User-->>Auth: Return user object
        Auth->>createToken: createToken(user)
        createToken-->>Auth: Return JWT token
        Auth-->>App: Return JWT token
        App-->>Client: Return response with token
    end
```

[Back to TOC](#routes-folder-file-notesexplanationsdiagrams)

#### auth.js diagram explanation

1. Token Creation (`POST /auth/token`):

- The client sends a POST request to the `/auth/token` endpoint with the username and password.
- The Express application routes the request to the `router.post("/token")` handler in the `Auth Routes`.
- The `Auth Routes` handler validates the request body against the `userAuthSchema` using `jsonschema`.
- If the validation fails, the handler returns a 400 Bad Request status to the client.
- If the validation succeeds, the handler calls the `User.authenticate` method with the provided username and password.
- The `User.authenticate` method queries the database to find the user record matching the provided username.
- The database returns the user record to the `User.authenticate` method.
- The `User.authenticate` method returns the user object to the `Auth Routes` handler.
- The `Auth Routes` handler calls the createToken function to create a JWT token for the authenticated user.
- The createToken function returns the JWT token to the `Auth Routes` handler.
- The `Auth Routes` handler returns the JWT token to the client in the response.

2. User Registration (`POST /auth/register`):

- The client sends a POST request to the `/auth/register` endpoint with the user details.
- The Express application routes the request to the `router.post("/register")` handler in the `Auth Routes`.
- The `Auth Routes` handler validates the request body against the `userRegisterSchema` using `jsonschema`.
- If the validation fails, the handler returns a 400 Bad Request status to the client.
- If the validation succeeds, the handler calls the `User.register` method with the provided user details and `isAdmin` set to `false`.
- The `User.register` method checks for username duplication in the database.
- The database returns the duplicate check result to the `User.register` method.
- If no duplication is found, the `User.register` method inserts the new user into the database.
- The database returns the inserted user details to the `User.register` method.
- The `User.register` method returns the user object to the `Auth Routes` handler.
- The `Auth Routes` handler calls the `createToken` function to create a JWT token for the new user.
- The `createToken` function returns the JWT token to the `Auth Routes` handler.
- The `Auth Routes` handler returns the JWT token to the client in the response.

[Back to TOC](#routes-folder-file-notesexplanationsdiagrams)

#### auth.js code overview

This file contains the routes for handling authentication in the Jobly application.

1. Imports and Setup

- `jsonschema`: Library for validating JSON objects against a schema.
- `User`: The `User` model for interacting with the `users` table.
- `express`: The main framework used to build the web server.
- `createToken`: Function to create JSON Web Tokens (JWT).
- `userAuthSchema`, `userRegisterSchema`: JSON schemas for validating user authentication and registration data.
- `BadRequestError`: Custom error class for handling bad requests.

```javascript
"use strict";

const jsonschema = require("jsonschema");
const User = require("../models/user");
const express = require("express");
const router = new express.Router();
const { createToken } = require("../helpers/tokens");
const userAuthSchema = require("../schemas/userAuth.json");
const userRegisterSchema = require("../schemas/userRegister.json");
const { BadRequestError } = require("../expressError");
```

2. Route: `POST /auth/token`

- Validates the request body against the `userAuthSchema`.
- Authenticates the user with the provided username and password.
- Creates a JWT token for the authenticated user.
- Returns the token in the response.

```javascript
router.post("/token", async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, userAuthSchema);
    if (!validator.valid) {
      const errs = validator.errors.map((e) => e.stack);
      throw new BadRequestError(errs);
    }

    const { username, password } = req.body;
    const user = await User.authenticate(username, password);
    const token = createToken(user);
    return res.json({ token });
  } catch (err) {
    return next(err);
  }
});
```

3. Route: `POST /auth/register`

- Validates the request body against the `userRegisterSchema`.
- Registers a new user with the provided data.
- Creates a JWT token for the new user.
- Returns the token in the response.

```javascript
router.post("/register", async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, userRegisterSchema);
    if (!validator.valid) {
      const errs = validator.errors.map((e) => e.stack);
      throw new BadRequestError(errs);
    }

    const newUser = await User.register({ ...req.body, isAdmin: false });
    const token = createToken(newUser);
    return res.status(201).json({ token });
  } catch (err) {
    return next(err);
  }
});
```

4. Export the Router:

```javascript
module.exports = router;
```

[Back to TOC](#routes-folder-file-notesexplanationsdiagrams)

### companies.js

#### companies.js sequence diagram

```mermaid
sequenceDiagram
    participant Client
    participant App
    participant Router as Companies Router
    participant Company
    participant DB

    Client->>App: [Company Creation] POST /companies
    App->>Router: router.post("/")
    Router->>jsonschema: jsonschema.validate(req.body, companyNewSchema)
    jsonschema-->>Router: Return validation result
    alt Validation fails
        Router-->>App: Return 400 Bad Request
        App-->>Client: Return response with 400 status
    else Validation succeeds
        Router->>Company: Company.create(req.body)
        Company->>DB: INSERT INTO companies (new company)
        DB-->>Company: Return inserted company details
        Company-->>Router: Return company object
        Router-->>App: Return company object
        App-->>Client: Return response with company details
    end

    Client->>App: [Retrieve All Companies] GET /companies
    App->>Router: router.get("/")
    Router->>Company: Company.findAll()
    Company->>DB: SELECT * FROM companies
    DB-->>Company: Return all companies
    Company-->>Router: Return list of companies
    Router-->>App: Return list of companies
    App-->>Client: Return response with companies

    Client->>App: [Retrieve Company by Handle] GET /companies/:handle
    App->>Router: router.get("/:handle")
    Router->>Company: Company.get(req.params.handle)
    Company->>DB: SELECT * FROM companies WHERE handle = $1
    DB-->>Company: Return company details
    alt Company not found
        Company-->>Router: Throw NotFoundError
        Router-->>App: Return 404 Not Found
        App-->>Client: Return response with 404 status
    else
        Company-->>Router: Return company object
        Router-->>App: Return company object
        App-->>Client: Return response with company details
    end

    Client->>App: [Update Company] PATCH /companies/:handle
    App->>Router: router.patch("/:handle")
    Router->>jsonschema: jsonschema.validate(req.body, companyUpdateSchema)
    jsonschema-->>Router: Return validation result
    alt Validation fails
        Router-->>App: Return 400 Bad Request
        App-->>Client: Return response with 400 status
    else Validation succeeds
        Router->>Company: Company.update(req.params.handle, req.body)
        Company->>DB: UPDATE companies SET ... WHERE handle = $1 RETURNING handle, name, description, num_employees AS "numEmployees", logo_url AS "logoUrl"
        DB-->>Company: Return updated company details
        alt Company not found
            Company-->>Router: Throw NotFoundError
            Router-->>App: Return 404 Not Found
            App-->>Client: Return response with 404 status
        else
            Company-->>Router: Return updated company object
            Router-->>App: Return updated company object
            App-->>Client: Return response with updated company details
        end
    end

    Client->>App: [Delete Company] DELETE /companies/:handle
    App->>Router: router.delete("/:handle")
    Router->>Company: Company.remove(req.params.handle)
    Company->>DB: DELETE FROM companies WHERE handle = $1 RETURNING handle
    DB-->>Company: Return deleted company handle
    alt Company not found
        Company-->>Router: Throw NotFoundError
        Router-->>App: Return 404 Not Found
        App-->>Client: Return response with 404 status
    else
        Company-->>Router: Return deleted company handle
        Router-->>App: Return deleted company handle
        App-->>Client: Return response with deletion confirmation
    end
```

[Back to TOC](#routes-folder-file-notesexplanationsdiagrams)

#### companies.js diagram explanation

1. Company Creation (`POST /companies`):

- The client sends a POST request to the `/companies` endpoint with the company data.
- The Express application routes the request to the `router.post("/")` handler in the `Companies Router`.
- The `Companies Router` handler validates the request body against the `companyNewSchema` using `jsonschema`.
  - If the validation fails, the handler returns a 400 Bad Request status to the client.
  - If the validation succeeds, the handler calls the `Company.create` method with the provided company data.
- The `Company.create` method inserts the new company into the database and returns the company details.
- The `Companies Router` handler returns the company details to the client in the response.

2. Retrieve All Companies (`GET /companies`):

- The client sends a GET request to the `/companies` endpoint.
- The Express application routes the request to the `router.get("/")` handler in the `Companies Router`.
- The `Companies Router` handler calls the `Company.findAll` method.
- The `Company.findAll` method retrieves all companies from the database and returns them.
- The `Companies Router` handler returns the list of companies to the client in the response.

3. Retrieve Company by Handle (`GET /companies/:handle`):

- The client sends a GET request to the `/companies/:handle` endpoint with the company handle.
- The Express application routes the request to the `router.get("/:handle")` handler in the `Companies Router`.
- The `Companies Router` handler calls the `Company.get` method with the provided handle.
- The `Company.get `method retrieves the company details from the database.
  - If the company is not found, the `Company.get` method throws a `NotFoundError`.
- The `Companies Router` handler returns the company details to the client in the response.

4. Update Company (`PATCH /companies/:handle`):

- The client sends a PATCH request to the `/companies/:handle` endpoint with the company handle and update data.
- The Express application routes the request to the `router.patch("/:handle")` handler in the `Companies Router`.
- The `Companies Router` handler validates the request body against the `companyUpdateSchema` using `jsonschema`.
  - If the validation fails, the handler returns a 400 Bad Request status to the client.
  - If the validation succeeds, the handler calls the `Company.update` method with the provided handle and update data.
- The `Company.update` method updates the company details in the database and returns the updated details.
  - If the company is not found, the `Company.update` method throws a NotFoundError.
- The `Companies Router` handler returns the updated company details to the client in the response.

5. Delete Company (`DELETE /companies/:handle`):

- The client sends a DELETE request to the `/companies/:handle` endpoint with the company handle.
- The Express application routes the request to the `router.delete("/:handle")` handler in the `Companies Router`.
- The `Companies Router` handler calls the `Company.remove` method with the provided handle.
- The `Company.remove` method deletes the company from the database and returns the deleted handle.
  - If the company is not found, the `Company.remove` method throws a `NotFoundError`.
- The `Companies Router` handler returns the deletion confirmation to the client in the response.

[Back to TOC](#routes-folder-file-notesexplanationsdiagrams)

#### companies.js code overview

This file contains the routes for handling company-related operations in the Jobly application.

1. Imports and Setup

- `jsonschema`: Library for validating JSON objects against a schema.
- `express`: The main framework used to build the web server.
- `BadRequestError`: Custom error class for handling bad requests.
- `ensureLoggedIn`: Middleware to ensure the user is logged in.
- `Company`: The `Company` model for interacting with the `companies` table.
- `companyNewSchema`, `companyUpdateSchema`: JSON schemas for validating company data.

```javascript
"use strict";

const jsonschema = require("jsonschema");
const express = require("express");

const { BadRequestError } = require("../expressError");
const { ensureLoggedIn } = require("../middleware/auth");
const Company = require("../models/company");

const companyNewSchema = require("../schemas/companyNew.json");
const companyUpdateSchema = require("../schemas/companyUpdate.json");

const router = new express.Router();
```

2. Route: `POST /companies`

- Validates the request body against the `companyNewSchema`.
- Creates a new company with the provided data.
- Returns the created company in the response.

```javascript
router.post("/", ensureLoggedIn, async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, companyNewSchema);
    if (!validator.valid) {
      const errs = validator.errors.map((e) => e.stack);
      throw new BadRequestError(errs);
    }

    const company = await Company.create(req.body);
    return res.status(201).json({ company });
  } catch (err) {
    return next(err);
  }
});
```

3. Route: `GET /companies`

- Retrieves all companies from the database.
- Returns the list of companies in the response.

```javascript
router.get("/", async function (req, res, next) {
  try {
    const companies = await Company.findAll();
    return res.json({ companies });
  } catch (err) {
    return next(err);
  }
});
```

4. Route: `GET /companies/:handle`

- Retrieves a company by its handle.
- Returns the company data in the response.

```javascript
router.get("/:handle", async function (req, res, next) {
  try {
    const company = await Company.get(req.params.handle);
    return res.json({ company });
  } catch (err) {
    return next(err);
  }
});
```

5. Route: `PATCH /companies/:handle`

- Validates the request body against the `companyUpdateSchema`.
- Updates the company data with the provided fields.
- Returns the updated company data in the response.

```javascript
router.patch("/:handle", ensureLoggedIn, async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, companyUpdateSchema);
    if (!validator.valid) {
      const errs = validator.errors.map((e) => e.stack);
      throw new BadRequestError(errs);
    }

    const company = await Company.update(req.params.handle, req.body);
    return res.json({ company });
  } catch (err) {
    return next(err);
  }
});
```

6. Route: `DELETE /companies/:handle`

- Deletes a company by its handle.
- Returns a confirmation message in the response.

```javascript
router.delete("/:handle", ensureLoggedIn, async function (req, res, next) {
  try {
    await Company.remove(req.params.handle);
    return res.json({ deleted: req.params.handle });
  } catch (err) {
    return next(err);
  }
});
```

7. Export the Router:

```javascript
module.exports = router;
```

[Back to TOC](#routes-folder-file-notesexplanationsdiagrams)

### users.js

#### users.js sequence diagram

```mermaid
sequenceDiagram
    participant Client
    participant App
    participant Router as Users Router
    participant User
    participant DB

    Client->>App: [User Creation] POST /users
    App->>Router: router.post("/")
    Router->>jsonschema: jsonschema.validate(req.body, userNewSchema)
    jsonschema-->>Router: Return validation result
    alt Validation fails
        Router-->>App: Return 400 Bad Request
        App-->>Client: Return response with 400 status
    else Validation succeeds
        Router->>User: User.register(req.body)
        User->>DB: INSERT INTO users (new user)
        DB-->>User: Return inserted user details
        User-->>Router: Return user object
        Router->>createToken: createToken(user)
        createToken-->>Router: Return JWT token
        Router-->>App: Return user object and token
        App-->>Client: Return response with user details and token
    end

    Client->>App: [Retrieve All Users] GET /users
    App->>Router: router.get("/")
    Router->>User: User.findAll()
    User->>DB: SELECT * FROM users
    DB-->>User: Return all users
    User-->>Router: Return list of users
    Router-->>App: Return list of users
    App-->>Client: Return response with users

    Client->>App: [Retrieve User by Username] GET /users/:username
    App->>Router: router.get("/:username")
    Router->>User: User.get(req.params.username)
    User->>DB: SELECT * FROM users WHERE username = $1
    DB-->>User: Return user details
    alt User not found
        User-->>Router: Throw NotFoundError
        Router-->>App: Return 404 Not Found
        App-->>Client: Return response with 404 status
    else
        User-->>Router: Return user object
        Router-->>App: Return user object
        App-->>Client: Return response with user details
    end

    Client->>App: [Update User] PATCH /users/:username
    App->>Router: router.patch("/:username")
    Router->>jsonschema: jsonschema.validate(req.body, userUpdateSchema)
    jsonschema-->>Router: Return validation result
    alt Validation fails
        Router-->>App: Return 400 Bad Request
        App-->>Client: Return response with 400 status
    else Validation succeeds
        Router->>User: User.update(req.params.username, req.body)
        User->>DB: UPDATE users SET ... WHERE username = $1 RETURNING username, first_name AS "firstName", last_name AS "lastName", email, is_admin AS "isAdmin"
        DB-->>User: Return updated user details
        alt User not found
            User-->>Router: Throw NotFoundError
            Router-->>App: Return 404 Not Found
            App-->>Client: Return response with 404 status
        else
            User-->>Router: Return updated user object
            Router-->>App: Return updated user object
            App-->>Client: Return response with updated user details
        end
    end

    Client->>App: [Delete User] DELETE /users/:username
    App->>Router: router.delete("/:username")
    Router->>User: User.remove(req.params.username)
    User->>DB: DELETE FROM users WHERE username = $1 RETURNING username
    DB-->>User: Return deleted user handle
    alt User not found
        User-->>Router: Throw NotFoundError
        Router-->>App: Return 404 Not Found
        App-->>Client: Return response with 404 status
    else
        User-->>Router: Return deleted user handle
        Router-->>App: Return deleted user handle
        App-->>Client: Return response with deletion confirmation
    end
```

[Back to TOC](#routes-folder-file-notesexplanationsdiagrams)

#### users.js diagram explanation

**Explanation of Each Step**

1. User Creation (`POST /users`):

- The client sends a POST request to the `/users` endpoint with the user data.
- The Express application routes the request to the `router.post("/")` handler in the `Users Router`.
- The `Users Router` handler validates the request body against the `userNewSchema` using `jsonschema`.
  - If the validation fails, the handler returns a 400 Bad Request status to the client.
  - If the validation succeeds, the handler calls the `User.register` method with the provided user data.
- The `User.register` method inserts the new user into the database and returns the user details.
- The `Users Router` handler calls the `createToken` function to create a JWT token for the new user.
- The `createToken` function returns the JWT token to the `Users Router` handler.
- The `Users Router` handler returns the user details and token to the client in the response.

2. Retrieve All Users (`GET /users`):

- The client sends a GET request to the `/users` endpoint.
- The Express application routes the request to the `router.get("/")` handler in the `Users Router`.
- The `Users Router` handler calls the `User.findAll` method.
- The `User.findAll` method retrieves all users from the database and returns them.
- The `Users Router` handler returns the list of users to the client in the response.

3. Retrieve User by Username (`GET /users/:username`):

- The client sends a GET request to the `/users/:username` endpoint with the username.
- The Express application routes the request to the `router.get("/:username")` handler in the `Users Router`.
- The `Users Router` handler calls the `User.get` method with the provided username.
- The `User.get` method retrieves the user details from the database.
  - If the user is not found, the `User.get` method throws a `NotFoundError`.
- The `Users Router` handler returns the user details to the client in the response.

4. Update User (`PATCH /users/:username`):

- The client sends a PATCH request to the `/users/:username` endpoint with the username and update data.
- The Express application routes the request to the `router.patch("/:username")` handler in the `Users Router`.
- The `Users Router` handler validates the request body against the `userUpdateSchema` using `jsonschema`.
  - If the validation fails, the handler returns a 400 Bad Request status to the client.
  - If the validation succeeds, the handler calls the `User.update` method with the provided username and update data.
- The `User.update` method updates the user details in the database and returns the updated details.
  - If the user is not found, the `User.update` method throws a `NotFoundError`.
- The `Users Router` handler returns the updated user details to the client in the response.

5. Delete User (`DELETE /users/:username`):

- The client sends a DELETE request to the `/users/:username` endpoint with the username.
- The Express application routes the request to the `router.delete("/:username")` handler in the `Users Router`.
- The `Users Router` handler calls the `User.remove` method with the provided username.
- The `User.remove` method deletes the user from the database and returns the deleted handle.
  - If the user is not found, the `User.remove` method throws a `NotFoundError`.
- The `Users Router` handler returns the deletion confirmation to the client in the response.

[Back to TOC](#routes-folder-file-notesexplanationsdiagrams)

#### users.js code overview

This file contains the routes for handling user-related operations in the Jobly application.

1. Imports and Setup

- `jsonschema`: Library for validating JSON objects against a schema.
- `express`: The main framework used to build the web server.
- `ensureLoggedIn`: Middleware to ensure the user is logged in.
- `BadRequestError`: Custom error class for handling bad requests.
- `User`: The `User` model for interacting with the `users` table.
- `createToken`: Function to create JSON Web Tokens (JWT).
- `userNewSchema`, `userUpdateSchema`: JSON schemas for validating user data.

```javascript
"use strict";

const jsonschema = require("jsonschema");
const express = require("express");
const { ensureLoggedIn } = require("../middleware/auth");
const { BadRequestError } = require("../expressError");
const User = require("../models/user");
const { createToken } = require("../helpers/tokens");
const userNewSchema = require("../schemas/userNew.json");
const userUpdateSchema = require("../schemas/userUpdate.json");

const router = express.Router();
```

2. Route: `POST /users`

- Validates the request body against the `userNewSchema`.
- Registers a new user with the provided data.
- Creates a JWT token for the new user.
- Returns the new user and token in the response.

```javascript
router.post("/", ensureLoggedIn, async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, userNewSchema);
    if (!validator.valid) {
      const errs = validator.errors.map((e) => e.stack);
      throw new BadRequestError(errs);
    }

    const user = await User.register(req.body);
    const token = createToken(user);
    return res.status(201).json({ user, token });
  } catch (err) {
    return next(err);
  }
});
```

3. Route: `GET /users`

- Retrieves all users from the database.
- Returns the list of users in the response.

```javascript
router.get("/", ensureLoggedIn, async function (req, res, next) {
  try {
    const users = await User.findAll();
    return res.json({ users });
  } catch (err) {
    return next(err);
  }
});
```

4. Route: `GET /users/:username`

- Retrieves a user by their username.
- Returns the user data in the response.

```javascript
router.get("/:username", ensureLoggedIn, async function (req, res, next) {
  try {
    const user = await User.get(req.params.username);
    return res.json({ user });
  } catch (err) {
    return next(err);
  }
});
```

5. Route: `PATCH /users/:username`

- Validates the request body against the userUpdateSchema.
- Updates the user data with the provided fields.
- Returns the updated user data in the response.

```javascript
router.patch("/:username", ensureLoggedIn, async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, userUpdateSchema);
    if (!validator.valid) {
      const errs = validator.errors.map((e) => e.stack);
      throw new BadRequestError(errs);
    }

    const user = await User.update(req.params.username, req.body);
    return res.json({ user });
  } catch (err) {
    return next(err);
  }
});
```

6. Route: `DELETE /users/:username`

- Deletes a user by their username.
- Returns a confirmation message in the response.

```javascript
router.delete("/:username", ensureLoggedIn, async function (req, res, next) {
  try {
    await User.remove(req.params.username);
    return res.json({ deleted: req.params.username });
  } catch (err) {
    return next(err);
  }
});
```

7. Export the Router:

```javascript
module.exports = router;
```

[Back to TOC](#routes-folder-file-notesexplanationsdiagrams)
