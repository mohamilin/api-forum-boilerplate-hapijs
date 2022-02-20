const ThreadRepository = require("../ThreadRepository");

describe("ThreadRepository domains interface", () => {
  it("should throw error when invoke abstract behavior", async () => {
    const threadRepository = new ThreadRepository();

    // Action and Assert
    await expect(threadRepository.addThread("")).rejects.toThrowError(
      "THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED"
    );
    await expect(
      threadRepository.verifyAvailableThread("")
    ).rejects.toThrowError("THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED");
  });
});
