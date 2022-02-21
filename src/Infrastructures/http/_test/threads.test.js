const pool = require('../../database/postgres/pool');
const container = require('../../container');
const createServer = require('../createServer');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const AuthenticationsTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper');

describe('/threads endpoint', () => {
  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTableThread();
    await UsersTableTestHelper.cleanTable();
    await AuthenticationsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  const dataUser = {
    username: 'amilin',
    password: 'password',
    fullname: 'Moh Amilin',
  };

  beforeEach(async () => {
    const server = await createServer(container);
    await server.inject({
      method: 'POST',
      url: '/users',
      payload: {
        username: dataUser.username,
        password: dataUser.password,
        fullname: dataUser.fullname,
      },
    });

    const response = await server.inject({
      method: 'POST',
      url: '/authentications',
      payload: {
        username: dataUser.username,
        password: dataUser.password,
      },
    });

    const { data } = JSON.parse(response.payload);
    dataUser.accessToken = data.accessToken;
  });
  describe('when POST thread', () => {
    it('addThread throw error 403 with have not token', async () => {
      const reqBody = {
        title: 'Title lorem',
        body: 'description lorem ipsum',
      };

      const server = await createServer(container);
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: reqBody,
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(401);
      expect(responseJson.message).toEqual('Missing authentication');
      expect(responseJson).toBeDefined();
    });

    it('addThread throw error 403 with bad payload', async () => {
      const reqBody = {
        title: 'Title lorem',
      };

      const server = await createServer(container);
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: reqBody,
        headers: {
          Authorization: `Bearer ${dataUser.accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.message).toEqual(
        'tidak dapat membuat thread baru karena properti yang dibutuhkan tidak ada',
      );
      expect(responseJson).toBeDefined();
    });

    it('addThread throw error 403 with type data not specification', async () => {
      const reqBody = {
        title: true,
        body: 123,
      };

      const server = await createServer(container);
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: reqBody,
        headers: {
          Authorization: `Bearer ${dataUser.accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.message).toEqual(
        'tidak dapat membuat thread baru karena tipe data tidak sesuai',
      );
      expect(responseJson).toBeDefined();
    });

    it('addThread correctly', async () => {
      const reqBody = {
        title: 'Title lorem',
        body: 'description lorem ipsum',
      };

      const server = await createServer(container);
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        headers: {
          Authorization: `Bearer ${dataUser.accessToken}`,
        },
        payload: reqBody,
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedThread).toBeDefined();
      expect(responseJson.data.addedThread.title).toEqual(reqBody.title);
    });
  });
});
