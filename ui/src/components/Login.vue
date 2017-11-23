<template>
  <div class="form">
      <el-row type="flex" justify="center">
        <el-col :span="6" :offset="0">
          <div>
            <el-form :model="validateForm" ref="validateForm" label-width="120px" class="demo-dynamic">
              <el-form-item
                prop="user"
                label="User"
                :rules="[
          { required: true, message: 'Please input your username', trigger: 'blur' },
          { min: 3, message: 'Username should have a length of at least 3', trigger: 'blur' }
        ]"
              >
                <el-input @keyup.13.native="submitForm('validateForm')" v-model="validateForm.user"></el-input>
              </el-form-item>
              <el-form-item
                prop="password"
                label="Password"
                :rules="[
          { required: true, message: 'Please input your password', trigger: 'blur' },
          { min: 6, message: 'Username should have a length of at least 6', trigger: 'blur' }
        ]"
              >
                <el-input @keyup.enter.native="submitForm('validateForm')"  type="password" v-model="validateForm.password"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="submitForm('validateForm')">Submit</el-button>
                <el-button @click="resetForm('validateForm')">Reset</el-button>
              </el-form-item>
            </el-form>
          </div>
        </el-col>
      </el-row>
  </div>
</template>
<script>
import axios from 'axios';
import router from '@/router';

export default {
  name: 'login',
  data() {
    return {
      validateForm: {
        user: '',
        password: '',
      },
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        const data = {
          username: this.validateForm.user,
          password: this.validateForm.password,
        };
        if (valid) {
          axios.post('/api/user', data)
            // .then((response) => {
            .then(() => {
              // JSON responses are automatically parsed.
              console.log('Logged in');
              router.push('/');
            })
            .catch((e) => {
              console.log(e);
              const { response } = e;
              const loginErrorNotification = {
                title: 'Login Error',
                message: 'Cannot login. Try again',
                duration: 2000,
              };
              if (response && response.data && response.data.message) {
                loginErrorNotification.message = response.data.message;
              }
              this.$notify(loginErrorNotification);
            });
        }
        return false;
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
  },
};
</script>
<style scoped>
  .form {
    width: 100%;
    margin-top: 30px;
  }
  .el-row--flex.is-justify-center {
    margin-left: -150px;
  }
</style>
