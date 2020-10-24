<template>
<div class="body">
    <!--左侧菜单-->
    <div class="aside">
        <p>推荐</p>
        <ul class="body-items">
            <li>
                <router-link to='/tab'><span class="iconfont icon-yinyue"></span>发现音乐</router-link>
            </li>
            <li>
                <router-link to='/tabVideo'><span class="iconfont icon-shipin"></span>视频</router-link>
            </li>
        </ul>
        <p>我的音乐</p>
        <ul class="body-items">
            <li>
                <router-link to='/1'><span class="iconfont icon-Cloud2"></span>音乐云盘</router-link>
            </li>
        </ul>
        <p>创建的歌单</p>
        <ul class="body-items">
            <li>
                <router-link to='/2'><span class="iconfont icon-aixin-xian"></span>我喜欢的音乐</router-link>
            </li>
        </ul>
        <p>收藏的歌单</p>
        <ul class="body-items">

        </ul>
    </div>

    <!--中间内容-->
    <div class="main">

        <keep-alive include='tab,TopList'>
            <router-view></router-view>
        </keep-alive>
        <!--用来与底部留出一些距离-->
        <div class="main-div"></div>
    </div>
    <!--当前播放歌曲的显示窗口-->
    <div class="currentPlaySong" v-if="url" @click="toSongdetail(currentId)">
        <img :src="currentSongDetail.al.picUrl" alt="">
        <div class="songContent">
            <p>{{currentSongDetail.name}}</p>
            <p>{{currentSongDetail.ar[0].name}}</p>
        </div>
        <span class="iconfont icon-shuangjiantou-shang" v-if="isShow"></span>
        <span class="iconfont icon-shuangjiantou-xia" v-if="!isShow"></span>
    </div>
    <!--底下播放器-->
    <div class="play">
        <!--按钮-->
        <div class="play-btn">
            <span class="play-up iconfont icon-back1" @click="upSong"></span>
            <span class="play-pause iconfont icon-play2" v-if="!isPlay" @click="playPause()"></span>
            <span class="play-pause iconfont icon-pause2" v-if="isPlay" @click="playPause()"></span>
            <span class="play-next iconfont icon-next1" @click="nextSong"></span>
        </div>
        <!--时间条-->
        <div class="time-line">
            <span>{{currentTime | formatDt}}</span>
            <el-slider v-model="currentTime" class="line" :max='totalDuration' @change="changeMusicDt" :show-tooltip="false"></el-slider>
            <span>{{totalDuration |formatDt}}</span>

        </div>
        <!--音量-->
        <div class="volume">
            <span class="iconfont icon-volume2" v-if="value2!=0" style="font-size:0.9rem;cursor:pointer" @click="isMute"></span>
            <span class="iconfont icon-icon--" v-else style="font-size:1.25rem ;cursor:pointer" @click="isMute"></span>
            <el-slider v-model="value2" @change="changeVolume" class="line" :show-tooltip="false"></el-slider>
        </div>
        <audio :src="url" ref="audio" autoplay></audio>
    </div>

</div>
</template>

