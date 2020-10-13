<template>
<div class="recMusic">
    <div class="top">
        <div class="icon" @click="toDetail(titlelist.id)">
            <img :src="titlelist.coverImgUrl" alt="">
        </div>

        <div class="content">
            <div class="tag">精品歌单</div>
            <div class="title">{{titlelist.name}}</div>
            <div class="info">{{titlelist.description}}</div>
        </div>
        <img :src="titlelist.coverImgUrl" alt="" class="bg">
        <div class="bg-cover"></div>
    </div>
    <!--tap 部分-->
    <div class="tap-bar">
        <!--头部-->
        <div class="tb-header">
            <span @click="tag='全部'" :class="{active:tag=='全部'}">全部</span>
            <span @click="tag='欧美'" :class="{active:tag=='欧美'}">欧美</span>
            <span @click="tag='华语'" :class="{active:tag=='华语'}">华语</span>
            <span @click="tag='流行'" :class="{active:tag=='流行'}">流行</span>
            <span @click="tag='说唱'" :class="{active:tag=='说唱'}">说唱</span>
            <span @click="tag='摇滚'" :class="{active:tag=='摇滚'}">摇滚</span>
            <span @click="tag='民谣'" :class="{active:tag=='民谣'}">民谣</span>
            <span @click="tag='电子'" :class="{active:tag=='电子'}">电子</span>
            <span @click="tag='轻音乐'" :class="{active:tag=='轻音乐'}">轻音乐</span>
            <span @click="tag='影视原声'" :class="{active:tag=='影视原声'}">影视原声</span>
            <span @click="tag='ACG'" :class="{active:tag=='ACG'}">ACG</span>
            <span @click="tag='古风'" :class="{active:tag=='古风'}">古风</span>
            <span @click="tag='粤语'" :class="{active:tag=='粤语'}">粤语</span>
        </div>
        <div class="tb-body"></div>
        <!--内容-->
        <div class="recommend">
            <div class="items">
                <div class="item" v-for="(item,i) in lists" :key="i" @click="toDetail(item.id)">
                    <div class="img-wrap">
                        <img :src="item.coverImgUrl" alt="">
                        <div class="black-cover"></div>
                        <div class="cover-play ">
                            <span class="iconfont icon-earphone"></span>
                            <span class="playcount">{{item.playCount |formatPlayCount}}</span>
                        </div>
                    </div>
                    <p>{{item.name}}</p>
                </div>

            </div>
        </div>
    </div>
    <!--分页器-->
    <div class="fy">
        <el-pagination background layout="prev, pager, next" :total="total" @current-change="handleCurrentChange" :page-size="limit" :current-page='page'>
        </el-pagination>
    </div>
</div>
</template>

<script>
export default {
    data() {
        return {
            tag: "全部",
            titlelist: [], //头部歌单
            lists: [], //精品歌单列表
            total: 0,
            limit: 25,
            page: 1
        }
    },
    watch: {
        tag() {
            this.getTitle()
            this.getPalyList()
            this.page = 1
        }
    },
    methods: {
        handleCurrentChange(val) {
            // console.log(`当前页: ${val}`);
            this.page = val
            this.getTitle()
            this.getPalyList()
        },
        toDetail(id) {
            this.$router.push({
                path: '/DetailPlayList',
                query: {
                    playListId: id
                }
            })
        },
        //头部精品歌单
        getTitle() {
            this.$axios({
                method: 'get',
                url: '/top/playlist/highquality/',
                params: {
                    limit: 2,
                    cat: this.tag
                }
            }).then(res => {
                this.titlelist = res.data.playlists[1]
            })
            this.$axios.get('/playlist/catlist').then(res => {

                console.log(res)
            })
        },
        //歌单列表
        getPalyList() {
            this.$axios({
                method: 'get',
                url: '/top/playlist/',
                params: {
                    limit: this.limit,
                    cat: this.tag,
                    offset: (this.page - 1) * this.limit
                }
            }).then(res => {
                this.lists = res.data.playlists

                this.total = res.data.total

                // console.log(res)
            })
        }
    },
    created() {
        //头部精品歌单
        this.getTitle()
        //歌单列表
        this.getPalyList()
    }
}
</script>

<style scoped>
.recMusic {
    position: relative;
}

.top {
    position: relative;
    display: flex;
    height: 180px;
    padding: 20px;
    overflow: hidden;
    border-radius: 5px;
}

.top .icon {
    z-index: 1;
}

.top .icon img {
    width: 180px;
    border-radius: 4px;
    cursor: pointer;
}

.top .content {
    z-index: 1;
    margin-left: 20px;
    height: 100%;
}

.top .content .tag {
    display: inline-block;
    padding: 3px 10px;
    color: rgb(230, 175, 23);
    border: 2px solid rgb(230, 175, 23);
}

.top .content .title {
    font-size: 1.3rem;
    color: white;
    margin: 11px 0 5px 0;
}

.content .info {
    color: rgb(207, 207, 207);
    -webkit-line-clamp: 5;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.top .bg {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 0;
    filter: blur(25px);
}

.top .bg-cover {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 0;
    background-color: rgba(0, 0, 0, 0.3);
}

/*tap头部*/

.tap-bar {
    margin-top: 30px;
}

.tb-header span {
    display: inline-block;
    padding: 10px 10px 15px 10px;
    cursor: pointer;
    color: rgb(127, 127, 129);
}

.tap-bar .active {
    color: rgb(224, 126, 21);
}

/**列表 */
.recommend .items {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
}

.item {
    width: 18%;
    padding: 10px 5px;
}

.item>p {
    padding-top: 5px;
    font-size: 0.9rem;
}

.item .img-wrap {
    position: relative;
    overflow: hidden;
    cursor: pointer;
}

.item .img-wrap .black-cover {
    position: absolute;
    top: 0;
    left: 0;
    height: 2rem;
    width: 100%;
    background-color: rgba(8, 8, 8, 0.1);
    border-radius: 0.5rem 0.5rem 0 0;
}

.item .img-wrap img {
    width: 100%;
    height: 100%;
    border-radius: 0.4rem;

}

.cover-play {
    position: absolute;
    top: 0;
    right: 0;
    color: white;
    padding: 5px;

}

.cover-play span {
    font-size: 1rem;
    padding: 0 2px;
}

/**分页器 */

.fy {
    display: flex;
    justify-content: center;
    margin-top: 30px;
}

.recMusic>>>.el-pagination.is-background .el-pager li:not(.disabled) {
    background-color: rgb(244, 244, 245);
    color: rgb(0, 0, 0);
}

.recMusic>>>.el-pagination.is-background .el-pager li:not(.disabled):hover {
    color: rgb(255, 189, 7);

}

.recMusic>>>.el-pagination.is-background .el-pager li:not(.disabled).active {
    background-color: rgb(230, 175, 23);
    color: white;
}
</style>
