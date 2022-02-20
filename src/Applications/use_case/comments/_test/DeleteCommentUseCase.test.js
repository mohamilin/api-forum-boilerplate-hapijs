const DeletedCommentUseCase = require('../DeleteCommentUseCase');
const DeletedComment = require('../../../../Domains/comments/entities/DeletedComment');
const CommentRepository = require('../../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../../Domains/threads/ThreadRepository');

describe('first', () => {
  it('should orchestrating the add thread action correctly', async () => {
    const useCasePayload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      owner: 'user-123',
    };

    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();

    mockCommentRepository.verifyAvailableComment = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyOwnerComment = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockThreadRepository.verifyAvailableThread = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.deleteComment = jest
      .fn()
      .mockImplementation(() => Promise.resolve({ status: 'success' }));

    const deleteCommentUseCase = new DeletedCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    const deleteComment = await deleteCommentUseCase.execute(useCasePayload);
    expect(deleteComment).toStrictEqual({ status: 'success' });
    expect(mockCommentRepository.verifyAvailableComment).toBeCalledWith(
      useCasePayload.commentId,
    );
    expect(mockCommentRepository.verifyOwnerComment).toBeCalledWith({
      owner: useCasePayload.owner,
      commentId: useCasePayload.commentId,
    });
    expect(mockThreadRepository.verifyAvailableThread).toBeCalledWith(
      useCasePayload.threadId,
    );
  });
});
