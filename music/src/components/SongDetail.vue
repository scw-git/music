<template>
<div class="SongDetail">
    <div class="song">
        <div class="left">
            <img class="bar " :class="{playbar:isPlay}" src="../assets/player_bar.png" alt="">
            <div class="bg autoRotate" :class="{playing:isPlay}"><img :src="img" v-if="img!=''" alt=""></div>
        </div>
        <div class="right">
            <span class="name">{{song}}</span>
            <span>MV</span>
            <p class="singer">歌手：<span class="art">{{singer}}</span></p>
            <div class="scroll" ref="scroll">
                <div class="lyrics-wrap" ref="index">
                    <div class="lyrics" v-for="(item,key,i) in lyrObj" :key="i">
                        <!--必须用 allKeys[i] 代替 key。否则有可能，几句歌词同时变色-->
                        <p :class="{red:currentTime>allKeys[i] && currentTime<allKeys[i+1]}">{{item}}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="bottom">

        <!--左边的评论-->

        <comment class="comment" :id='id' :url='url'>
            <template slot='songDetail'>
                <!--发布评论-->
                <div class="addComment">
                    <textarea name="" id="" @keydown.enter="comment" v-model="content"></textarea>
                    <button @click="comment">评论</button>
                </div>
            </template>
        </comment>
        <!--右边相关推荐-->
        <div class="about">
            <div class="contain" v-if="simiPlayList!=0">
                <h3>包含这首歌的歌单</h3>
                <div class="items">
                    <div class="item" v-for="(item,i) in simiPlayList" :key="i" @click="toPlayList(item.id)">
                        <img :src="item.coverImgUrl" alt="">
                        <div class="content">
                            <span>{{item.name}}</span>
                            <span class="iconfont icon-bofanganniu"> {{ item.playCount |formatPlayCount}}</span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="simi contain " v-if="simiSong!=0">
                <h3>相似歌曲</h3>
                <div class="items">
                    <div class="item" v-for="(item,i) in simiSong" :key="i" @click="upData(item.id)">
                        <img :src="item.album.blurPicUrl" alt="">
                        <div class="content">
                            <span>{{item.name}}</span>
                            <span> {{ item.artists[0].name}}</span>
                            <span class="iconfont icon-play2 icon"></span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
</template>

