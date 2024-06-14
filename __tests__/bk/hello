// test.test.ts ファイル


// jest.mock('../src/pages/api/testC', () => {
//   const originalModule = jest.requireActual('../src/pages/api/testC');

//   //Mock the default export and named export 'foo'

//   const retObject = {
//     __esModule: true,
//     ...originalModule,
//     mTest3: jest.fn(() => 'テスト')
//   };

//   return retObject;
// });

jest.mock('../src/pages/api/testC', () => {
    const originalModule = jest.requireActual('../src/pages/api/testC');
  
    //Mock the default export and named export 'foo'
  
    const retObject = {
      __esModule: true,
      ...originalModule
    };
  
    retObject.testC.prototype.mTest3 = jest.fn(() => 'テスト');

    return retObject;
  });
  

// testC モジュールをモックする
// jest.mock('../src/pages/api/testC', () => {
//     return {
//       testC: jest.fn().mockImplementation(() => ({
//         mTest3: jest.fn().mockReturnValue('モックされたテスト3')
//       }))
//     };
//   });


import { testC33 } from '../src/pages/api/testC3';

describe('test class', () => {
    test('test class instantiation', () => {
        // test クラスのインスタンス化

        expect(testC33()).toEqual('testtestmTest2テスト');
    });
});


