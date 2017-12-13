import { mount } from 'vue-test-utils';

import Video from '@/components/Video';

describe('Video.vue', () => {
  let w;
  const mediaQuery = 'div.video > div.container-fluid > div.row';
  const controlQuery = 'div.video > div.container';

  beforeEach(() => {
    w = mount(Video);
  });

  it('contains local media elements', () => {
    console.log(w.html);
    const localMediaQuery = `${mediaQuery} > div.col-lg-4.align-self-start`;
    expect(w.contains(`${localMediaQuery} > div#local-media`)).toBe(true);
    const startPreviewBtn = w.find(`${localMediaQuery} > button.btn.btn-primary.btn-sm`);
    expect(startPreviewBtn.text()).to.equal('Preview My Camera');
    const stopPreviewBtn = w.find(`${localMediaQuery} > button.btn.btn-danger.btn-sm`);
    expect(stopPreviewBtn.text()).to.equal('Stop preview');
    expect(stopPreviewBtn.hasAttribute('style', 'display: none;')).toBe(true);
  });

  it('contains remote media elements', () => {
    expect(w.contains(`${mediaQuery} > div.col-lg-8.align-self-end > div#local-media`)).toBe(true);
  });

  it('renders alerts', () => {
    const alertQuery = `${controlQuery} > div.row > div.col > div.alert.alert-danger.alert-dismissible`;
    const expectedAlertText = 'Foo Alert';
    expect(w.contains(alertQuery)).toBe(false);

    w.setData({ alert: expectedAlertText });
    const alertElem = w.find(alertQuery);
    expect(alertElem.text()).to.equal(expectedAlertText);
    expect(alertElem.hasAttribute('aria-atomic', 'true')).toBe(true);
    expect(alertElem.hasAttribute('aria-live', 'polite')).toBe(true);
    expect(alertElem.hasAttribute('role', 'alert')).toBe(true);
  });

});
