import { expect } from 'chai';
import syncronize from '../../utils/syncronizer';

describe('utility > syncronize', () => {
  it('should run without any params', () => {

    const { create, update, remove } = syncronize();

    //expect(true).to.equal(false);
  });
  
});
