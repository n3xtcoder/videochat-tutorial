import Vue from 'vue';
import { mount } from 'vue-test-utils'

import LoginForm from '@/components/LoginForm';

describe('LoginForm.vue', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(LoginForm);
  });

  it('contains heading with "Login" text', () => {
    expect(wrapper.find('h2').text()).toEqual('Login');
  });

  it('contains input element for the username', () => {
    const usernameField = wrapper.find('b-form-input[name="username"]');
    expect(usernameField.exists()).toBe(true);
    expect(usernameField.hasAttribute('type', 'text')).toBe(true);
  });

  it('contains input element for the password', () => {
    const passwordField = wrapper.find('b-form-input[name="password"]')
    expect(passwordField.exists()).toBe(true);
    expect(passwordField.hasAttribute('type', 'password')).toBe(true);
  });

  it('contains a submit button', () => {
    expect(wrapper.contains('b-button[type="submit"]')).toBe(true);
  });
});
