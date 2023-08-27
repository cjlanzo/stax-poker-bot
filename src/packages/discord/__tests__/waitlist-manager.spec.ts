import { addToWaitList, waitListManager } from '../waitlist-manager';

jest.mock('../../waitlist');

// figure these out
describe('waitListManager', () => {
  describe('addToWaitList', () => {
    describe('given the waitlist already contains the user', () => {
      it('should reply that the user is already on the waitlist', async () => {
        addToWaitList;
      });
    });
  });
});
