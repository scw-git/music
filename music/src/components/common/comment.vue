<template>
<div class="comment">

    <div class="comment-wrap ">
        <p>精彩评论</p>
        <div class="comments-wrap" v-for="(item,i) in hotComment" :key="i">
            <!--头像-->
            <img :src="item.user.avatarUrl" alt="">
            <div class="content-wrap">
                <!--评论-->
                <div class="content">
                    <span>{{item.user.nickname}}: </span>
                    <span>{{item.content}}</span>
                </div>
                <!--回复评论  注意：一定要先判断是否存在在填数据，否则填对了也不显示-->
                <div class="re-content" v-if="item.beReplied.length!=0">
                    <span>{{item.beReplied[0].user.nickname}}：</span>
                    <span>{{item.beReplied[0].content}}</span>
                </div>
                <!--时间-->
                <span class="time">{{item.time |formatTime}}</span>
            </div>
        </div>
    </div>

    <div class="comment-wrap newComment">
        <p>最新评论( {{ this.total}} )</p>
        <div class="comments-wrap" v-for="(item,i) in newComment" :key="i">
            <!--头像-->
            <img :src="item.user.avatarUrl" alt="">
            <div class="content-wrap">
                <!--评论-->
                <div class="content">
                    <span>{{item.user.nickname}}: </span>
                    <span>{{item.content}}</span>
                </div>
                <!--回复评论  注意：一定要先判断是否存在在填数据，否则填对了也不显示-->
                <div class="re-content" v-if="item.beReplied.length!=0">
                    <span>{{item.beReplied[0].user.nickname}}：</span>
                    <span>{{item.beReplied[0].content}}</span>
                </div>
                <!--时间-->
                <span class="time">{{item.time |formatTime}}</span>
            </div>
        </div>
    </div>
    <!--分页器-->
    <div class="fy" v-if="total!=0">
        <el-pagination background layout="prev, pager, next" :total="total" @current-change="handleCurrentChange" :page-size="limit" :current-page='page'>
        </el-pagination>
    </div>
</div>
</template>

<script>
export default {
    props: ['id', 'url'],
    data() {
        return {
            total: 0,
            limit: 20,
            page: 1,
            hotComment: [],
            newComment: [],
        }
    },
    methods: {
        handleCurrentChange(val) {
            this.page = val
            this.getComment()
            console.log(`当前页: ${this.page}`);
        },
        //获取歌曲评论
        getComment() {
            this.$axios({
                method: 'get',
                url: this.url,
                params: {
                    id: this.id,
                    limit: this.limit,
                    offset: (this.page - 1) * this.limit
                }
            }).then(res => {
                this.total = res.data.total
                this.hotComment = res.data.hotComments
                this.newComment = res.data.comments
                // console.log(res)
                // console.log(this.newComment)
            })
        },

    },
    created() {
        this.getComment()
    },
    watch: {
        id() {
            this.getComment()
        },
        total() { //最好写在这里，因为网络请求是异步的。写在created和mounted中，数据不一定已经拿到
            this.$emit('total', this.total);
        }
    }

}
</script>

<style scoped>
.comment-wrap {
    margin-top: 30px;
}

.newComment {
    margin-top: 50px;
}

.comments-wrap {
    display: flex;
    margin-top: 10px;
    font-size: 0.9rem;
    border-bottom: 1px solid #efefef;
    padding: 15px 0;
}

.comments-wrap img {
    height: 40px;
    border-radius: 20px;
}

.content-wrap {
    flex: 1;
    margin-left: 15px;
}

.content-wrap .content span:first-child,
.content-wrap .re-content span:first-child {
    color: #5192cb;
}

.content-wrap .re-content {
    margin: 10px 0 5px;
    background-color: #f1f1f4;
    padding: 10px;
}

.content-wrap .time {
    color: #99a5c0;
    font-size: 0.8rem;
}

.comment>>>.el-pagination.is-background .el-pager li:not(.disabled) {
    background-color: rgb(244, 244, 245);
    color: rgb(0, 0, 0);
}

.comment>>>.el-pagination.is-background .el-pager li:not(.disabled).active {
    background-color: rgb(230, 175, 23);
    color: white;
}

.comment>>>.el-pagination.is-background .el-pager li:not(.disabled):hover {
    color: rgb(255, 189, 7);

}

.fy {
    display: flex;
    justify-content: center;
    margin-top: 20px;
}
</style>
