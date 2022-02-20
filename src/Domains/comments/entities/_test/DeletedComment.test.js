const DeletedComment = require('../DeletedComment');

describe('DeletedComment entities', () => {
  it('should throw error when payload not contain property', () => {
    const payload = {
      threadId: 'thread-124',
      commentId: '',
    };

    expect(() => new DeletedComment(payload)).toThrowError(
      'DELETE_COMMENT.NOT_CONTAIN_NEEDED',
    );
  });

  it('should throw error when payload not meet data specifications', () => {
    const payload = {
      threadId: 'thread-124',
      commentId: 'comment-123',
      owner: true,
    };

    expect(() => new DeletedComment(payload)).toThrowError(
      'DELETE_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION',
    );
  });

  it('should throw error when payload not meet data specifications', () => {
    const payload = {
      threadId: 'thread-124',
      commentId: 'comment-123',
      owner: 'user-123',
    };

    const deleteComment = new DeletedComment(payload);
    expect(deleteComment.owner).toEqual(payload.owner);
  });
});
