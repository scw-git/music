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
        <table class="el-table ">
            <thead>
                <th>#</th>
                <th></th>
                <th>音乐标题</th>
                <th>歌手</th>
                <th>专辑名</th>
                <th>时长</th>
            </thead>
            <tbody>
                <tr v-for="(item,i) in musiclists" :key="i" :class="{red:index==i}" @dblclick="play(item.id,i)">
                    <td> {{i+1|formatNum}}</td>
                    <td><img class="img" :src="item.album.picUrl" alt=""></td>
                    <td>{{item.name}}<span v-if="item.mvid!=0" class="iconfont icon-bofanganniu btn" @click="toDetailMv(item.mvid)"></span></td>
                    <td>{{item.artists[0].name}}</td>
                    <td>{{item.album.name}}</td>
                    <td>{{item.duration |formatDuration}}</td>
                </tr>
            </tbody>
        </table>
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
            allid: [],
            index: -1,
        }
    },
    mounted() {
        this.$vue.$on('index', (res) => { //接收一个函数，res中保存传过来的值
            this.index = res
        })
    },
    methods: {
        //把歌曲id传到父组件中
        play(id, i) {
            this.index = i //如果不加这个，第一个点击的不会变红
            this.$axios.get('/song/url?id=' + id).then(res => {
                this.$vue.$emit('playData', {
                    url: res.data.data[0].url,
                    currentId: id,
                    allSongsId: this.allid,
                    index: this.index

                })
            })
        },
        //  跳转到mv详情
        toDetailMv(id) {
            this.$router.push({
                path: '/DetailMv',
                query: {
                    mvId: id
                }
            })
        },

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
                console.log(this.musiclists)
            })
        },
        playmusic(id) {
            this.$axios.get('/song/url?id=' + id).then(res => {
                this.url = res.data.data[0].url
                this.$vue.$emit('playData', {
                    url: this.url,
                    currentId: id,
                    allSongsId: this.allid
                })
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
.el-table .img {
    width: 50px;
}

.comment {
    margin-top: 15px;
}

.comment>>>.el-tabs__active-bar {
    background-color: #c3473a;

}

.comment>>>.el-tabs__item:hover,
.comment>>>.el-tabs__item.is-active {
    color: #c3473a;
}

.el-table {
    border-collapse: collapse
}

.el-table td {
    border: 0;
}

.el-table td,
.el-table th {
    padding: 25px 15px 25px 25px;
}

.el-table tr:nth-child(2n) {
    background-color: rgb(249, 249, 249);
}

.el-table tr:hover {
    background-color: rgb(240, 240, 240);

}

.el-table .btn {
    font-size: 0.5rem;
    color: red;
    border: 1px solid red;
    cursor: pointer;
    margin-left: 5px;
}

.red {
    color: #c63030;
}

.type {
    margin-top: 10px;
    padding-bottom: 15px;
    border-bottom: 1px solid #e1e1e2;
}

.type .active {
    color: #c62f2f;
    border-bottom: 1px solid #c62f2f;
}

.type span {
    cursor: pointer;
    padding: 8px;
    padding-bottom: 15px;

}
</style>
