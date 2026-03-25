import syncronize from '../../utils/syncronizer';

describe('utility > syncronize', () => {
  it('should run without any params', () => {
    const { create: _create, update: _update, remove: _remove } = syncronize();

    //expect(true).to.equal(false);
  });
});
