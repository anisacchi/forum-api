const AddThread = require('../../Domains/threads/entities/AddThread');

class AddThreadUseCase {
  constructor({ threadRepository }) {
    this._threadRepository = threadRepository;
  }

  async execute(credentialId, payload) {
    const addThread = new AddThread(payload);
    return this._threadRepository.addThread(credentialId, addThread);
  }
}

module.exports = AddThreadUseCase;
