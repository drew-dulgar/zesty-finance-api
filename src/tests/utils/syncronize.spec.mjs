import { expect } from 'chai';
import syncronize from '../../utils/syncronize.mjs';

describe('utility > syncronize', () => {
  it('should run without any params', () => {

    const { create, update, remove } = syncronize();

    //expect(true).to.equal(false);
  });
  
});
