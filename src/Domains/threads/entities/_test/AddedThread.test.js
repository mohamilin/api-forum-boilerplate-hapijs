const AddedThread = require("../AddedThread");

describe("AddedThread entities", () => {
  it("should throw err when payload not contain needed", () => {
    const payload = {
      id: "thread-123",
    };

    //  Action and assert
    expect(() => new AddedThread(payload)).toThrowError(
      "THREAD.NOT_CONTAIN_NEEDED"
    );
  });

  it("should throw err when paylod did not meet specification", () => {
    const payload = {
      id: true,
      title: 122,
      owner: 123,
    };
    expect(() => new AddedThread(payload)).toThrowError(
      "THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION"
    );
  });

  it("should addThread correctly", () => {
    const payload = {
      id: "thread-12",
      title: "lorep ipsum ipsum",
      owner: "user-134",
    };

    const addedThread = new AddedThread(payload);

    expect(addedThread.id).toEqual(payload.id);
  });
});
