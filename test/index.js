const glob = require('glob-all');
const path = require('path');
// 检查是否生成必须的文件
describe('Checking generated lib files', () => {

  it('should generate lib/commonLibrary.dll.js', (done) => {
    const files = glob.sync([
      path.join(__dirname, '../lib') + '/commonLibrary.dll.js'
    ]);

    if (files.length > 0) {
      done();
    } else {
      throw new Error('no dll.js files generated!');
    }
  });

  it('should generate lib/commonLibrary.json', (done) => {
    const files = glob.sync([
      path.join(__dirname, '../lib') + '/commonLibrary.json'
    ]);

    if (files.length > 0) {
      done();
    } else {
      throw new Error('no json files generated!');
    }
  });

});