<script>
import tab from '../components/common/tab'
export default {
    components: {
        tab
    },
    data() {
        return {
            isShow: true,
            tag: '发现音乐',
            url: '', //播放路径
            currentId: '', //当前播放歌曲的id
            allSongsId: [], //当前歌单的所有id
            nextSongId: '', //存放下一首的id
            upSongId: '', //存放上一首的id
            isPlay: false, //播放与暂停按钮,false为暂停
            // audio: this.$refs.audio,
            currentTime: 0, //时长,获取当前歌曲播放了多少秒
            value2: 25, //音量的初始值
            currentSongDetail: [], //当前播放歌曲的详细信息
            totalDuration: 0, //歌曲的总时长
            index: -1, //用来记录当前播放歌曲的索引号，以便把它变成红色

        }
    },
    watch: {

        url() {
            let audio = this.$refs.audio //获取audio元素
            audio.src = this.url
            audio.play()
            this.isPlay = true
            this.getCurrentSongDetail()
            this.setAudioInfo()
            this.$vue.$emit('isPlay', this.isPlay)
        },
        isPlay() {
            this.$vue.$emit('isPlay', this.isPlay)
        },
    },
    mounted() {
        //接受 TopList NewMusic FindMusic 传过来的数据
        this.$vue.$on('playData', (res) => {
            this.url = res.url
            this.currentId = res.currentId
            this.allSongsId = res.allSongsId
            this.index = res.index
            // console.log(res.index)
        })
    },
    methods: {
        //跳转到歌曲详情页面
        toSongdetail(id) {
            this.isShow = !this.isShow
            if (this.isShow == true) {
                this.$router.go(-1)
            }
            // this.$vue.$emit('isPlay', this.isPlay)
            this.$router.push({
                path: '/SongDetail',
                query: {
                    songId: id,
                }
            })
        },
        //改变音量
        changeVolume() {
            let audio = this.$refs.audio
            audio.volume = (this.value2) / 100

        },
        //点击了静音或者非静音图标
        isMute() {
            if (this.value2 !== 0) { //判断不是非静音下
                this.value2 = 0 //设置静音
                this.changeVolume() //调用改变音量
            } else {
                this.value2 = 20
                this.changeVolume()
            }
        },
        //进度条变化
        changeMusicDt() {
            let audio = this.$refs.audio
            audio.currentTime = this.currentTime
        },
        //设置audio的各种信息
        setAudioInfo() {
            let audio = this.$refs.audio
            audio.addEventListener('timeupdate', () => {
                this.totalDuration = audio.duration //获取歌曲总时长
                this.currentTime = audio.currentTime //获取当前歌曲播放了多少秒
                this.$vue.$emit('currentTime', this.currentTime) //把当前时间传到SongDetail中
                // console.log(this.currentTime)
                //自动播放下一首
                if (this.currentTime >= this.totalDuration) {
                    this.nextSong()
                }
                // console.log(this.totalDuration)
                // console.log(audio.currentTime)
            })
        },
        //获取当前播放歌曲的详细信息
        getCurrentSongDetail() {
            this.$axios.get('/song/detail?ids=' + this.currentId).then(res => {
                this.currentSongDetail = res.data.songs[0]
                // console.log(this.currentSongDetail)
            })
        },
        getUrl(id) { //获取url
            this.$axios.get('/song/url?id=' + id)
                .then(res => {
                    this.url = res.data.data[0].url
                })
        },
        nextSong() { //点击下一首
            if (this.currentId == this.allSongsId[this.allSongsId.length - 1]) {

                this.currentId = this.allSongsId[0]
                this.index = 0
                this.$vue.$emit('index', this.index) //参数一：自定义事件名。参数二：要传递的数据
                this.getUrl(this.currentId)

            } else {
                this.index++
                this.$vue.$emit('index', this.index) //参数一：自定义事件名。参数二：要传递的数据
                for (let i = 0; i < this.allSongsId.length; i++) {
                    if (this.currentId == this.allSongsId[i]) {
                        this.nextSongId = this.allSongsId[i + 1]
                        this.getUrl(this.nextSongId)
                    }
                }
                this.currentId = this.nextSongId //把下一首的id设置成当前播放id
                this.$vue.$emit('currentId', this.currentId) //参数一：自定义事件名。参数二：要传递的数据
                // console.log(this.nextSongId)
            }
        },
        upSong() { //点击上一首

            if (this.currentId == this.allSongsId[0]) {
                this.currentId = this.allSongsId[this.allSongsId.length - 1]
                this.index = this.allSongsId.length - 1
                this.$vue.$emit('index', this.index) //参数一：自定义事件名。参数二：要传递的数据
                this.getUrl(this.currentId)
            } else {
                this.index--
                this.$vue.$emit('index', this.index) //参数一：自定义事件名。参数二：要传递的数据
                this.upSongId = this.allSongsId[this.allSongsId.findIndex(res => {
                    return res === this.currentId
                }) - 1]
                this.getUrl(this.upSongId)
                this.currentId = this.upSongId
            }
        },
        playPause() {
            let audio = this.$refs.audio //获取audio元素
            if (this.isPlay == true) {
                audio.pause()
                this.isPlay = false
            } else if (this.isPlay == false && this.url != '') {
                audio.play()
                this.isPlay = true
            }
        },
    },

}
</script>

