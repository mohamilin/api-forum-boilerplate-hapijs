const NewComment = require('../NewComment');

describe('NewComment Entities', () => {
  it('should throw error when payload not contain property', () => {
    //   Arrange
    const payload = {};

    // Action and assert
    expect(() => new NewComment(payload)).toThrowError(
      'COMMENT.NOT_CONTAIN_NEEDED',
    );
  });

  it('should throw error when payload not meet data specification ', () => {
    // Arrange
    const payload = {
      content: true,
      threadId: 232,
      owner: 123,
    };

    expect(() => new NewComment(payload)).toThrowError(
      'COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION',
    );
  });

  it('should correctly ', () => {
    // Arrange
    const payload = {
      content: 'comment-123',
      threadId: 'thread-123',
      owner: 'user-123',
    };

    const newComment = new NewComment(payload);

    expect(newComment.content).toEqual(payload.content);
    expect(newComment.threadId).toEqual(payload.threadId);
    expect(newComment.owner).toEqual(payload.owner);
  });
});
