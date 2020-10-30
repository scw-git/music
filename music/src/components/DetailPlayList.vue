<template>
<div class="DetailPlayList">
    <!--顶部详情-->
    <div class="top-wrap" style="cursor:default">
        <div class="img-wrap">
            <img :src=playlistdetail.coverImgUrl alt="">
        </div>
        <div class="top-content-wrap">
            <p class="title">{{playlistdetail.name}}</p>
            <div class="user">
                <span class="avatar"><img :src="playlistdetail.creator.avatarUrl" alt=""></span>
                <span class="username">{{playlistdetail.creator.nickname}}</span>
                <span class="time">{{playlistdetail.createTime | formatYMD}} 创建</span>
            </div>
            <div class="other">
                <span class="playall iconfont icon-play3" style="cursor:pointer" @click="playAll"> 播放全部</span>
                <span style="cursor:pointer" @click="collect" class="collect iconfont icon-addfile"> 收藏({{playlistdetail.subscribedCount}})</span>
                <span class="share iconfont icon-share2"> 分享({{playlistdetail.shareCount}})</span>
            </div>
            <div class="tag">
                <span>标签：</span>
                <ul>
                    <li v-for="(item,i) in playlistdetail.tags" :key="i"> {{item}}</li>
                </ul>
            </div>
            <div class="profile" :class="{hiddentext:isShow}">简介：{{playlistdetail.description}} <span class="iconfont  icon-arrowdown arrow" @click="isShow=!isShow"></span>

            </div>

        </div>
    </div>
    <!--歌曲列表和评论部分-->
    <div class="comment">
        <el-tabs v-model="activeName">
            <el-tab-pane label="歌曲列表" name="songlist">
                <table class="el-table ">
                    <thead>
                        <th>#</th>
                        <th>音乐标题</th>
                        <th>歌手</th>
                        <th>专辑名</th>
                        <th>时长</th>
                    </thead>
                    <tbody>
                        <tr v-for="(item,i) in songs" :key="i" :class="{red:index==i}" @dblclick="play(item.id,i)">
                            <td>{{i+1|formatNum}}</td>
                            <td>{{item.name}}<span v-if="item.mv!=0" class="iconfont icon-bofanganniu btn" @click="toDetailMv(item.mv)"></span></td>
                            <td>{{item.ar[0].name}}</td>
                            <td>{{item.al.name}}</td>
                            <td>{{item.dt |formatDuration}}</td>
                        </tr>
                    </tbody>
                </table>
            </el-tab-pane>
            <el-tab-pane :label="`评论(${total})`" name="comment">
                <!--发布评论-->
                <div class="addComment">
                    <textarea name="" id="" @keydown.enter="comment" v-model="content"></textarea>
                    <button @click="comment">评论</button>
                </div>
                <!--$event可以直接获取值，并赋值给data中的变量，不用绑定一个方法-->
                <comment :id="id" :url='url' @total="total=$event" />
            </el-tab-pane>

        </el-tabs>
    </div>
</div>
</template>

<script>
import comment from './common/comment'

