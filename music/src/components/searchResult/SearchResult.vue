<template>
<div class="SearchResult">
    <div class="title">搜索<span style="color:rgb(118, 188, 224)">“{{this.$route.query.q}}”</span>，找到 {{this.total}} {{name}}</div>

    <!--搜索结果-->
    <div class="content">
        <el-tabs v-model="activeName">
            <!--单曲部分-->
            <el-tab-pane label="单曲" name="songs">
                <song-list :songs='songs' @playInfo='playInfo' />
                <!--分页器-->
                <div class="fy" v-if="total!=0">
                    <el-pagination background layout="prev, pager, next" :total="total" @current-change="handleCurrentChange" :page-size="limit" :current-page='page'>
                    </el-pagination>
                </div>
            </el-tab-pane>
            <!--歌单部分-->
            <el-tab-pane label="歌单" name="playlist">
                <!--歌单,因为用了推荐歌单的模板。所有类名有些奇怪-->
                <div class="recommend">
                    <div class="items">
                        <div class="item" v-for="(item,i) in playlists" :key="i" @click="toDetail(item.id)">
                            <div class="img-wrap">
                                <img :src="item.coverImgUrl" alt="">
                                <div class="cover-play-btn ">
                                    <div class="iconfont icon-play2"></div>
                                </div>
                                <div class="cover-content">
                                    <p>播放量：{{item.playCount |formatPlayCount}}</p>
                                </div>
                            </div>
                            <p>{{item.name}}</p>
                        </div>

                    </div>
                </div>
                <!--分页器-->
                <div class="fy" v-if="total!=0">
                    <el-pagination background layout="prev, pager, next" :total="total" @current-change="handleCurrentChange" :page-size="limit" :current-page='page'>
                    </el-pagination>
                </div>
            </el-tab-pane>
            <el-tab-pane label="MV" name="mv">
                <!-- MV-->
                <div class="wypublish">
                    <div class="items">
                        <div class="item" v-for="(item,i) in mv" :key="i" @click="toDetailMv(item.id)">
                            <div class="img-wrap">
                                <img :src="item.cover" alt="">
                                <div class="cover">
                                    <span class="iconfont icon-play2"></span>
                                    <span>{{item.playCount |formatPlayCount}}</span>
                                </div>
                            </div>
                            <div class="name">{{item.name}}</div>
                        </div>
                    </div>
                </div>
                <!--分页器-->
                <div class="fy" v-if="total!=0">
                    <el-pagination background layout="prev, pager, next" :total="total" @current-change="handleCurrentChange" :page-size="limit" :current-page='page'>
                    </el-pagination>
                </div>
            </el-tab-pane>
            <el-tab-pane label="视频" name="video">
                <!-- 视频-->
                <div class="wypublish">
                    <div class="items">
                        <div class="item" v-for="(item,i) in video" :key="i" @click="toDetailVideo(item.vid)">
                            <div class="img-wrap">
                                <img :src="item.coverUrl" alt="">
                                <div class="cover">
                                    <span class="iconfont icon-play2"></span>
                                    <span>{{item.playTime |formatPlayCount}}</span>
                                </div>
                            </div>
                            <div class="name">{{item.title}}</div>
                        </div>
                    </div>
                </div>
                <!--分页器-->
                <div class="fy" v-if="total!=0">
                    <el-pagination background layout="prev, pager, next" :total="total" @current-change="handleCurrentChange" :page-size="limit" :current-page='page'>
                    </el-pagination>
                </div>
            </el-tab-pane>
        </el-tabs>
    </div>
</div>
</template>

