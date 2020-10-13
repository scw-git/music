<template>
<div class="my-header">
    <div class="header">
        <div class="logo" @click="toFindMusic">
            <img src="../assets/logo.png" alt="">
            云音乐
        </div>
        <div class='input-search'>
            <span><input type="text" v-model="val" @keydown.enter="search"></span>
            <span class="iconfont icon-search search" @click="search"></span>
        </div>
        <div class="login">
            <img src="../assets/user.png" alt="">
            scw
        </div>
    </div>
    <div class="clear"></div>

</div>
</template>

<script>
export default {
    data() {
        return {
            val: '' //获取搜索的值
        }
    },
    methods: {
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
    right: 60px;
    color: white;
    font-size: 20px;
}

.login>img {
    height: 30px;
    vertical-align: middle;
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
