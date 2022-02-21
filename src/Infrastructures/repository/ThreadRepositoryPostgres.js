const ThreadRepository = require('../../Domains/threads/ThreadRepository');
const AddedThread = require('../../Domains/threads/entities/AddedThread');
const GetThread = require('../../Domains/threads/entities/GetThread');

const NotFoundError = require('../../Commons/exceptions/NotFoundError');

class ThreadRepositoryPostgres extends ThreadRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addThread(newThread) {
    const id = `thread-${this._idGenerator()}`;
    const date = new Date().toISOString();
    const query = {
      text: 'INSERT INTO threads VALUES($1,$2,$3,$4,$5) RETURNING id, title, body, owner',
      values: [id, newThread.title, newThread.body, newThread.owner, date],
    };

    const result = await this._pool.query(query);
    return new AddedThread({ ...result.rows[0] });
  }

  async verifyAvailableThread(threadId) {
    const query = {
      text: 'SELECT threads.* FROM threads WHERE id = $1',
      values: [threadId],
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError(`threadId ${threadId} tidak ditemukan`);
    }
  }

  async getThreadById(threadId) {
    const query = {
      text: `SELECT 
      threads.id,
      username,
      title,
      body,
      date
     FROM threads
     JOIN users ON threads.owner = users.id
     WHERE threads.id = $1`,
      values: [threadId],
    };

    const result = await this._pool.query(query);
    return new GetThread({ ...result.rows[0] });
  }
}

module.exports = ThreadRepositoryPostgres;
