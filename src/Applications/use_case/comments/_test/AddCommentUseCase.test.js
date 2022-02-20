const AddCommentUseCase = require('../AddCommentUseCase');
const AddedComment = require('../../../../Domains/comments/entities/AddedComment');
const NewComment = require('../../../../Domains/comments/entities/NewComment');
const CommentRepository = require('../../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../../Domains/threads/ThreadRepository');

describe('AddCommentUseCase interface', () => {
  it('should orchestrating the add thread action correctly', async () => {
    const credential = { id: 'user-123' };
    const useCasePayload = {
      content: 'content comment-1234',
      threadId: 'thread-123',
      userId: credential.id,
    };

    const expectedAddComment = new AddedComment({
      id: 'comment-123',
      content: useCasePayload.content,
      threadId: useCasePayload.threadId,
      owner: credential.id,
    });

    const { content, threadId, userId: owner } = useCasePayload;

    /** creating dependency of use case */
    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();

    /** mocking needed function */
    mockCommentRepository.addComment = jest.fn(() => Promise.resolve(expectedAddComment));

    mockThreadRepository.verifyAvailableThread = jest
      .fn()
      .mockImplementation(() => Promise.resolve());

    /** creating use case instance */

    const getCommentUseCase = new AddCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // action
    const commentRepository = await getCommentUseCase.execute(useCasePayload);
    expect(commentRepository).toStrictEqual(expectedAddComment);
    expect(mockThreadRepository.verifyAvailableThread).toBeCalledWith(threadId);
    expect(mockCommentRepository.addComment).toBeCalledWith(
      new NewComment({ content, threadId, owner }),
    );
  });
});
