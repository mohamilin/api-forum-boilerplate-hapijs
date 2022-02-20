const NewComment = require('../../../Domains/comments/entities/NewComment');

class AddCommentUseCase {
  constructor({ commentRepository, threadRepository }) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload) {
    const { content, threadId, userId } = useCasePayload;
    await this._threadRepository.verifyAvailableThread(threadId);
    const newComment = new NewComment({ content, threadId, owner: userId });
    return this._commentRepository.addComment(newComment);
  }
}

module.exports = AddCommentUseCase;
