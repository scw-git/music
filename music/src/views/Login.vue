<template>
<div class="login">
    <div class="cover" ref="cover" @click="close"></div>
    <div class="loginDiv" ref="loginDiv">
        <span @click="close">×</span>
        <img src="../assets/Login.png" alt="">
        <form @submit.prevent='login'>
            <div class="info">
                <div class="number"><input required v-model="phone" type="text" placeholder="请输入手机号"></div>
                <div class="password"><input required @keydown.enter="login" v-model="password" type="text" placeholder="请输入密码"></div>
            </div>
            <div class="btn"><button type="submit">登录</button></div>
        </form>
    </div>
</div>
</template>

<script>
export default {
    data() {
        return {
            phone: '',
            password: '',
            userInfo: window.localStorage.getItem('userInfo') === 'null' ? null : JSON.parse(window.localStorage.getItem(userInfo)), //存储用户信息
        }
    },
    // watch: {
    //     userInfo() {
    //         //把用户信息传到header组件中
    //         this.$vue.$emit('userInfo', this.userInfo)
    //     }
    // },
    mounted() {
        //打开登录窗口
        this.$vue.$on('openLogin', (res => {
            if (res == true) {
                this.$refs.loginDiv.style.display = 'block'
                this.$refs.cover.style.display = 'block'
            }
        }))
    },
    methods: {
        //关闭登录窗口
        close() {
            this.$refs.loginDiv.style.display = 'none'
            this.$refs.cover.style.display = 'none'
        },
        //登录
        login() {
            this.$axios({
                url: '/login/cellphone',
                method: 'post',
                withCredentials: true, //关键,用来解决跨域的
                params: {
                    phone: this.phone,
                    password: this.password,

                }
            }).then(res => {
                if (res.status != 200) {
                    alert('登录失败，请检查账号密码！！') //其实这里永远执行不了
                } else {

                    //保存cookie信息
                    window.localStorage.setItem('musicCookie', res.data.cookie)
                    //保存用户信息到本地，JSON.stringify把对象转换成json字符串
                    window.localStorage.setItem('userInfo', JSON.stringify(res.data.profile))
                    //存储用户信息，后面会用到。必须有这步，虽然能从本地存储拿到，但要手动刷新一次。
                    this.userInfo = res.data.profile
                    // 把用户信息传到header组件中
                    this.$vue.$emit('userInfo', this.userInfo)
                    this.close() //关闭登录框
                }
                console.log(res)
            })

        }
    },
}
</script>

<style lang="less">
.login {

    .cover {
        position: fixed;
        display: none;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(3, 3, 3, 0.4);
        z-index: 99999;
    }

    .loginDiv {
        border-radius: 8px;
        display: none;
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 350px;
        height: 480px;
        z-index: 999999;
        background-color: #fafafa;

        span {
            position: absolute;
            top: 0px;
            right: 10px;
            font-size: 1.5rem;
            color: #999999;
            cursor: pointer;

            &:hover {
                color: rgb(34, 34, 34);
            }
        }

        img {
            width: 100%;
            margin-top: 60px;
        }

        .info {
            margin: 20px 50px 0;

            input {
                box-sizing: border-box;
                width: 100%;
                padding: 10px 10px;
                outline: none;
                border: 1px solid #dedede;
                border-radius: 5px;
            }

            .password {
                margin-top: 10px;
            }
        }

        .btn {
            margin: 5px 50px;
        }

        .btn button {
            margin-top: 30px;
            width: 100%;
            border: 0;
            color: white;
            padding: 15px 0;
            border-radius: 5px;
            background-color: #ea4848;
            outline: none;
            cursor: pointer;

            &:hover {
                background-color: #c72e2e;
            }
        }
    }
}
</style>
