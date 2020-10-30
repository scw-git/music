<template>
<div class="TopList">
    <div class="office">
        <h3>官方榜</h3>
        <div class="items">
            <div class="item">
                <img src="../../../assets/uplist.jpg" @click="more(allList[0].id)" alt="">
                <ul>
                    <li v-for="(item,i) in upList" :key="i" @click="play(item.id,upList)"> <span class="index">{{i+1 }} </span> {{ item.name}}<span class="name">{{item.ar[0].name}}</span></li>

                </ul>
                <div class="more"><span @click="more(allList[0].id)">查看全部></span></div>
            </div>
            <div class="item">
                <img src="../../../assets/newList.png" @click="more(allList[1].id)" alt="">
                <ul>
                    <li v-for="(item,i) in newList" :key="i" @click="play(item.id,newList)"> <span class="index">{{i+1 }} </span> {{ item.name}}<span class="name">{{item.ar[0].name}}</span></li>

                </ul>
                <div class="more"><span @click="more(allList[1].id)">查看全部></span></div>
            </div>
            <div class="item">
                <img src="../../../assets/yclist.png" @click="more(allList[2].id)" alt="">
                <ul>
                    <li v-for="(item,i) in ycList" :key="i" @click="play(item.id,ycList)"> <span class="index">{{i+1 }} </span> {{ item.name}}<span class="name">{{item.ar[0].name}}</span></li>

                </ul>
                <div class="more"><span @click="more(allList[2].id)">查看全部></span></div>
            </div>
            <div class="item">
                <img src="../../../assets/hotlist.png" @click="more(allList[3].id)" alt="">
                <ul>
                    <li v-for="(item,i) in hotList" :key="i" @click="play(item.id,hotList)"> <span class="index">{{i+1 }} </span> {{ item.name}}<span class="name">{{item.ar[0].name}}</span></li>

                </ul>
                <div class="more"><span @click="more(allList[3].id)">查看全部></span></div>
            </div>
        </div>
    </div>
    <div class="global">
        <h3>全球榜</h3>
        <div class="items">
            <div class="item" v-for="(item,i) in allList.slice(4)" :key="i">
                <div class="img-wrap" @click="more(item.id)">
                    <img :src="item.coverImgUrl" alt="">
                    <span class="earphone iconfont icon-earphone"> {{item.playCount | formatPlayCount}}</span>
                    <span class="btn iconfont icon-play2"></span>
                </div>
                <span>{{item.name}}</span>
            </div>
        </div>
    </div>
</div>
</template>

<script>
export default {
    data() {
        return {
            idArr: [], //所有榜单的id
            allList: [], //所有榜单的数组
            img: '',
            upList: [], //获取飙升榜所有的歌曲
            newList: [], //获取新歌榜所有的歌曲
            ycList: [], //原创
            hotList: [], //热歌
            singerList: [], //歌手榜
            allId: [], //获取一个榜单的所有歌曲id
        }
    },
    methods: {
        more(id) { //点击了查看全部
            this.$router.push({
                path: '/DetailPlayList',
                query: {
                    playListId: id
                }
            })
        },
        getDetail(id) { //获取前五个榜单的的前8首歌曲（榜单也是歌单）
            this.$axios.get('/playlist/detail?id=' + id).then(res => {
                if (id === this.idArr[0]) {
                    this.upList = res.data.playlist.tracks.slice(0, 8)
                } else if (id === this.idArr[1]) {
                    this.newList = res.data.playlist.tracks.slice(0, 8)
                } else if (id === this.idArr[2]) {
                    this.ycList = res.data.playlist.tracks.slice(0, 8)
                } else if (id === this.idArr[3]) {
                    this.hotList = res.data.playlist.tracks.slice(0, 8)
                } else if (id === this.idArr[4]) {
                    this.singerList = res.data.playlist.tracks.slice(0, 8)
                }
                // console.log(this.newList)
            })

        },
        // getGlobal() { //获取全球榜
        //     console.log(this.allList)
        //     for (let i = 8; i < this.allList.length; i++) {
        //         this.$axios.get('/playlist/detail?id=' + this.allList[i]).then(res => {})
        //     }

        // },
        getAllId(arr) { //获取一个榜单的前8歌曲id
            for (let i = 0; i < arr.length; i++) {
                this.allId.push(arr[i].id)
            }
        },
        play(id, list) { //播放
            this.getAllId(list)
            this.$axios.get('/song/url?id=' + id).then(res => {
                this.$vue.$emit('playData', {
                    url: res.data.data[0].url,
                    currentId: id,
                    allSongsId: this.allId

                })
            })
            // console.log(this.allId)
        }

    },
    watch: {
        idArr() {
            this.getDetail(this.idArr[0])
            this.getDetail(this.idArr[1])
            this.getDetail(this.idArr[2])
            this.getDetail(this.idArr[3])
        }
    },
    created() {
        this.$axios.get('/toplist').then(res => { //获取所有榜单的种类
            this.allList = res.data.list
            // this.img = res.data.list[0].coverImgUrl
            for (let i = 0; i < this.allList.length; i++) {
                this.idArr.push(this.allList[i].id)
            }

            // console.log(this.allList)
        })
    }
}
</script>

