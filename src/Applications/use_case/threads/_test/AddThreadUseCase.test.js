const AddThreadUseCase = require('../AddThreadUseCase');
const ThreadRepository = require('../../../../Domains/threads/ThreadRepository');
const AddedThread = require('../../../../Domains/threads/entities/AddedThread');
const NewThread = require('../../../../Domains/threads/entities/NewThread');

describe('AddThreadUseCase', () => {
  it('should orchestrating the add thread action correctly', async () => {
    //   Arrange
    const useCasePayload = {
      title: 'belajar coding',
      body: 'lorem ipsum lorem ipsum lorem ipsum lorem ipsum',
    };
    const credential = { id: 'user-123' };

    const expectedAddThread = new AddedThread({
      id: 'thread-123',
      title: useCasePayload.title,
      owner: credential.id,
    });

    const { owner, title } = expectedAddThread;
    const { body } = useCasePayload;

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();

    /** mocking needed function */
    mockThreadRepository.addThread = jest
      .fn()
      .mockImplementation(() => Promise.resolve(expectedAddThread));
    /** creating use case instance */
    const getThreadUseCase = new AddThreadUseCase({
      threadRepository: mockThreadRepository,
    });

    // Action
    const threadRepository = await getThreadUseCase.execute(
      useCasePayload,
      credential,
    );

    // Assert
    expect(threadRepository).toStrictEqual(expectedAddThread);
    expect(mockThreadRepository.addThread).toBeCalledWith(
      new NewThread({ owner, title, body }),
    );
  });
});
