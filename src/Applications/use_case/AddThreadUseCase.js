const AddThread = require('../../Domains/threads/entities/AddThread');

class AddThreadUseCase {
  constructor({ threadRepository }) {
    this._threadRepository = threadRepository;
  }

  async execute(userId, payload) {
    const addThread = new AddThread(payload);
    return this._threadRepository.addThread(userId, addThread);
  }
}

module.exports = AddThreadUseCase;
