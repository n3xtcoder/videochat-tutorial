import { mount } from 'vue-test-utils';

import Video from '@/components/Video';

describe('Video.vue', () => {
  let w;

  beforeEach(() => {
    w = mount(Video);
  });

  it('contains local media element', () => {
    expect(w.contains('div#local-media')).toBe(true);
  });

  it('contains buttons', () => {
    const buttons = w.findAll('b-button');

    const startPreviewBtn = buttons.at(0);
    expect(startPreviewBtn.text()).toEqual('Preview My Camera');
    expect(startPreviewBtn.hasAttribute('size', 'sm')).toBe(true);
    expect(startPreviewBtn.hasAttribute('variant', 'primary')).toBe(true);

    const stopPreviewBtn = buttons.at(1);
    expect(stopPreviewBtn.text()).toEqual('Stop preview');
    expect(stopPreviewBtn.hasAttribute('size', 'sm')).toBe(true);
    expect(stopPreviewBtn.hasAttribute('variant', 'danger')).toBe(true);

    const joinRoomBtn = buttons.at(2);
    expect(joinRoomBtn.text()).toEqual('Join');
    expect(joinRoomBtn.hasAttribute('size', 'sm')).toBe(true);
    expect(joinRoomBtn.hasAttribute('variant', 'success')).toBe(true);

    const leaveRoomBtn = buttons.at(3);
    expect(leaveRoomBtn.text()).toEqual('Leave');
    expect(leaveRoomBtn.hasAttribute('size', 'sm')).toBe(true);
    expect(leaveRoomBtn.hasAttribute('variant', 'danger')).toBe(true);
  });

  it('contains remote media element', () => {
    expect(w.contains('div#remote-media')).toBe(true);
  });

  it('contains alert', () => {
    const alert = w.find('b-alert');
    expect(alert.text()).toEqual('');
    expect(alert.hasAttribute('variant', 'danger')).toBe(true);
    expect(alert.hasAttribute('dismissible', '')).toBe(true);
  });

  it('contains chat messages element', () => {
    expect(w.contains('div#messages')).toBe(true);
  });

  it('contains chat input element', () => {
    const chatInput = w.find('input#chat-input');
    expect(chatInput.hasAttribute('type', 'text')).toBe(true);
    expect(chatInput.hasAttribute('placeholder', 'say anything')).toBe(true);
  });
});
