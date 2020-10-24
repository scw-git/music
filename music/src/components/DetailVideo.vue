<template>
<div class="DetailMv">
    <div class="left">
        <div class="title">
            <span>视频</span>
            <span>{{videoDetail.title}}</span>
            <span>{{videoDetail.creator.nickname}}</span>
        </div>
        <video :src="videoUrl" controls autoplay></video>
        <div class="pl">
            <p>评论<span> ({{total}})</span></p>
        </div>
        <!--发布评论-->
        <div class="addComment">
            <textarea name="" id=""></textarea>
            <button>评论</button>
        </div>
        <!--评论-->
        <comment :id="vid" url='/comment/video' @total='total=$event' />
    </div>
    <div class="right">
        <h3>视频介绍</h3>
        <div class="describe">
            <span>发布时间：{{videoDetail.publishTime |formatYMD}}</span>
            <span>播放次数：{{videoDetail.playTime|formatPlayCount}}次</span>
            <div class="profile">
                简介：{{videoDetail.description}}
            </div>
        </div>
        <h3 class="about">相关推荐</h3>
        <div class="items">
            <div class="item" v-for="(item,i) in aboutVideo" :key="i" @click="play(item.vid)">
                <div class="img-wrap">
                    <img :src="item.coverUrl" alt="">
                    <div class="play-count">
                        <span class="iconfont icon-video"></span>
                        <span>{{item.playTime |formatPlayCount}}</span>
                    </div>
                </div>
                <div class="content-wrap">
                    <div>{{item.title}}</div>
                    <div>{{item.durationms|formatDuration}}</div>
                    <div>by {{item.creator["0"].userName}}</div>
                </div>
            </div>
        </div>
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
            videoUrl: '',
            videoDetail: '',
            aboutVideo: [],
            vid: this.$route.query.vid, //视频的ID
            total: 0,
        }
    },
    methods: {
        pl() {
            this.$axios({
                method: 'get',
                url: '/comment/video',
                withCredentials: true, //关键
                params: {
                    id: this.vid
                }
            }).then(res => {
                // this.videoUrl = res.data.urls[0].url
                console.log(res)
            })
        },

        handleCurrentChange(val) {
            // console.log(`当前页: ${val}`);
            this.page = val
            this.getMvComment(this.id)
        },
        //获取视频url
        getVideoUrl(vid) {
            this.$axios({
                method: 'get',
                url: '/video/url',
                withCredentials: true, //关键
                params: {
                    id: vid
                }
            }).then(res => {
                this.videoUrl = res.data.urls[0].url
                // console.log(res)
            })
        },
        //获取视频详情
        getVideoDetail(vid) {
            this.$axios({
                method: 'get',
                url: '/video/detail',
                withCredentials: true, //关键
                params: {
                    id: vid
                }
            }).then(res => {
                this.videoDetail = res.data.data
                // console.log(res)
            })
        },
        //获取相似视频
        getAbout(vid) {
            this.$axios({
                method: 'get',
                url: '/related/allvideo',
                withCredentials: true, //关键
                params: {
                    id: vid
                }
            }).then(res => {
                this.aboutVideo = res.data.data
                // console.log(res)
            })
        },
        //点击相关推荐，更新mv
        play(vid) {
            this.vid = vid
            this.getVideoUrl(this.vid)
            this.getVideoDetail(this.vid)
            this.getAbout(vid)
        },
    },
    created() {
        this.getVideoUrl(this.vid)
        this.getVideoDetail(this.vid)
        this.getAbout(this.vid)
        // this.pl()
    }
}
</script>

<style scoped>
.DetailMv {
    display: flex;
    margin-top: 30px;
}

.left {
    flex: 8;

}

.left .title span {
    margin-right: 10px;
}

.left .title span:nth-child(1) {
    border: 1px solid #e03f40;
    color: #e03f40;
    padding: 0 5px;
    border-radius: 3px;
}

.left .title span:nth-child(3) {
    color: #4a5d7b;
    font-size: 0.75rem;
}

.left .pl {
    border-bottom: 1px solid #e1e1e2;
    padding-bottom: 10px;
    margin-bottom: 20px;
}

.left .pl p {
    margin-top: 20px;
}

.left .pl p span {
    color: #968896;
    font-size: 0.8rem;
}

video {
    width: 100%;
    height: 475px;
    margin-top: 10px;
    outline: none;
}

.right {
    flex: 3;
    margin-left: 30px;
}

.right h3 {
    font-weight: 500;
    color: #35355a;
    border-bottom: 1px solid #a7a7a7;
    padding-bottom: 8px;
    margin-bottom: 10px;
}

.describe {
    color: #696969;
    font-size: 0.8rem;
    line-height: 1.2rem;
}

.describe span:nth-child(2) {
    float: right;
}

.describe div {
    margin-top: 10px;
}

.right .about {
    margin-top: 60px;
}

.right .item {
    display: flex;
    margin-bottom: 15px;
    cursor: pointer;
}

.right .item .img-wrap {
    flex: 1;
    position: relative;
}

.right .item .img-wrap img {
    width: 150px;
    height: 80px;
}

.right .item .img-wrap .play-count {
    position: absolute;
    top: 0px;
    right: 0px;
    color: white;
    background-color: rgb(116, 116, 116, 0.2);
    padding: 2px 5px;
    font-size: 0.8rem;
}

.right .item .img-wrap .play-count span:nth-child(1) {
    margin-right: 3px;
}

.right .item .content-wrap {
    flex: 1;
    margin-left: 10px;
    font-size: 0.8rem;
    color: #666666;
}

.right .item .content-wrap div:nth-child(1) {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    line-height: 1.2rem;
    color: #000000;
}

.right .item .content-wrap div:nth-child(2) {
    margin: 2px 0;
    font-size: 0.7rem;
    color: rgb(134, 134, 134);
}

.right .item .content-wrap div:nth-child(3) {
    color: rgb(134, 134, 134);
    font-size: 0.7rem;
}
</style>
