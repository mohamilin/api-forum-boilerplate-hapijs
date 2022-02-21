const CommentRepository = require('../../Domains/comments/CommentRepository');
const AddedComment = require('../../Domains/comments/entities/AddedComment');
const GetComment = require('../../Domains/comments/entities/GetComment');

const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');

class CommentRepositoryPostgres extends CommentRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addComment(newComment) {
    const id = `comment-${this._idGenerator()}`;
    const date = new Date().toISOString();
    const query = {
      text: 'INSERT INTO comments VALUES($1, $2, $3, $4, $5) RETURNING id, content, thread_id, owner',
      values: [
        id,
        newComment.content,
        newComment.threadId,
        newComment.owner,
        date,
      ],
    };
    const result = await this._pool.query(query);
    const data = {
      threadId: result.rows[0].thread_id,
      ...result.rows[0],
    };

    return new AddedComment(data);
  }

  async verifyAvailableComment(commentId) {
    const query = {
      text: 'SELECT id FROM comments WHERE ID = $1',
      values: [commentId],
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError(`Comment id ${commentId} tidak ditemukan`);
    }
  }

  async verifyOwnerComment({ owner, commentId }) {
    const query = {
      text: 'SELECT id from comments WHERE owner = $1 AND id = $2',
      values: [owner, commentId],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new AuthorizationError('Komentar bukan milik anda');
    }
  }

  async deleteComment({ commentId }) {
    const query = {
      text: 'UPDATE comments SET is_delete = true WHERE id = $1',
      values: [commentId],
    };

    await this._pool.query(query);
  }

  async getCommentWithThread(threadId) {
    const query = {
      text: `SELECT comments.*, users.username
      FROM comments LEFT JOIN users ON users.id = comments.owner
      WHERE comments.thread_id = $1
      ORDER BY date ASC`,
      values: [threadId],
    };

    const result = await this._pool.query(query);
    return result.rows.map((item) => new GetComment(item));
  }
}

module.exports = CommentRepositoryPostgres;
