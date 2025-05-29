import {sampleDataEnabledFn} from '@atoms/sampleDataEnabled'

describe('sampleDataEnabled', async () => {
  it('should return true by default', async () => {
    const sampleDataEnabled = await sampleDataEnabledFn();
    expect(sampleDataEnabled).toBe(true);
  })
})