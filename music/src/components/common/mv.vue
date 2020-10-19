<template>
<!-- 精彩MV-->
<div class="wypublish">
    <h2 class="title" v-if="titleShow">精彩MV</h2>
    <div class="items">
        <div class="item" v-for="(item,i) in wypublish" :key="i" @click="toDetailMv(item.id)">
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
        //  跳转到mv详情
        toDetailMv(id) {
            this.$router.push({
                path: '/DetailMv',
                query: {
                    mvId: id
                }
            })
        },
    },
    created() {
        //精彩MV
        this.$axios.get(this.url).then(res => {
            if (res.data.data) {
                this.wypublish = res.data.data
            } else if (res.data.result.mvs) {
                this.wypublish = res.data.result.mvs
                this.titleShow = false
                this.total = res.data.result.mvCount
            }
        })
    },
    watch: {
        total() {
            this.$emit('total', this.total)
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

/**公共属性开始 */
.wypublish .item {
    width: 18%;
    padding: 10px 5px;
}

.wypublish .item>p {
    padding-top: 5px;
    font-size: 0.9rem;
}

.wypublish .item .img-wrap {
    position: relative;
    overflow: hidden;
    cursor: pointer;
}

.wypublish .item .img-wrap img {
    width: 100%;
    height: 100%;
    border-radius: 0.4rem;
}

.wypublish .item .img-wrap .cover-content {
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

.wypublish .item .img-wrap:hover .cover-content {
    transition: all 0.5s;
    top: 0;
}

.wypublish .item .img-wrap .cover-content p {
    padding-left: 5px;
    font-size: 0.8rem;
}

.wypublish .cover-play-btn {
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

.wypublish .item .img-wrap:hover .cover-play-btn {
    opacity: 1;
    transition: all 0.8s;
}

.wypublish .cover-play-btn>div {
    color: rgb(198, 47, 47);
    font-size: 1.5rem;
}

/**公共属性结尾 */
</style>
