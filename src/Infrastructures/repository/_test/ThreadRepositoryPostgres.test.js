// Layer Infrastructures
const ThreadRepositoryPostgres = require("../ThreadRepositoryPostgres");
// DB
const pool = require("../../database/postgres/pool");
// Layer Domains
const AddedThread = require("../../../Domains/threads/entities/AddedThread");
const NewThread = require("../../../Domains/threads/entities/NewThread");
// Layer Commons / Handle error
const NotFoundError = require("../../../Commons/exceptions/NotFoundError");
// test
const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");

describe("ThreadRepositoryPostgres interface", () => {
  beforeAll(async () => {
    await UsersTableTestHelper.addUser({ id: "user-123", username: "amilin" });
  });
  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTableThread();
  });

  afterAll(async () => {
    await ThreadsTableTestHelper.cleanTableThread();
    await UsersTableTestHelper.cleanTable();
    await pool.end();
  });

  describe("function addThread", () => {
    it("should persist create thread", async () => {
      //   Arrange
      const newThread = new NewThread({
        title: "lorem ipsum ",
        body: "description lorem ipsum",
        owner: "user-123",
      });

      const fakeIdGenerator = () => "123";

      const threadRepositoryPostgres = new ThreadRepositoryPostgres(
        pool,
        fakeIdGenerator
      );
      await threadRepositoryPostgres.addThread(newThread);
      const threads = await ThreadsTableTestHelper.getThreadById("thread-123");
      expect(threads).toHaveLength(1);
    });

    it("should creare thread correctly", async () => {
      //   Arrange
      const newThread = new NewThread({
        title: "lorem ipsum ",
        body: "description lorem ipsum",
        owner: "user-123",
      });

      const fakeIdGenerator = () => "234";

      const threadRepositoryPostgres = new ThreadRepositoryPostgres(
        pool,
        fakeIdGenerator
      );
      const addedThread = await threadRepositoryPostgres.addThread(newThread);
      expect(addedThread).toStrictEqual(
        new AddedThread({
          id: "thread-234",
          title: "lorem ipsum ",
          owner: "user-123",
        })
      );
    });
  });

  describe("verifyAvailableThread function", () => {
    it("verifyAvailableThread : threadId not found", async () => {
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});
      await expect(
        threadRepositoryPostgres.verifyAvailableThread("thread-1234sds")
      ).rejects.toThrow(NotFoundError);
    });

    it("verifyAvailableThread : should return get thread id correctly", async () => {
      await ThreadsTableTestHelper.addThread({
        id: "thread-123",
        title: "Title thread",
        body: "description thread",
        owner: "user-123",
      });
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});
      await expect(
        threadRepositoryPostgres.verifyAvailableThread("thread-123")
      ).resolves.not.toThrowError(NotFoundError);
    });
  });
});
