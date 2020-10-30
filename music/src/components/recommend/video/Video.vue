<template>
<div class="Vedio">
    <span class="allVedio" @click="openType" style="cursor:pointer">{{tag}} <span class="iconfont icon-icon_arrowdown"></span></span>
    <div class="type">
        <span>分类：</span>
        <span class="category" :class="{red:item.name==tag}" @click="changeTag(item.name,item.id)" v-for="(item, i) in group.slice(0,8)" :key="i">{{item.name}}</span>
        <div class="cover" ref="cover" @click="closeType"></div>
        <div class="group" ref="group">
            <div class="content">
                <span @click="chooseTag(item.name,item.id)" :class="{red:item.name==tag}" v-for="(item,i) in group" :key="i">{{item.name}}</span>
            </div>
        </div>
    </div>
    <div class="items">
        <div class="item" v-for="(item,i) in videoDetail" :key="i">
            <div class="img-wrap" @click="toVideoDetail(item.data.vid)">
                <img :src="item.data.coverUrl" alt="">
                <span class="iconfont icon-shipin playCount"> <span> {{item.data.playTime|formatPlayCount}}</span></span>
                <span class="duration">{{item.data.durationms|formatDuration}}</span>
            </div>
            <p>{{item.data.title}}</p>
            <span class="name">by {{item.data.creator.nickname}}</span>
        </div>
    </div>
    <div class="pager">
        <span class="up iconfont icon-left2" :class="{ban:offset==0}" @click="up"></span>
        <span class="next iconfont icon-right1" @click="next"></span>
    </div>
</div>
</template>

<script>
export default {
    data() {
        return {
            category: [], //获取视频分类列表
            group: [], //获取视频标签列表
            tag: '舞蹈',
            id: '1101', //当前选中的标签或分类的ID,默认‘现场’的视频
            videoDetail: [], //获取一个标签或分类下的视频
            offset: 0
        }
    },
    watch: {
        id() {

            this.getVideoDetail()
            // console.log(this.id)
        },
    },
    methods: {
        up() { //上一页
            if (this.offset == 0) {
                this.$message({
                    message: '已经是第一页了哦！！',
                    type: 'warning',
                    offset: 100
                });
            } else {
                this.offset = this.offset - 8
                this.getVideoDetail()
            }
        },
        next() {
            this.offset = this.offset + 8
            this.getVideoDetail()
        },
        toVideoDetail(vid) { //跳转到视频详情页
            window.sessionStorage.setItem('VideoInfo', JSON.stringify({
                offset: this.offset,
                tag: this.tag,
                id: this.id
            }))
            // console.log(vid)
            this.$router.push({
                path: '/DetailVideo',
                query: {
                    vid: vid
                }
            })
        },
        getVideoDetail() { //获取一个标签或分类下的视频
            this.$axios({
                url: '/video/group',
                method: 'get',
                withCredentials: true, //关键
                params: {
                    id: this.id,
                    offset: this.offset
                }
            }).then(res => {
                // this.mvids.push(res.data.datas[i].data.vid)
                this.videoDetail = res.data.datas
                // console.log(this.videoDetail)
            })
        },
        changeTag(name, id) { //切换不同的分类
            this.offset = 0
            this.tag = name
            this.id = id
        },
        chooseTag(name, id) { //切换不同标签
            this.tag = name
            this.id = id
            this.closeType()
        },
        openType() { //打开标签列表
            this.$refs.group.style.display = 'block'
            this.$refs.cover.style.display = 'block'
        },
        closeType() { //关闭标签列表
            this.$refs.group.style.display = 'none'
            this.$refs.cover.style.display = 'none'
        },
        getStatus() { //从sessionstorage中获取上次保存的状态
            if (window.sessionStorage.getItem('VideoInfo')) {
                let data = JSON.parse(window.sessionStorage.getItem('VideoInfo'))
                this.tag = data.tag
                this.offset = data.offset
                this.id = data.id
            }
        }
    },
    created() {
        if (window.localStorage.getItem('userInfo') === 'null') {
            this.$message({
                message: '该功能需要登录哦！',
                type: 'warning',
                offset: 80
            })
        }
        this.getStatus()
        this.$axios({ //获取视频分类列表
            method: 'get',
            url: '/video/category/list',
            withCredentials: true, //关键

        }).then(res => {
            this.category = res.data.data
            // console.log(this.category)
        })
        this.$axios({ //获取视频标签列表
            method: 'get',
            url: '/video/group/list',
            withCredentials: true, //关键
        }).then(res => {
            this.group = res.data.data
            // console.log(res)
        })
        this.$axios({ //获取视频标签、分类下的视频
            url: '/video/group',
            withCredentials: true, //关键
            method: 'get',
            params: {
                id: this.id,
                offset: this.offset
            }
        }).then(res => {
            // console.log(res)

        })
        this.getVideoDetail() //获取标签、分类下的视频
    }
}
</script>

<style lang="less">
.Vedio {
    color: rgb(71, 71, 71);

    .allVedio {
        border: 1px solid #e1e1e2;
        padding: 5px 10px;
        border-radius: 5px;

        &:hover {
            background-color: #f5f5f7;
        }
    }

    .type {
        margin: 20px 0;
        position: relative;
        color: rgb(107, 107, 107);

        .red {
            color: #c62f2f;

        }

        .category {
            padding: 0 20px;
            border-right: 1px solid #ceccd4;
            cursor: pointer;

            &:hover {
                color: #c62f2f;
            }
        }

        .cover {
            position: fixed;
            top: 0;
            right: 0;
            left: 0;
            bottom: 0;
            z-index: 1;
            display: none;

        }

        .group {
            display: none;
            box-shadow: 0 0 15px rgb(226, 226, 226);
            border-radius: 5px;
            padding: 20px;
            width: 40%;
            height: 20rem;
            overflow-y: scroll;
            background-color: white;
            position: fixed;
            top: 11.5rem;
            left: 16.2rem;
            z-index: 9;

            .content {
                .red {
                    color: #c62f2f;
                    border: 1px solid #c62f2f;
                }

                span {
                    display: inline-block;
                    border: 1px solid #77baff;
                    cursor: pointer;
                    color: #77baff;
                    margin: 6px;
                    padding: 5px;
                    font-size: 0.8rem;

                }
            }
        }
    }

    .items {
        display: flex;
        flex-wrap: wrap;

        .item {
            flex: 19%;
            margin: 15px 10px;

            .img-wrap {
                position: relative;
                cursor: pointer;

                img {
                    width: 100%;
                }

                .playCount {
                    position: absolute;
                    top: 0;
                    right: 0;
                    padding: 4px 6px 4px 50px;
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

    .pager {
        display: flex;
        justify-content: center;
        cursor: pointer;

        .up {
            display: inline-block;
            padding: 5px 10px;
            background-color: #c62f2f;
            color: white;
            margin-right: 20px;
            border-radius: 5px;

            &:hover {
                background-color: rgb(226, 32, 32);
            }
        }

        .next {
            display: inline-block;
            padding: 5px 10px;
            color: white;
            border-radius: 5px;
            background-color: #c62f2f;

            &:hover {
                background-color: rgb(226, 32, 32);
            }

        }

        .ban {
            cursor: default;
            color: rgb(216, 110, 110);
        }
    }

}
</style>
