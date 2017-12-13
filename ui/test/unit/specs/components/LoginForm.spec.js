import { mount } from 'vue-test-utils';

import LoginForm from '@/components/LoginForm';
// for mocks
import auth from '@/auth';
import router from '@/router';


describe('LoginForm.vue', () => {
  let wrapper;

  const selector = {
    usernameInput: 'b-form-input[type="text"]',
    passwordInput: 'b-form-input[type="password"]',
    submitButton: 'b-button[type="submit"]',
    simpleButton: 'button.simple',
    form: 'b-form',
    errorMessage: 'b-alert',
  };

  describe('DOM elements are available', () => {
    beforeEach(() => {
      wrapper = mount(LoginForm);
    });

    it('contains heading with "Login" text', () => {
      expect(wrapper.find('h2').text()).toEqual('Login');
    });

    it('contains input element for the username', () => {
      expect(wrapper.contains(selector.usernameInput)).toBe(true);
    });

    it('contains input element for the password', () => {
      expect(wrapper.contains(selector.passwordInput)).toBe(true);
    });

    it('contains a submit button', () => {
      expect(wrapper.contains(selector.submitButton)).toBe(true);
    });

    it('contains block for displaying error messages', () => {
      expect(wrapper.contains(selector.errorMessage)).toBe(true);
    });
  });

  describe('form', () => {
    it('calls login method on submit', () => {
      wrapper = mount(LoginForm);
      wrapper.setMethods({ login: jest.fn() });
      wrapper.find(selector.form).trigger('submit');
      expect(wrapper.vm.login).toBeCalled();
    });
  });

  describe('login', () => {
    const username = 'username';
    const password = 'password';

    it('calls auth.authenticate if username and password is set', () => {
      auth.authenticate = jest.fn(() => Promise.resolve());
      wrapper = mount(LoginForm);
      wrapper.setData({ username, password });
      wrapper.vm.login();
      expect(auth.authenticate).toBeCalledWith(username, password);
    });

    it('calls router with push if authenticate promise resolves', async () => {
      auth.authenticate = jest.fn(() => Promise.resolve());
      router.push = jest.fn();
      wrapper = mount(LoginForm);
      wrapper.setData({ username, password });
      await wrapper.vm.login();
      expect(router.push).toBeCalledWith('/');
    });

    it('sets error message if authenticate promise rejects', async () => {
      auth.authenticate = jest.fn(() => Promise.reject('I am a teapot (418)'));
      wrapper = mount(LoginForm);
      wrapper.setData({ username, password });
      expect(wrapper.vm.error).toBe('');
      await wrapper.vm.login();
      expect(wrapper.vm.error).toBe('I am a teapot (418)');
    });

    it('does not call auth.authenticate username and password is not set', () => {
      auth.authenticate = jest.fn(() => Promise.resolve());
      wrapper = mount(LoginForm);
      wrapper.vm.login();
      expect(auth.authenticate).not.toBeCalled();
    });

    it('does not call auth.authenticate when username is not set', () => {
      auth.authenticate = jest.fn(() => Promise.resolve());
      wrapper = mount(LoginForm);
      wrapper.vm.login({ password });
      expect(auth.authenticate).not.toBeCalled();
    });

    it('does not call auth.authenticate when password is not set', () => {
      auth.authenticate = jest.fn(() => Promise.resolve());
      wrapper = mount(LoginForm);
      wrapper.vm.login({ username });
      expect(auth.authenticate).not.toBeCalled();
    });
  });
});