<style>
.body {
    display: flex;
}

.aside {
    width: 13.125rem;
    font-size: 0.9rem;
    height: 100%;
    position: fixed;
    top: 3.75rem;
    left: 0;
    background-color: #f5f5f7;
    border-right: 1px solid #e1e1e2;
}

.body .aside>p {
    margin: 15px;
    margin-bottom: 20px;
    color: #636363;
}

.body-items {
    width: 100%;
}

.body-items .icon-shipin {
    font-size: 1.25rem;
}

.body-items a {
    box-sizing: border-box;
    width: 100%;
    display: inline-block;
    padding: 10px 15px;
    padding-left: 30px;
    color: rgb(102, 102, 102);
    text-decoration: none;
    font-size: 0.9rem;

}

.body-items li span {
    margin-right: 15px;
}

.body-items a:hover {
    color: black;
}

.body-items .router-link-active {

    color: black;
    background-color: rgb(230, 231, 234);
    border-left: 3px solid #c62f2f;
}

.main {
    flex: 1;
    overflow-y: scroll;
    padding: 0 50px;
    margin-left: 210px;
}

.main-div {
    margin-bottom: 110px;
}

.currentPlaySong {
    display: flex;
    position: fixed;
    bottom: 61px;
    left: 0;
    height: 70px;
    width: 210px;
    border-top: 1px solid #e1e1e2;
    cursor: pointer;
    background-color: #f5f5f7;
}

.currentPlaySong img {
    width: 56px;
    margin: 7px;
    border-radius: 5px;
    filter: blur(1px)
}

.currentPlaySong span {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    left: 0.7rem;
    font-size: 3rem;
    color: white;
}

.currentPlaySong .songContent {
    margin: 5px;
    font-size: 0.8rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
}

.currentPlaySong .songContent p:nth-child(1) {

    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
    margin-bottom: 7px;
    color: #333333;
}

.currentPlaySong .songContent p:nth-child(2) {
    color: #727272;
}

.play {
    position: fixed;
    height: 60px;
    width: 100%;
    bottom: 0;
    left: 0;
    width: 100%;
    background-color: #f6f6f8;
    border-top: 1px solid #e1e1e2;
    display: flex;
    align-items: center;
    z-index: 9999;
}

.play .play-btn span {
    background-color: #e83c3c;
    color: white;
    vertical-align: middle;
    margin: 0 10px;
    cursor: pointer;
}

.play .play-btn {
    margin-left: 20px;
}

.play .play-btn span:nth-child(2) {
    display: inline-block;
    width: 35px;
    height: 35px;
    border-radius: 20px;
    line-height: 35px;
    text-align: center;
    font-size: 22px;
}

.play .play-btn span:nth-child(2n-1) {
    display: inline-block;
    width: 30px;
    height: 30px;
    border-radius: 15px;
    line-height: 30px;
    text-align: center;
    font-size: 13px;
}

.play .time-line {
    flex: 7;
    display: flex;
    margin-left: 50px;
}

.play .time-line span {
    line-height: 38px;
}

.play .time-line span:nth-child(1) {
    margin-right: 20px;
}

.play .time-line span:nth-child(3) {
    margin-left: 20px;
}

.play .time-line .line {
    flex: 1;
}

.el-slider__bar {
    background-color: #e83c3c !important;
    height: 4px !important;
}

.el-slider__button {
    border: 2px solid #e83c3c !important;
    height: 11px !important;
    width: 11px !important;
}

.play .volume {
    flex: 1;
    display: flex;
    margin-left: 30px;
    margin-right: 20px;
    line-height: 38px;

}

.play .volume .line {
    flex: 1;
    margin: 0 10px;
}

audio {
    width: 100%;
    border-radius: none;
    outline: none;

}
</style>
