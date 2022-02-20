const CommentRepository = require('../CommentRepository');

describe('comment repository interface', () => {
  it('should throw error when invoke abstract behavior', async () => {
    const newComment = new CommentRepository();
    await expect(newComment.addComment(' ')).rejects.toThrowError(
      'COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED',
    );
    await expect(newComment.verifyAvailableComment(' ')).rejects.toThrowError(
      'COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED',
    );
    await expect(newComment.verifyOwnerComment(' ')).rejects.toThrowError(
      'COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED',
    );
    await expect(newComment.deleteComment(' ')).rejects.toThrowError(
      'COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED',
    );
    await expect(newComment.getCommentWithThread(' ')).rejects.toThrowError(
      'COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED',
    );
  });
});
