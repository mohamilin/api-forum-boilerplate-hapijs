// Layer Infrastructures
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');
// DB
const pool = require('../../database/postgres/pool');
// Layer Domains
const AddedThread = require('../../../Domains/threads/entities/AddedThread');
const NewThread = require('../../../Domains/threads/entities/NewThread');
// Layer Commons / Handle error
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
// test
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');

describe('ThreadRepositoryPostgres interface', () => {
  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTableThread();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('function addThread', () => {
    it('should persist add thread', async () => {
      await UsersTableTestHelper.addUser({
        id: 'user-123',
        username: 'dicoding',
      });
      const createThread = new NewThread({
        title: 'dicoding',
        body: 'secret_password',
        owner: 'user-123',
      });
      const fakeIdGenerator = () => '543';
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(
        pool,
        fakeIdGenerator,
      );

      // Action
      await threadRepositoryPostgres.addThread(createThread);

      // Assert
      const threads = await ThreadsTableTestHelper.getThreadById('thread-543');
      expect(threads).toHaveLength(1);
    });
    it('should correctly thread', async () => {
      //   Arrange
      const payload = {
        title: 'lorem ipsum ',
        body: 'description lorem ipsum',
        owner: 'user-123',
      };
      const { title, body, owner } = { ...payload };

      const newThread = new NewThread({ title, body, owner });
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      const fakeIdGenerator = () => '123';

      const threadRepositoryPostgres = new ThreadRepositoryPostgres(
        pool,
        fakeIdGenerator,
      );
      const addedThread = await threadRepositoryPostgres.addThread(newThread);
      expect(addedThread).toStrictEqual(
        new AddedThread({
          id: 'thread-123',
          title: newThread.title,
          owner: newThread.owner,
        }),
      );
    });
  });

  describe('verifyAvailableThread function', () => {
    it('verifyAvailableThread : threadId not found', async () => {
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});
      await expect(
        threadRepositoryPostgres.verifyAvailableThread('thread-1234sds'),
      ).rejects.toThrow(NotFoundError);
    });

    it('verifyAvailableThread : should return get thread id correctly', async () => {
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({
        id: 'thread-123',
        title: 'Title thread',
        body: 'description thread',
        owner: 'user-123',
      });
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});
      await expect(
        threadRepositoryPostgres.verifyAvailableThread('thread-123'),
      ).resolves.not.toThrowError(NotFoundError);
    });
  });

  describe('getThreadById function', () => {
    it('should correctly get thread by id', async () => {
      await UsersTableTestHelper.addUser({
        id: 'user-123',
        username: 'amilin',
      });

      await ThreadsTableTestHelper.addThread({
        id: 'thread-123',
        title: 'Title 123',
        body: 'Body thread',
        owner: 'user-123',
      });
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});
      const threads = await threadRepositoryPostgres.getThreadById(
        'thread-123',
      );
      expect(threads.id).toEqual('thread-123');
      expect(threads.username).toEqual('amilin');
      expect(threads.title).toEqual('Title 123');
      expect(threads.body).toEqual('Body thread');
      expect(threads.date).toBeDefined();
    });
  });
});
