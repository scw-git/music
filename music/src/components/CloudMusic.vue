<template>
<div class="songList">
    <p>我的音乐云盘</p>
    <table class="el-table ">
        <thead>
            <th>#</th>
            <th>音乐标题</th>
            <th>歌手</th>
            <th>专辑名</th>
            <th>上传时间</th>
        </thead>
        <tbody>
            <tr v-for="(item,i) in songs" :key="i" @dblclick="play(item.songId,i)" :class="{red:index==i}">
                <td>{{i+1|formatNum}}</td>
                <td>{{item.songName}} <span v-if="item.simpleSong.mv!=0" class="iconfont icon-bofanganniu btn" @click="toDetailMv(item.mvid)"></span></td>
                <td>{{item.artist}}</td>
                <td>{{item.album}}</td>
                <td>{{item.addTime |formatTime}}</td>
            </tr>
        </tbody>
    </table>
</div>
</template>

<script>
export default {

    data() {
        return {
            index: -1,
            allid: [],
            songs: []
        }
    },
    mounted() {
        this.$vue.$on('index', res => {
            this.index = res
        })
    },
    created() {
        this.getCloud()
       
    },
    methods: {
        getCloud() {
            this.$axios({
                method: 'get',
                url: '/user/cloud',
                withCredentials: true, //关键
            }).then(res => {
                this.songs = res.data.data
                for (let i = 0; i < this.songs.length; i++) {
                    this.allid.push(this.songs[i].songId)
                }
                // console.log(res)
            })

        },
        play(id, i) {
            // console.log(id)
            this.index = i
            this.$axios({
                method: 'get',
                url: '/song/url',
                withCredentials: true, //关键
                params: {
                    id: id
                },
            }).then(res => {
                // console.log(res)
                let url = res.data.data[0].url
                this.$vue.$emit('CloudMusicInfo', {
                    url: url,
                    currentId: id,
                    allSongsId: this.allid,
                    index: i
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
    }
}
</script>

<style scoped>
.content>>>.el-tabs__active-bar {
    background-color: #c3473a;

}

.content>>>.el-tabs__item:hover,
.content>>>.el-tabs__item.is-active {
    color: #c3473a;
}

.content>>>.el-tabs__nav-scroll {
    display: flex;
    justify-content: center;

}

.content>>>.el-tabs__item {
    padding: 0 30px;
    font-size: 1.1rem;
}

.songList>p {
    margin-top: 2rem;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid #e0e0e0;
    font-size: 1.3rem;
}

.el-table {
    border-collapse: collapse
}

.el-table td {
    border: 0;
}

.el-table td,
.el-table th {
    padding: 25px 50px 25px 25px;
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
}

.red {
    color: #c63030;
}
</style>
