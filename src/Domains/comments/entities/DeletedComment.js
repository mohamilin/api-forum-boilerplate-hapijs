class DeletedComment {
  constructor(payload) {
    this._verifyPayload(payload);
    const { threadId, commentId, owner } = payload;
    this.threadId = threadId;
    this.commentId = commentId;
    this.owner = owner;
  }

  _verifyPayload({ threadId, commentId, owner }) {
    if (!threadId || !commentId || !owner) {
      throw new Error('DELETE_COMMENT.NOT_CONTAIN_NEEDED');
    }
    if (
      typeof threadId !== 'string'
      || typeof commentId !== 'string'
      || typeof owner !== 'string'
    ) {
      throw new Error('DELETE_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = DeletedComment;