export default {
    components: {
        comment
    },
    data() {
        return {
            playlistdetail: '', //歌单详情内容
            activeName: 'songlist',
            trackId: [],
            arrid: [], //获取所有的tranckid
            allid: '',
            songs: [], //歌单所有的歌
            isShow: true, //用来显示与隐藏简介的
            index: -1, //不能一开始就是0，会把第一个变成红色。用来记录当前播放歌曲的索引号，以便把它变成红色
            id: this.$route.query.playListId, //歌单ID
            total: 0,
            content: '',
            url: '/comment/playlist'
        }
    },
    watch: {
        $route() { //相当于从小刷新了一遍,这个数据是接收从收藏歌单过来的
            this.id = this.$route.query.playListId
            this.songs = []
            this.trackId = []
            this.arrid = []
            this.allid = ''
            this.index = -1
            this.getSongs()

            // console.log(this.songs)
            // console.log(this.$route.query.playListId)
        }
    },
    methods: {
        //发布歌单评论
        comment() {
            let time = Date.now()
            if (window.localStorage.getItem('userInfo') === 'null') {
                this.$message({
                    message: '登录才能评论哦！！',
                    type: 'warning',
                    offset: 80
                })
            } else {
                if (this.content != '') {
                    this.$axios({
                        method: 'get',
                        url: '/comment',
                        params: {
                            t: 1,
                            type: 2,
                            id: this.id,
                            content: this.content,
                            timestamp: time
                        }
                    }).then(res => {
                        this.url = '/comment/playlist?timestamp=' + time
                        this.$message({
                            message: '评论成功，数据可能有延迟。请稍后刷新',
                            type: 'success',
                            offset: 80
                        })
                        this.content = ''
                        // console.log(this.url)
                    })
                } else {
                    this.$message({
                        message: '写点东西吧！内容不能为空哦！！',
                        type: 'warning',
                        offset: 80
                    })
                }
            }

        },
        //收藏歌单
        collect() {
            let time = Date.now()
            this.$axios({
                method: "get",
                url: '/playlist/subscribe',
                withCredentials: true, //关键
                params: {
                    t: 1,
                    id: this.id,
                    timestamp: time
                }
            }).then(res => {
                this.$message({
                    message: '收藏成功，数据同步可能有延迟。请稍后刷新！',
                    type: 'success',
                    offset: 80
                });
                // console.log(res)
                this.$vue.$emit("onDetailPlayList", "ok")
            })
        },
        handleCurrentChange(val) {
            // console.log(`当前页: ${val}`);
            this.page = val

        },
        //把歌曲id传到父组件中
        play(id, i) {
            this.index = i //如果不加这个，第一个点击的不会变红
            this.$axios.get('/song/url?id=' + id).then(res => {
                let url = res.data.data[0].url
                this.$vue.$emit('CloudMusicInfo', {
                    url: url,
                    currentId: id,
                    index: i, //用来记录当前播放歌曲的索引号，以便把它变成红色
                    allSongsId: this.arrid,
                })

            })
        },
        //播放全部
        playAll() {
            this.play(this.arrid[0], 0)
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
        getSongs() {
            this.$axios.get('/playlist/detail?id=' + this.id)
                .then(res => {
                    this.playlistdetail = res.data.playlist //歌单详情内容
                    // console.log(res)
                    this.trackId = res.data.playlist.trackIds //根据trackids获取歌曲，直接获取是不全的。没有登录
                    for (let i = 0; i < this.trackId.length; i++) {
                        this.arrid.push(this.trackId[i].id) //把trackids放入数组中
                    }
                    this.allid = this.arrid.join() //把歌曲trackids转换成字符串
                    this.$axios.get('/song/detail?ids=' + this.allid).then(res => { //根据trackids获取歌曲内容
                        this.songs = res.data.songs
                        // console.log(this.songs)
                        // console.log(this.allid)
                    })
                    // console.log(this.arrid)
                })
        }
    },
    mounted() {
        this.$vue.$on('index', (res) => { //接收一个函数，res中保存传过来的值
            this.index = res
        })
    },
    created() {
        this.getSongs()
        console.log(this.$route.query.playListId)

        // this.$axios.get('/song/detail?ids=' + this.id).then(res => { //根据trackids获取歌曲内容
        //     this.songs = res.data.songs
        //     console.log(res.data.songs)
        // })
        // console.log(this.$route.query.playListId)
    }
}
</script>

<style>
.addComment {
    position: relative;
    padding: 15px 10px 44px;
    background-color: rgb(240, 240, 242);
    margin-top: 10px;
}

.addComment textarea {
    width: 100%;
    height: 3.5rem;
    outline: none;
    resize: none;
    border: 1px solid rgb(225, 225, 226);
    color: rgb(51, 51, 51);
    padding: 7px;
    box-sizing: border-box;
}

.addComment button {
    position: absolute;
    right: 10px;
    bottom: 10px;
    background-color: #fff;
    padding: 4px 12px;
    border: 1px solid rgb(225, 225, 226);
    outline: none;
    cursor: pointer;
    border-radius: 5px;
}

.addComment button:hover {
    background-color: #f2f2f2;
}
</style><style scoped>
.comment {
    user-select: none;
}

.DetailPlayList {
    margin-top: 30px;
}

.DetailPlayList .top-wrap {
    display: flex;

}

.DetailPlayList .top-wrap .img-wrap img {
    width: 210px;
}

.DetailPlayList .top-content-wrap {
    margin-left: 20px;
}

.DetailPlayList .top-content-wrap .avatar img {
    height: 25px;
    vertical-align: middle;
    border-radius: 15px;
}

.top-content-wrap .user {
    padding: 12px 0;
}

.top-content-wrap .title {
    font-size: 1.5rem;
}

.top-content-wrap .user span:nth-child(n+2) {
    margin-left: 10px;
}

.top-content-wrap .user .username {
    color: rgb(102, 102, 102);
}

.top-content-wrap .user .time {
    color: rgb(136, 136, 136);
    font-size: 0.8rem;
}

.other span:nth-child(n+2) {
    margin-left: 10px;
}

.other .playall {
    padding: 5px 10px;
    border-radius: 3px;
    background-color: #ec4141;
    color: white;
}

.other .playall:hover {
    background-color: rgb(198, 47, 47);

}

.other .collect {
    padding: 5px 10px;
    border-radius: 3px;
    border: 1px solid black;
    color: rgb(102, 102, 102);
}

.other .collect:hover {
    background-color: #e2e2e2;
}

.other .share {
    padding: 5px 10px;
    border-radius: 3px;
    border: 1px solid black;
    color: rgb(102, 102, 102);
}

.top-content-wrap .tag {
    margin-top: 20px;
    color: rgb(102, 102, 102);
    display: flex;
}

.top-content-wrap .tag ul {
    list-style: none;
    display: flex;
}

.top-content-wrap .tag ul li {
    margin-right: 5px;
    color: rgb(12, 115, 194)
}

.top-content-wrap .tag ul li:not(:last-child)::after {
    content: '/';
    margin-left: 5px;
}

.top-content-wrap .profile {
    position: relative;
    color: rgb(102, 102, 102);
    margin-top: 10px;
    padding-right: 100px;
}

.top-content-wrap .profile .arrow {
    position: absolute;
    top: 0;
    right: 0;
    cursor: pointer;
}

.top-content-wrap .hiddentext {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;

}

.comment {
    margin-top: 15px;
}

.comment>>>.el-tabs__active-bar {
    background-color: #c3473a;

}

.comment>>>.el-tabs__item:hover,
.comment>>>.el-tabs__item.is-active {
    color: #c3473a;
}

.el-table {
    border-collapse: collapse
}

.el-table td {
    border: 0;
}

.el-table td,
.el-table th {
    padding: 25px 15px 25px 25px;
}

.el-table tr:nth-child(2n) {
    background-color: rgb(249, 249, 249);
}

.el-table tr:hover {
    background-color: rgb(240, 240, 240);

}

.el-table .btn {
    font-size: 0.5rem;
    color: red;
    border: 1px solid red;
    cursor: pointer;
    margin-left: 5px;
}

.red {
    color: #c63030;
}
</style>