<script>
import BetterScroll from 'better-scroll'
import comment from './common/comment'
// let bs = new BetterScroll('.wrapper', {})
export default {
    components: {
        comment
    },
    data() {
        return {
            img: '',
            index: -1,
            song: '', //歌曲
            singer: '', //歌手
            simiPlayList: [], //包含这首歌的歌单
            simiSong: [],
            id: '',
            currentSongDetail: '',
            isPlay: false, //有个bug,先设置为false时。要点击两次，黑胶才会转
            currentTime: '', //当前播放时间
            lyrObj: {}, //每句歌词对应的时间 (key:时间 value:歌词)
            allKeys: [], //存储了所有歌词对应的时间（只有时间）
            url: '/comment/music',
            content: ''
        }
    },
    updated() {
        this.getIndex()
    },
    watch: {
        id() {
            this.getAbout()
            this.getSimilar()
            this.getContain()
            this.getLyric()
        },

    },
    mounted() {
        //获取当前播放时间
        this.$vue.$on('currentTime', res => {
            this.currentTime = res
            // console.log(res)
        })
        this.$vue.$on('isPlay', res => {
            this.isPlay = res
            // console.log(this.isPlay)
        })
        this.$vue.$on('currentId', res => {
            this.id = res
            // console.log('111')
        })
        //歌词滚动
        this.bs = new BetterScroll(this.$refs.scroll, {
            //这里写配置
            scrollY: true
        })
    },
    created() {
        this.id = this.$route.query.songId
        this.getAbout()
        this.getLyric()
        this.getSimilar()
        this.getContain()
        // console.log(this.$route.query.songId)
    },
    methods: {
        //发布歌曲评论
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
                            type: 0,
                            id: this.id,
                            content: this.content,
                            timestamp: time
                        }
                    }).then(res => {
                        this.url = '/comment/music?timestamp=' + time
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
        handleCurrentChange(val) {
            // console.log(`当前页: ${val}`);
            this.page = val

        },
        getIndex() {
            // let index = this.$refs.index
            // window.clearInterval(timer)
            // let timer = window.setInterval(() => {
            //     if (this.currentTime > )
            //         console.log(index);
            // }, 1000)
        },
        //获取所有的歌词对应的时间  
        getAllKeys() {
            for (let key in this.lyrObj) { //遍历对象的key值（即时间）
                this.allKeys.push(key)
            }
        },
        //获取歌词
        getLyric() {
            this.$axios.get('/lyric?id=' + this.id).then(res => {
                let lyr = res.data.lrc.lyric.split('\n')
                let reg = /\[\d*:\d*(\.|:)\d*]/g
                for (let i = 0; i < lyr.length; i++) {
                    let timeReg = lyr[i].match(reg) //获取时间部分 格式：[00:01.000]
                    if (!timeReg) continue //有些是空的，跳出当前循环。执行下一个循环
                    let content = lyr[i].replace(timeReg, '') //获得歌词
                    let m = Number(timeReg[0].match(/\[\d*/i).toString().slice(1)) //获取分钟
                    let s = Number(timeReg[0].match(/:\d*/i).toString().slice(1)) //获取秒
                    let time = m * 60 + s
                    this.lyrObj[time] = content
                }
                this.getAllKeys()
                // console.log(this.lyrObj)
            })
        },
        //获取图片，歌手，姓名
        getAbout() {
            this.$axios.get('/song/detail?ids=' + this.id).then(res => {
                this.currentSongDetail = res.data.songs[0]
                this.img = this.currentSongDetail.al.picUrl
                this.song = this.currentSongDetail.name
                this.singer = this.currentSongDetail.ar[0].name
                // console.log(res)
            })
        },
        //点击了包含这首歌的歌单，跳转到歌单详情
        toPlayList(id) {
            this.$router.push({
                path: '/DetailPlayList',
                query: {
                    playListId: id
                }
            })
        },
        //点击了相似歌曲  获取当前播放歌曲的详细信息
        upData(id) {
            this.id = id
            this.$axios.get('/song/detail?ids=' + id).then(res => {
                this.currentSongDetail = res.data.songs[0]
                this.img = this.currentSongDetail.al.picUrl
                this.song = this.currentSongDetail.name
                this.singer = this.currentSongDetail.ar[0].name
                this.$parent.currentSongDetail = this.currentSongDetail //传给body组件，改变左下方的播放窗口
                this.getSimilar()
                this.getContain()

                // console.log(this.currentSongDetail)
            })
            //获取歌曲URL
            this.$axios.get('/song/url?id=' + this.id).then(res => {
                this.$parent.url = res.data.data[0].url
                this.$parent.currentId = this.id
                this.$parent.allSongsId = [this.id] //这个和上面一个都要写，点击上或下一首时，会提示。
            })
        },
        //获取相似歌曲
        getSimilar() {
            this.$axios.get('/simi/song?id=' + this.id).then(res => {
                this.simiSong = res.data.songs
                // console.log(res.data.songs)
            })
        },
        //获取包含这首歌的歌单
        getContain() {
            this.$axios.get('/simi/playlist?id=' + this.id).then(res => {
                this.simiPlayList = res.data.playlists
                // console.log(this.simiPlayList)
            })
        },

    }
}
</script>

<style scoped>
.song {
    width: 100%;
    height: 32.5rem;
    display: flex;
}

.song .left {
    flex: 1;
    position: relative;
    display: flex;
    justify-content: center;

}

.song .left .bar {
    position: absolute;
    top: -2.1875rem;
    left: 50%;
    transform: translate(-35%, 0);
    z-index: 99;
    transform-origin: 10px 10px;
    transform: rotate(-26deg);
    transition: all 1s;
}

/**只写一个类名，优先级不够 */
.playbar {
    transform: rotate(6deg) !important;
    transition: all 1s;
}

.song .left .bg {
    margin-top: 2.575rem;
    height: 18.75rem;
    width: 18.75rem;
    border-radius: 50%;
    border: 0.625rem solid #c7c7c7;
}

/**旋转动画 */
@keyframes rotate {
    from {
        transform: rotateZ(0);
    }

    to {
        transform: rotateZ(360deg);
    }
}

/**旋转类名 */
.autoRotate {
    animation-name: rotate;
    animation-duration: 20s;
    animation-timing-function: linear;
    animation-iteration-count: infinite;
    animation-play-state: paused;

}

.playing {
    animation-play-state: running !important;

}

.song .left .bg img {
    box-sizing: border-box;
    height: 18.75rem;
    width: 18.75rem;
    border-radius: 50%;
    border: 3.125rem solid black;

}

.song .right {
    flex: 1;
    margin-top: 20px;
    margin-left: -50px;
}

.song .right .name {
    font-size: 1.6rem;
    color: #333333;
}

.song .right span:nth-child(2) {
    color: red;
    border: 1px solid red;
    padding: 1px;
    margin-left: 10px;
}

.song .right .singer {
    margin-top: 15px;
    font-size: 0.9rem;
}

.song .right .singer span {
    color: #517eaf;
}

.song .right .scroll {
    height: 415px;
    margin-top: 20px;
    overflow: hidden;
}

.song .right .scroll .lyrics-wrap {
    font-size: 0.9rem;
}

.song .right .scroll .lyrics {
    margin-bottom: 0.8rem;
    color: #494949;

}

.ws {
    position: relative;
    top: -10px;
}

.bottom {
    display: flex;
}

.bottom .comment {
    flex: 7;
}

.bottom .about {
    flex: 3;
    margin-left: 30px;
}

.bottom .about .contain .items {
    margin-top: 0.3rem;

}

.bottom .about .contain .item {
    display: flex;
    cursor: pointer;
    position: relative;
}

.bottom .about .contain .item:hover {
    background-color: #f5f5f5;
}

.bottom .about .contain .item .content {
    margin-left: 10px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    font-size: 0.8rem;
    letter-spacing: 1.2px;
}

.bottom .about .contain .item .content .icon {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    left: 1rem;
    background-color: rgba(0, 0, 0, 0.4);
    color: white;
    border-radius: 50%;
    font-size: 1rem;
    padding: 5px;
}

.bottom .about .contain .item .content span:nth-child(1) {
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
    margin-bottom: 5px;
}

.bottom .about .contain .item .content span:nth-child(2) {
    color: #bebebe;
    font-size: 0.8rem;
}

.bottom .about .contain .item img {
    width: 3.75rem;
    height: 3.75rem;
    border-radius: 4px;
    margin-top: 0.4rem;
}

.bottom .about .simi {
    margin-top: 30px;
}

.red {
    color: #c62f2f;
    font-size: 1.1rem;
    font-size: 700;
}
</style>
