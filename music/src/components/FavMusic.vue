<template>
<div class="FavMusic">
    <!--   <router-link :to="{path:'/FavMusic/DetailPlayList',query:{playListId:favId}}"> </router-link>-->
    <router-view></router-view>
</div>
</template>

<script>
export default {
    data() {
        return {
            favId: '', //获取歌单ID
        }
    },
    watch: {
        favId() {

        }
    },
    created() {
        this.$axios({
            url: '/user/playlist',
            method: 'get',
            withCredentials: true, //关键,用来解决跨域的
            params: {
                uid: JSON.parse(window.localStorage.getItem('userInfo')).userId
            }
        }).then(res => {
            this.favId = res.data.playlist[0].id
            if (this.favId != '') {
                this.$router.push({
                    path: '/FavMusic/DetailPlayList',
                    query: {
                        playListId: this.favId
                    }
                })
            }
        })

    }
}
</script>
