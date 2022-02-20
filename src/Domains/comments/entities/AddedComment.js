class AddedComment {
  constructor(payload) {
    this._verifyPayload(payload);
    const {
      id, content, threadId, owner,
    } = payload;
    this.id = id;
    this.content = content;
    this.threadId = threadId;
    this.owner = owner;
  }

  _verifyPayload({
    id, content, threadId, owner,
  }) {
    if (!id || !content || !threadId || !owner) {
      throw new Error('COMMENT.NOT_CONTAIN_NEEDED');
    }
    if (
      typeof id !== 'string'
      || typeof content !== 'string'
      || typeof threadId !== 'string'
      || typeof owner !== 'string'
    ) {
      throw new Error('COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = AddedComment;
