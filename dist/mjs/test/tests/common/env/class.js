/* eslint-disable no-new,new-cap */
describe('common > env > modules', function () {
  it('class', function () {
    class x {}

    new x();

    class y extends x {}

    new y();

    class z extends y {}

    new z();
  });
});