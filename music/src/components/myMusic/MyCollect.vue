<template>
<!-- 精彩MV-->
<div class="wypublish">
    <p class="title">收藏的视频 <span>({{total}})</span></p>
    <div class="items">
        <div class="item" v-for="(item,i) in wypublish" :key="i">
            <div class="img-wrap" @click="toVideoDetail(item.vid)">
                <img :src="item.coverUrl" alt="">
                <span class="iconfont icon-shipin playCount"> <span> {{item.playTime|formatPlayCount}}</span></span>
                <span class="duration">{{item.durationms|formatDuration}}</span>
            </div>
            <p>{{item.title}}</p>
            <span class="name">by {{item.creator.nickname}}</span>
        </div>
    </div>
</div>
</template>

<script>
export default {
    props: ['url'],
    data() {
        return {
            wypublish: [], //精彩MV
            titleShow: true,
            total: 0
        }
    },
    methods: {
        toVideoDetail(vid) { //跳转到视频详情页,先判断是视频还是mv
            let reg = /^\d+$/ //判断id是否全是数字
            if (reg.test(vid)) {
                this.$router.push({
                    path: '/DetailMv',
                    query: {
                        mvId: vid
                    }
                })
            } else {
                this.$router.push({
                    path: '/DetailVideo',
                    query: {
                        vid: vid
                    }
                })
            }

        },
    },
    created() {
        //精彩视频
        this.$axios({
            method: 'get',
            url: '/mv/sublist',
            withCredentials: true, //关键

        }).then(res => {
            this.wypublish = res.data.data
            this.total = res.data.count
            // console.log(this.wypublish)
        })
    },
}
</script>

<style lang="less">
.wypublish {
    .title {
        margin-top: 2rem;
        font-size: 1.3rem;
        padding-bottom: 0.5rem;
        border-bottom: 1px solid #e1e1e2;

        span {
            font-size: 0.8rem;
        }

    }

    .items {
        display: flex;
        flex-wrap: wrap;
        justify-content: flex-start;

        .item {
            flex: 19%;
            max-width: 280.6px;
            margin: 15px 10px;

            &:nth-child(4n+1) {
                margin-left: 0;
            }

            .img-wrap {
                position: relative;
                cursor: pointer;
                overflow: hidden;

                img {
                    width: 100%;
                    border-radius: 0.4rem;
                    height: 100%;
                    max-height: 157.82px;
                    max-width: 280.59px;
                }

                .playCount {
                    position: absolute;
                    top: 0;
                    right: 0;
                    padding: 4px 6px 4px 50px;
                    border-top-right-radius: 0.4rem;
                    background-image: linear-gradient(to right, rgba(255, 255, 255, 0), rgba(78, 78, 78, 0.5));
                    color: white;

                    span {
                        font-size: 0.85rem;
                    }
                }

                .duration {
                    position: absolute;
                    left: 0;
                    bottom: 0;
                    padding: 10px;
                    color: white;
                }
            }

            p {
                word-break: break-all;
                display: -webkit-box;
                -webkit-line-clamp: 1;
                -webkit-box-orient: vertical;
                overflow: hidden;
                font-size: 0.9rem;
            }

            .name {
                color: rgb(155, 155, 155);
                font-size: 0.8rem;
            }
        }
    }

}
</style>
