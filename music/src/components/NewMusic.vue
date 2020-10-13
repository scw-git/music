<template>
<div class="newMusic">
    <!-- 分类 -->
    <div class="type">
        <span @click="tag='0'" :class="{active:tag=='0'}">全部</span>
        <span @click="tag='7'" :class="{active:tag=='7'}">华语</span>
        <span @click="tag='96'" :class="{active:tag=='96'}">欧美</span>
        <span @click="tag='8'" :class="{active:tag=='8'}">日本</span>
        <span @click="tag='16'" :class="{active:tag=='16'}">韩国</span>
    </div>
    <!-- 新歌速递 -->
    <div class="newMusic">
        <div class="items">
            <div class="item" v-for="(item,i) in musiclists" :key="i">
                <div class="count">{{i+1 |formatNum}}</div>
                <div class="img-wrap" @click="playmusic(item.id)">
                    <img :src="item.album.picUrl" alt="">
                    <span class="iconfont icon-play2 playicon"></span>
                </div>
                <div class="detail">
                    <div class="songname">{{item.name}}</div>
                    <div class="singer">{{item.album.artists[0].name}}</div>
                </div>
            </div>
        </div>
    </div>
</div>
</template>

<script>
export default {
    data() {
        return {
            tag: 0,
            musiclists: [],
            url: '',
            allid: []
        }
    },
    methods: {
        getMusic() {
            this.$axios({
                method: 'get',
                url: '/top/song',
                params: {
                    type: this.tag
                }
            }).then(res => {
                this.musiclists = res.data.data
                //获取所有歌曲的ID
                for (let i = 0; i < this.musiclists.length; i++) {
                    this.allid.push(this.musiclists[i].id)
                }
                // console.log(this.allid)
            })
        },
        playmusic(id) {
            this.$axios.get('/song/url?id=' + id).then(res => {
                this.url = res.data.data[0].url
                this.$parent.url = this.url
                this.$parent.currentId = id
                this.$parent.allSongsId = this.allid
                // console.log(res)
            })
        },

    },
    watch: {
        tag() {
            this.getMusic()
        }
    },
    created() {
        this.getMusic()

    }
}
</script>

<style scoped>
.type {
    margin-top: 10px;
    margin-bottom: 50px;
}

.type .active {
    color: rgb(224, 126, 21);
}

.type span {
    cursor: pointer;
    padding: 8px;
}

.newMusic .item {
    width: 18%;
    padding: 10px 5px;
}

.newMusic .item>p {
    padding-top: 5px;
    font-size: 0.9rem;
}

.newMusic .item .img-wrap {
    position: relative;
    overflow: hidden;
    cursor: pointer;
}

.newMusic .item .img-wrap img {
    width: 100%;
    height: 100%;
    border-radius: 0.4rem;
}

.newMusic .item .img-wrap .cover-content {
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

.newMusic .item .img-wrap:hover .cover-content {
    transition: all 0.5s;
    top: 0;
}

.newMusic .item .img-wrap .cover-content p {
    padding-left: 5px;
    font-size: 0.8rem;
}

.newMusic .cover-play-btn {
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

.newMusic .item .img-wrap:hover .cover-play-btn {
    opacity: 1;
    transition: all 0.8s;
}

.newMusic .cover-play-btn>div {
    color: rgb(198, 47, 47);
    font-size: 1.5rem;
}

/**最新音乐 */

.newMusic .items {
    display: flex;
    flex-wrap: wrap;
}

.newMusic .item {
    display: flex;
    width: 49%;
    /*不懂为啥，设置50%会掉下来 */
}

.newMusic .item .count {
    height: 100px;
    width: 50px;
    line-height: 100px;
}

.newMusic .item .img-wrap {
    position: relative;
    height: 100%;
    width: 100px;
}

.newMusic .item .img-wrap .playicon {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
    line-height: 1.8rem;
    display: inline-block;
    width: 1.8rem;
    height: 1.8rem;
    border-radius: 0.9rem;
    background-color: rgba(255, 255, 255, 0.5);
    color: rgb(198, 47, 47);
}

.newMusic .detail {
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding-left: 8px;
}

.newMusic .detail .singer {
    margin-top: 20px;
    font-size: 0.9rem;
    color: rgb(96, 98, 126)
}
</style>
