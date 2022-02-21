class GetThreadByIdUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(threadId) {
    await this._threadRepository.verifyAvailableThread(threadId);
    const thread = await this._threadRepository.getThreadById(threadId);
    const comment = await this._commentRepository.getCommentWithThread(
      threadId,
    );

    thread.comments = comment.map((item) => ({
      ...item,
      content: item.is_delete ? '**komentar telah dihapus**' : item.content,
    }));
    return thread;
  }
}

module.exports = GetThreadByIdUseCase;
