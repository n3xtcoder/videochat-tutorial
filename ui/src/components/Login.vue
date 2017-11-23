<template>
  <div class="form">
      <el-row type="flex" justify="center">
        <el-col :span="6" :offset="0">
          <div>
            <el-form :model="validateForm" ref="validateForm" label-width="120px" class="demo-dynamic">
              <el-form-item
                prop="user"
                label="User"
              >
                <el-input @keyup.13.native="submitForm('validateForm')" v-model="validateForm.user"></el-input>
              </el-form-item>
              <el-form-item
                prop="password"
                label="Password"
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
        const params = new URLSearchParams();
        params.append('username', this.validateForm.user);
        params.append('password', this.validateForm.password);
        if (valid) {
          console.log('valid...');
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
