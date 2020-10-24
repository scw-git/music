<template>
<div class="my-header cover">
    <div class="header">
        <div class="logo" @click="toFindMusic">
            <img src="../assets/logo.png" alt="">
            云音乐
        </div>
        <div class='input-search'>
            <span><input type="text" v-model="val" @keydown.enter="search"></span>
            <span class="iconfont icon-search search" @click="search"></span>
        </div>
        <div class="login" v-if="userInfo!==null" style="cursor:default">
            <img :src="userInfo.avatarUrl" alt="">
            {{userInfo.nickname}}
            <span class="iconfont icon-tuichu1 out" @click="outLogin"> 退出</span>
        </div>
        <div class="login " @click="login" v-if="userInfo===null">
            <img class="iconfont icon-login_zhanghu" src="" alt="">
            未登录

        </div>
    </div>
    <div class="clear"></div>

</div>
</template>

<script>
export default {
    data() {
        return {
            val: '', //获取搜索的值
            //JSON.parse()把字符串解析成对象，JSON.stringify()把对象解析成字符串
            userInfo: JSON.parse(window.localStorage.getItem('userInfo')), //存储用户信息
        }
    },
    mounted() {
        // 接收从Login组件传来的用户信息，第一次要用传过来的值。否则要点刷新才显示头像和名称
        //不用转成对象，因为传过来的就是对象。但从localStorage中读取的要转。
        this.$vue.$on('userInfo', (res => {
            this.userInfo = res
            console.log(res)
        }))

    },
    methods: {
        //退出登录
        outLogin() {
            //要用null，否则会有问题
            this.userInfo = null
            window.localStorage.setItem('userInfo', null)
        },
        toFindMusic() {
            this.$router.push({
                path: '/FindMusic',

            })
        },
        search() {
            if (this.val == '') {
                this.$message({
                    message: '请输入内容哦！！',
                    type: 'warning'
                });
            } else {

                this.$router.push({
                    path: '/SearchResult',
                    query: {
                        q: this.val
                    }
                })

            }
        },
        login() {
            this.$vue.$emit('openLogin', true)
        }
    },
}
</script>

<style scoped>
.clear {
    height: 60px;
}

.header {
    position: fixed;
    top: 0;
    left: 0;
    height: 60px;
    width: 100%;
    background-color: rgb(198, 47, 47);
    display: flex;
    align-items: center;
    z-index: 99999;
}

.header>span {
    line-height: 60px;
}

input {
    height: 25px;
    border: 0;
    padding: 0 12px;
    outline: none;
    color: rgb(236, 167, 162);
    background-color: rgb(168, 40, 40);
    border-radius: 25px;
    margin-left: 100px;

}

.search {
    position: absolute;
    color: rgb(195, 107, 107);
    right: 10px;
    top: 3px;
    cursor: pointer;
}

.search:hover {
    color: rgb(233, 201, 201);
}

.input-search {
    position: relative;

}

.login {
    position: absolute;
    cursor: pointer;
    right: 42px;
    color: #eec1c1;
    font-size: 0.8rem;
}

.login .out {
    margin-left: 0.5rem;

    background-color: rgb(202, 176, 176);
    padding: 7px;
    border-radius: 0.4rem;
    color: rgb(59, 59, 59);
    cursor: pointer;
}

.login .out:hover {
    background-color: rgb(231, 216, 216);
}

.login>img {
    height: 30px;
    vertical-align: middle;
    border-radius: 5rem;
    margin-right: 0.3rem;

}

.logo {
    margin-left: 20px;
    color: white;
    cursor: pointer;
}

.logo>img {
    vertical-align: middle;
    height: 28px;
    width: 28px;
    border-radius: 14px;
}
</style>