<script>
import songList from '../common/songList'
export default {
    components: {
        songList
    },
    data() {
        return {
            activeName: 'songs', //用于绑定默认显示哪个（现在默认显示第一个）
            total: 0, //歌曲总数
            songs: [], //歌曲
            playlists: [], //歌单
            mv: [], //MV
            video: [], //视频
            page: 1,
            limit: 30,
            name: '', //切换歌曲、歌单、mv时显示不同内容
            allId: [], //所以歌曲id
            index: -1, //不能一开始就是0，会把第一个变成红色。用来记录当前播放歌曲的索引号，以便把它变成红色
        }
    },
    mounted() {
        this.$vue.$on('index', (res) => { //接收一个函数，res中保存传过来的值
            this.index = res
            // console.log('fdgggs111')
        })

    },
    methods: {
        playInfo(res) { //接收从songLIst传来的值
            this.index = res.i
            this.play(res.id, res.i)
            // console.log(this.index)
        },
        handleCurrentChange(val) {
            // console.log(`当前页: ${val}`);
            this.page = val
            if (this.activeName == 'songs') {
                this.getSong() //点击页数，更新单曲
            } else if (this.activeName == 'playlist') {
                this.getPlayList() //更新歌单
            } else if (this.activeName == 'mv') {
                this.getMv() //更新mv
            } else if (this.activeName == 'video') {
                this.getVideo()
            }
            window.sessionStorage.setItem('SearchResultPage', this.page)

        },
        //  跳转到mv详情
        toDetailMv(id) {
            this.$router.push({
                path: '/DetailMv',
                query: {
                    mvId: id
                }
            })
        },
        //  跳转到视频详情
        toDetailVideo(vid) {
            this.$router.push({
                path: '/DetailVideo',
                query: {
                    vid: vid
                }
            })
        },
        //  跳转到歌单详情
        toDetail(id) {
            this.$router.push({
                path: '/DetailPlayList',
                query: {
                    playListId: id
                }
            })
        },
        play(id, i) {
            this.index = i //如果不加这个，第一个点击的不会变红
            this.$axios.get('/song/url?id=' + id).then(res => {
                this.$parent.url = res.data.data[0].url
                this.$parent.currentId = id
                this.$parent.index = i //用来记录当前播放歌曲的索引号，以便把它变成红色
                this.$parent.allSongsId = this.allId
                // console.log(res)
            })
        },
        getSong() { //获取单曲
            this.$axios({
                method: 'get',
                url: '/search',
                params: {
                    keywords: this.$route.query.q,
                    type: 1,
                    limit: this.limit,
                    offset: (this.page - 1) * this.limit
                }
            }).then(res => {
                this.songs = res.data.result.songs
                this.total = res.data.result.songCount

                for (let i = 0; i < this.songs.length; i++) {
                    this.allId.push(this.songs[i].id)
                }
                // console.log(this.allId)
            })
        },
        getPlayList() { //获取歌单
            this.$axios({
                method: 'get',
                url: '/search',
                params: {
                    keywords: this.$route.query.q,
                    type: 1000,
                    limit: this.limit,
                    offset: (this.page - 1) * this.limit
                }
            }).then(res => {
                this.playlists = res.data.result.playlists
                this.total = res.data.result.playlistCount

            })
        },
        getMv() { //获取mv
            this.$axios({
                method: 'get',
                url: '/search',
                params: {
                    keywords: this.$route.query.q,
                    type: 1004,
                    limit: 28,
                    offset: (this.page - 1) * this.limit
                }
            }).then(res => {
                this.total = res.data.result.mvCount
                this.mv = res.data.result.mvs
                // console.log(res)
            })
        },
        getVideo() { //获取视频
            this.$axios({
                method: 'get',
                url: '/search',
                params: {
                    keywords: this.$route.query.q,
                    type: 1014,
                    limit: 28,
                    offset: (this.page - 1) * this.limit
                }
            }).then(res => {
                this.total = res.data.result.videoCount
                this.video = res.data.result.videos
                // console.log(res)
            })
        }
    },
    created() {
        this.getSong() //一进来就获取歌曲
        if (window.sessionStorage.getItem('activeName')) {
            this.activeName = window.sessionStorage.getItem('activeName')
        }
        if (window.sessionStorage.getItem('SearchResultPage')) {
            this.page = window.sessionStorage.getItem('SearchResultPage')
        }
    },
    watch: {
        //监听路由变化，因为在result中在次搜索。不会刷新
        $route() {
            this.getSong() //更新单曲
            this.getPlayList() //更新歌单
            this.getMv() //更新mv
            this.page = 1 //让页码返回到第一页
        },
        // 监听是否切换了tap
        activeName() {
            window.sessionStorage.setItem('activeName', this.activeName)
            this.page = 1 //切换不同的分类时，把页数重置成1
            if (this.activeName == 'songs') {
                this.getSong() //调用歌曲的
                this.name = '首单曲'
            } else if (this.activeName == 'playlist') {
                this.getPlayList() //调用歌单的
                this.name = '个歌单'
            } else if (this.activeName == 'mv') {
                this.getMv() //调用mv的
                this.name = '个MV'
            } else if (this.activeName == 'video') {
                this.getVideo()
                this.name = '个视频'
            }

        }

    }
}
</script>

