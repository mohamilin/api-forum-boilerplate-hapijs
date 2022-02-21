const NewThread = require('../../../Domains/threads/entities/NewThread');

class AddThreadUseCase {
  constructor({ threadRepository }) {
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload, credential) {
    const { title, body } = useCasePayload;
    const owner = credential.id;
    const newThread = new NewThread({ owner, title, body });
    return this._threadRepository.addThread(newThread);
  }
}

module.exports = AddThreadUseCase;
