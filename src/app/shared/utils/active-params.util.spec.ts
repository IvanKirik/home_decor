import {ActiveParamsUtil} from "./active-params.util";

describe('active params util', () => {
  it('should change type string to type array', () => {
      const result = ActiveParamsUtil.processParams({
        types: 'sukkulenti'
      });

      expect(result.types).toBeInstanceOf(Array);
  });

  it('should change page string to int', () => {
    const result = ActiveParamsUtil.processParams({
      page: '2'
    });

    expect(result.page).toBe(2);
  });

  it('should change page string to int', () => {
    const result = ActiveParamsUtil.processParams({
      types: 'sukkulenti',
      heightFrom: '1',
      heightTo: '1',
      diameterFrom: '1',
      diameterTo: '1',
      sort: '1',
      page: '2'
    });

    expect(result).toEqual({
      types: ['sukkulenti'],
      heightFrom: '1',
      heightTo: '1',
      diameterFrom: '1',
      diameterTo: '1',
      sort: '1',
      page: 2
    });
  });

  it('should change page string to int', () => {
    const result: any = ActiveParamsUtil.processParams({
      pages: '2'
    });

    expect(result.pages).toBeUndefined();
  });


});
