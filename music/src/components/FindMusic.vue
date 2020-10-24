<template>
<div class="FindMusic">

    <!--轮播图-->
    <el-carousel :interval="4000" type="card" height="250px">
        <el-carousel-item v-for="(item,i) in banners" :key="i">
            <img class="lbt-img" :src="item.imageUrl" alt="">
        </el-carousel-item>
    </el-carousel>
    <!--推荐歌单-->
    <div class="recommend">
        <h2 class="title">推荐歌单
            <router-link to='/tab/RecommendMusic'><span></span>更多></router-link>
        </h2>
        <div class="items">
            <div class="item" v-for="(item,i) in lists" :key="i" @click="toDetail(item.id)">
                <div class="img-wrap">
                    <img :src="item.picUrl" alt="">
                    <div class="cover-play-btn ">
                        <div class="iconfont icon-play2"></div>
                    </div>
                    <div class="cover-content">
                        <p>{{item.copywriter}}</p>
                    </div>
                </div>
                <p>{{item.name}}</p>
            </div>

        </div>
    </div>
    <!-- 最新音乐 -->
    <div class="newMusic" v-loading="loading">
        <h2 class="title">最新音乐 <router-link to='/tab/NewMusic'><span></span>更多></router-link>
        </h2>
        <div class="items">
            <div class="item" v-for="(item,i) in newsong" :key="i">
                <div class="count">{{i+1 |formatNum}}</div>
                <div class="img-wrap" @click="playmusic(item.id)">
                    <img :src="item.picUrl" alt="">
                    <span class="iconfont icon-play2 playicon"></span>
                </div>
                <div class="detail">
                    <div class="songname">{{item.name}}</div>
                    <div class="singer">{{item.song.artists[0].name}}</div>
                </div>
            </div>
        </div>
    </div>
    <!-- 精彩MV-->
    <mv url='/mv/all?limit=8' />

</div>
</template>

<script>
import mv from './common/mv'
export default {
    components: {
        mv,
    },
    data() {
        return {
            banners: '', //轮播图
            lists: [], //推荐歌单
            newsong: [], //最新音乐
            allid: [], //最新音乐所有的id
            loading: false
        }
    },
    methods: {
        //  跳转到详情歌单
        toDetail(id) {
            this.$router.push({
                path: '/DetailPlayList',
                query: {
                    playListId: id
                }
            })
        },

        //把歌曲id传到父组件中
        playmusic(id) {
            this.$axios.get('/song/url?id=' + id).then(res => {
                this.$vue.$emit('playData', {
                    url: res.data.data[0].url,
                    currentId: id,
                    allSongsId: this.allid

                })
                // console.log(this.allid)
            })
        },
        getallid() { //最新音乐所有的id
            for (let i = 0; i < this.newsong.length; i++) {
                this.allid.push(this.newsong[i].id)
                // console.log(this.allid)
            }
        },
    },

    created() {
        //轮播图
        this.$axios.get('/banner').then(res => {
            this.banners = res.data.banners
            // console.log(this.banners)
        })
        //推荐歌单
        this.$axios.get('/personalized?limit=10').then(res => {
            this.lists = res.data.result
            // console.log(this.lists)
        })
        //最新音乐
        this.$axios.get('/personalized/newsong').then(res => {
            this.newsong = res.data.result
            // console.log(this.allurl)
        }).then(() => { //获取所有ID
            this.getallid() //必须要执行完获取音乐，才能执行获取id
        })

    },

}
</script>

<style>
.FindMusic .title {
    padding: 2rem 0 0.7rem 0;
    font-weight: normal;
    color: #252525;
    border-bottom: 1px solid #e1e1e2;
    margin-bottom: 0.3rem;
}

.FindMusic .title a {
    float: right;
    font-size: 0.8rem;
    text-decoration: none;
    color: #475669;
    margin-top: 18px;
    margin-right: 20px;
}

.lbt-img {
    /*如果标签在第三方的组件，设置样式时不起作用。父容器类名>>>要设置的类名 */
    height: 100%;
    width: 100%;
    border-radius: 0.5rem;
}

.el-carousel-item {
    border-radius: 10px;
}

.el-carousel__item h3 {
    color: #475669;
    font-size: 14px;
    opacity: 0.75;
    line-height: 200px;
    margin: 0;
}

.el-carousel__item:nth-child(2n) {
    background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n+1) {
    background-color: #d3dce6;
}

/**列表 */
.recommend .items {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
}

/**公共属性开始 */
.FindMusic .item {
    width: 18.5%;
    padding: 10px 5px;
}

.FindMusic .item>p {
    padding-top: 5px;
    font-size: 0.9rem;
}

.FindMusic .item .img-wrap {
    position: relative;
    overflow: hidden;
    cursor: pointer;
}

.FindMusic .item .img-wrap img {
    width: 100%;
    height: 100%;
    border-radius: 0.4rem;
}

.FindMusic .item .img-wrap .cover-content {
    position: absolute;
    box-sizing: border-box;
    border-radius: 0.5rem 0.5rem 0 0;
    line-height: 1.1rem;
    top: -70px;
    color: white;
    font-size: 0.8rem;
    padding: 0.2rem;
    width: 100%;
    min-height: 2rem;
    max-height: 5rem;
    background-color: rgba(0, 0, 0, 0.5);
    transition: all 0.5s;
}

.FindMusic .item .img-wrap:hover .cover-content {
    transition: all 0.5s;
    top: 0;
}

.FindMusic .item .img-wrap .cover-content p {
    padding-left: 5px;
    font-size: 0.8rem;
}

.FindMusic .cover-play-btn {
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    padding: 0.5rem;
    right: 0.5rem;
    bottom: 0.8rem;
    background-color: rgba(0, 0, 0, 0.5);
    border-radius: 5rem;
    opacity: 0;
    transition: all 0.5s;
}

.FindMusic .item .img-wrap:hover .cover-play-btn {
    opacity: 1;
    transition: all 0.8s;
}

.FindMusic .cover-play-btn>div {
    color: white;

}

/**公共属性结尾 */

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
    background-color: rgba(0, 0, 0, 0.5);
    color: white
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
