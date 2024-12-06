"use strict";

const db = require("../db.js");
const { BadRequestError, NotFoundError } = require("../expressError");
const Job = require("./job.js");
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

/************************************** create */

describe("create", function () {
    const newJob = {
        title: "New Job",
        salary: 100000,
        equity: 0.1,
        companyHandle: "c1",
    };

    test("works", async function () {
        let job = await Job.create(newJob);
        expect(job).toEqual({
            id: expect.any(Number),
            title: "New Job",
            salary: 100000,
            equity: "0.1",
            companyHandle: "c1",
        });

        const result = await db.query(
            `SELECT id, title, salary, equity, company_handle
           FROM jobs
           WHERE title = 'New Job'`);
        expect(result.rows).toEqual([
            {
                id: expect.any(Number),
                title: "New Job",
                salary: 100000,
                equity: "0.1",
                company_handle: "c1",
            },
        ]);
    });

    test("bad request with dupe", async function () {
        try {
            await Job.create(newJob);
            await Job.create(newJob);
            fail();
        } catch (err) {
            expect(err instanceof BadRequestError).toBeTruthy();
        }
    });
});

/************************************** findAll */

describe("findAll", function () {
    test("works: no filter", async function () {
        let jobs = await Job.findAll();
        expect(jobs).toEqual([
            {
                id: 1001,
                title: "Job1",
                salary: 50000,
                equity: "0.05",
                companyHandle: "c1",
            },
            {
                id: 1002,
                title: "Job2",
                salary: 60000,
                equity: "0",
                companyHandle: "c2",
            },
            {
                id: 1003,
                title: "Job3",
                salary: 70000,
                equity: "0.1",
                companyHandle: "c3",
            },
        ]);
    });

    test("works: minSalary filter", async function () {
        let jobs = await Job.findAll({ minSalary: 60000 });
        expect(jobs).toEqual([
            {
                id: 1002,
                title: "Job2",
                salary: 60000,
                equity: "0",
                companyHandle: "c2",
            },
            {
                id: 1003,
                title: "Job3",
                salary: 70000,
                equity: "0.1",
                companyHandle: "c3",
            },
        ]);
    });

    test("works: hasEquity filter", async function () {
        let jobs = await Job.findAll({ hasEquity: true });
        expect(jobs).toEqual([
            {
                id: 1001,
                title: "Job1",
                salary: 50000,
                equity: "0.05",
                companyHandle: "c1",
            },
            {
                id: 1003,
                title: "Job3",
                salary: 70000,
                equity: "0.1",
                companyHandle: "c3",
            },
        ]);
    });

    test("works: titleLike filter", async function () {
        let jobs = await Job.findAll({ titleLike: "Job" });
        expect(jobs).toEqual([
            {
                id: 1001,
                title: "Job1",
                salary: 50000,
                equity: "0.05",
                companyHandle: "c1",
            },
            {
                id: 1002,
                title: "Job2",
                salary: 60000,
                equity: "0",
                companyHandle: "c2",
            },
            {
                id: 1003,
                title: "Job3",
                salary: 70000,
                equity: "0.1",
                companyHandle: "c3",
            },
        ]);
    });

    test("works: multiple filters", async function () {
        let jobs = await Job.findAll({ minSalary: 60000, hasEquity: true, titleLike: "Job" });
        expect(jobs).toEqual([
            {
                id: 1003,
                title: "Job3",
                salary: 70000,
                equity: "0.1",
                companyHandle: "c3",
            },
        ]);
    });

    test("returns empty if no match", async function () {
        let jobs = await Job.findAll({ minSalary: 100000 });
        expect(jobs).toEqual([]);
    });
});

/************************************** get */

describe("get", function () {
    test("works", async function () {
        let job = await Job.get(1001);
        expect(job).toEqual({
            id: 1001,
            title: "Job1",
            salary: 50000,
            equity: "0.05",
            companyHandle: "c1",
        });
    });

    test("not found if no such job", async function () {
        try {
            await Job.get(9999);
            fail();
        } catch (err) {
            expect(err instanceof NotFoundError).toBeTruthy();
        }
    });
});

/************************************** update */

describe("update", function () {
    const updateData = {
        title: "Updated Job",
        salary: 80000,
        equity: 0.2,
    };

    test("works", async function () {
        let job = await Job.update(1001, updateData);
        expect(job).toEqual({
            id: 1001,
            title: "Updated Job",
            salary: 80000,
            equity: "0.2",
            companyHandle: "c1",
        });

        const result = await db.query(
            `SELECT id, title, salary, equity, company_handle
           FROM jobs
           WHERE id = 1001`);
        expect(result.rows).toEqual([{
            id: 1001,
            title: "Updated Job",
            salary: 80000,
            equity: "0.2",
            company_handle: "c1",
        }]);
    });

    test("works: null fields", async function () {
        const updateDataSetNulls = {
            title: "Updated Job",
            salary: null,
            equity: null,
        };

        let job = await Job.update(1001, updateDataSetNulls);
        expect(job).toEqual({
            id: 1001,
            title: "Updated Job",
            salary: null,
            equity: null,
            companyHandle: "c1",
        });

        const result = await db.query(
            `SELECT id, title, salary, equity, company_handle
           FROM jobs
           WHERE id = 1001`);
        expect(result.rows).toEqual([{
            id: 1001,
            title: "Updated Job",
            salary: null,
            equity: null,
            company_handle: "c1",
        }]);
    });

    test("not found if no such job", async function () {
        try {
            await Job.update(9999, updateData);
            fail();
        } catch (err) {
            expect(err instanceof NotFoundError).toBeTruthy();
        }
    });

    test("bad request with no data", async function () {
        try {
            await Job.update(1001, {});
            fail();
        } catch (err) {
            expect(err instanceof BadRequestError).toBeTruthy();
        }
    });
});

/************************************** remove */

describe("remove", function () {
    test("works", async function () {
        await Job.remove(1001);
        const res = await db.query(
            "SELECT id FROM jobs WHERE id=1001");
        expect(res.rows.length).toEqual(0);
    });

    test("not found if no such job", async function () {
        try {
            await Job.remove(9999);
            fail();
        } catch (err) {
            expect(err instanceof NotFoundError).toBeTruthy();
        }
    });
}); 