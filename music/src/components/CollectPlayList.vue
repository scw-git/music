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
            show: true
        }
    },
    watch: {
        $route() {
            this.toDetailPlay()

        }
    },
    methods: {
        toDetailPlay() {
            this.favId = this.$route.query.playListId
            if (this.favId != '') {
                this.$router.push({
                    path: '/CollectPlayList/DetailPlayList',
                    query: {
                        playListId: this.favId
                    }
                })
            }
        }
    },
    created() {
        this.toDetailPlay()
        // console.log(this.$route.query.playListId)
    }
}
</script>
