const AddedComment = require('../AddedComment');

describe('AddedThread entities', () => {
  it('should throw error when paylod not contain property', () => {
    //   Arrange
    const payload = {};

    // Action and assert
    expect(() => new AddedComment(payload)).toThrowError(
      'COMMENT.NOT_CONTAIN_NEEDED',
    );
  });

  it('should throw error when paylod not meet data specification', () => {
    const payload = {
      id: true,
      content: 123,
      threadId: true,
      owner: 123,
    };

    expect(() => new AddedComment(payload)).toThrowError('COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should correctly', () => {
    const payload = {
      id: 'comment-123',
      content: 'content-123',
      threadId: 'thread-123',
      owner: 'user-123',
    };

    const newComment = new AddedComment(payload);

    expect(newComment.owner).toEqual(payload.owner);
  });
});
