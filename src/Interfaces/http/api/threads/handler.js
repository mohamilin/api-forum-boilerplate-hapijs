const AddThreadUseCase = require('../../../../Applications/use_case/threads/AddThreadUseCase');
const GetDetailThreadUsecase = require('../../../../Applications/use_case/threads/GetDetailThreadUsecase');

class ThreadHandler {
  constructor(container) {
    this._container = container;

    this.addThread = this.addThread.bind(this);
    this.getDetailThread = this.getDetailThread.bind(this);
  }

  async addThread(request, h) {
    const useCasePayload = request.payload;
    const credential = request.auth.credentials;

    const postThread = this._container.getInstance(AddThreadUseCase.name);
    const addedThread = await postThread.execute(useCasePayload, credential);

    const response = h.response({
      status: 'success',
      data: {
        addedThread,
      },
    });
    response.code(201);
    return response;
  }

  async getDetailThread(request, h) {
    const { threadId } = request.params;
    const getDetailThread = this._container.getInstance(
      GetDetailThreadUsecase.name,
    );
    const thread = await getDetailThread.execute(threadId);
    const response = h.response({
      status: 'success',
      data: {
        thread,
      },
    });
    response.code(200);
    return response;
  }
}

module.exports = ThreadHandler;