<style scoped>
.wypublish .items {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
}

.SearchResult {
    user-select: none;
    margin-top: 30px;
}

.SearchResult .title {
    font-size: 0.8rem;
}

.content>>>.el-tabs__active-bar {
    background-color: #c3473a;

}

.content>>>.el-tabs__item:hover,
.content>>>.el-tabs__item.is-active {
    color: #c3473a;
}

.content>>>.el-tabs__nav-scroll {
    display: flex;
    justify-content: center;

}

.content>>>.el-tabs__item {
    padding: 0 30px;
    font-size: 1rem;
}

.content>>>.el-pagination.is-background .el-pager li:not(.disabled) {
    background-color: rgb(244, 244, 245);
    color: rgb(0, 0, 0);
}

.content>>>.el-pagination.is-background .el-pager li:not(.disabled).active {
    background-color: rgb(230, 175, 23);
    color: white;
}

.content>>>.el-pagination.is-background .el-pager li:not(.disabled):hover {
    color: rgb(255, 189, 7);

}

.fy {
    display: flex;
    justify-content: center;
    margin-top: 20px;
}

/**公共属性开始(歌单和mv都用到了) */
.SearchResult .item {
    width: 18%;
    padding: 10px 5px;
}

.SearchResult .item>p {
    padding-top: 5px;
    font-size: 0.9rem;
}

.SearchResult .item .img-wrap {
    position: relative;
    overflow: hidden;
    cursor: pointer;
}

.SearchResult .item .img-wrap img {
    width: 100%;
    height: 100%;
    border-radius: 0.4rem;
}

.SearchResult .item .img-wrap .cover-content {
    position: absolute;
    box-sizing: border-box;
    border-radius: 0.5rem 0.5rem 0 0;
    line-height: 1.5rem;
    top: -60px;
    color: white;
    font-size: 0.8rem;
    padding: 0.2rem;
    width: 100%;
    min-height: 2rem;
    max-height: 5rem;
    background-color: rgba(0, 0, 0, 0.5);
    transition: all 0.5s;
}

.SearchResult .item .img-wrap:hover .cover-content {
    transition: all 0.5s;
    top: 0;
}

.SearchResult .item .img-wrap .cover-content p {
    padding-left: 5px;
    font-size: 0.8rem;
}

.SearchResult .cover-play-btn {
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    height: 2rem;
    width: 2rem;
    right: 0.5rem;
    bottom: 0.8rem;
    background-color: rgba(255, 255, 255, 0.5);
    border-radius: 1rem;
    opacity: 0;
    transition: all 0.5s;
}

.SearchResult .item .img-wrap:hover .cover-play-btn {
    opacity: 1;
    transition: all 0.8s;
}

.SearchResult .cover-play-btn>div {
    color: rgb(198, 47, 47);
    font-size: 1.5rem;
}

/**公共属性结尾 */
.wypublish .items .item {
    width: 24%;
}

.wypublish .items .item .name {
    margin: 8px 5px;
    font-size: 0.9rem;
}

.wypublish .items .item .img-wrap {
    width: 100%;
    position: relative;
}

.wypublish .items .item .img-wrap .cover {
    position: absolute;
    top: 8px;
    right: 10px;
    color: white;
}

.wypublish .items .item .img-wrap .cover span {
    padding: 0 3px;
}

.red {
    color: #c63030;
}
</style>