<style lang="less">
.TopList {
    margin: 0 auto;

    .office {
        h3 {
            font-weight: 500;
            border-bottom: 1px solid #e1e1e2;
            padding-bottom: 10px;

        }

        .items {
            display: flex;
            flex-wrap: wrap;
            justify-content: flex-start;

            .item {
                flex: 23%;
                margin: 10px;
                height: 460px;
                margin-top: 20px;
                border: 1px solid #ededed;
                font-size: 0.9rem;
                max-width: 290px;
                min-width: 250px;

                img {
                    cursor: pointer;
                }

                &:nth-child(1) {
                    margin-left: 0;
                }

                &:nth-child(4) {
                    margin-left: 0;
                }

                .more {
                    display: flex;
                    justify-content: flex-end;
                    background-color: #f5f5f7;
                    padding: 15px 0;
                    color: #888888;

                    span {
                        cursor: pointer;
                        margin-right: 10px;

                        &:hover {
                            color: rgb(63, 63, 63);
                        }
                    }
                }

                img {
                    width: 100%;
                    height: 110px;

                }

                ul li {
                    margin: 0;
                    list-style-type: none;
                    padding: 9px;
                    cursor: pointer;

                    .index {
                        margin-right: 8px;
                    }

                    &:nth-child(2n-1) {
                        background-color: #f5f5f7;
                    }

                    &:nth-child(-n+3) {
                        .index {
                            color: red;

                        }
                    }

                    &:hover {
                        background-color: #ebeced;
                    }

                    .name {
                        float: right;
                        color: #888888;
                    }
                }
            }
        }
    }

    .global {
        h3 {
            font-weight: 500;
            border-bottom: 1px solid #e1e1e2;
            padding-bottom: 10px;
        }

        .items {
            display: flex;
            flex-wrap: wrap;
            justify-content: flex-start;

            .item {
                flex: 13%;
                margin: 10px;
                min-width: 120px;
                max-width: 180px;
                cursor: pointer;

                .img-wrap {
                    color: white;
                    position: relative;

                    .btn {
                        position: absolute;
                        right: 10px;
                        bottom: 10px;
                        padding: 5px;
                        border-radius: 50px;
                        background-color: rgba(39, 39, 39, 0.5);
                        opacity: 0;
                        transition: all 0.3s;
                    }

                    &:hover .btn {
                        opacity: 1;
                        transition: all 0.3s;
                    }

                    img {
                        width: 100%;

                    }

                    .earphone {
                        display: inline-block;
                        position: absolute;
                        font-size: 0.8rem;
                        background-image: linear-gradient(to right, rgba(255, 255, 255, 0), rgba(39, 39, 39, 0.5));
                        padding: 3px 10px 3px 30px;
                        top: 0;
                        right: 0;
                    }
                }
            }
        }
    }
}
</style>
