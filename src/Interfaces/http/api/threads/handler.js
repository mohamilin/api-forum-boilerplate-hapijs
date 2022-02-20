const AddThreadUseCase = require("../../../../Applications/use_case/threads/AddThreadUseCase");

class ThreadHandler {
  constructor(container) {
    this._container = container;

    this.addThread = this.addThread.bind(this);
  }

  async addThread(request, h) {
    const useCasePayload = request.payload;
    const credential = request.auth.credentials;

    const postThread = this._container.getInstance(AddThreadUseCase.name);
    const addedThread = await postThread.execute(useCasePayload, credential);

    const response = h.response({
      status: "success",
      data: {
        addedThread,
      },
    });
    response.code(201);
    return response;
  }
}

module.exports = ThreadHandler;
