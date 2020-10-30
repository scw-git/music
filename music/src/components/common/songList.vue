<template>
<div class="songList">
    <table class="el-table ">
        <thead>
            <th>#</th>
            <th>音乐标题</th>
            <th>歌手</th>
            <th>专辑名</th>
            <th>时长</th>
        </thead>
        <tbody>
            <tr v-for="(item,i) in songs" :key="i" @dblclick="play(item.id,i)" :class="{red:index==i}">
                <td>{{i+1|formatNum}}</td>
                <td>{{item.name}} <span v-if="item.mvid!=0" class="iconfont icon-bofanganniu btn" @click="toDetailMv(item.mvid)"></span></td>
                <td>{{item.artists[0].name}}</td>
                <td>{{item.album.name}}</td>
                <td>{{item.duration |formatDuration}}</td>
            </tr>
        </tbody>
    </table>
</div>
</template>

<script>
export default {
    props: ['songs'],
    data() {
        return {
            index: -1
        }
    },
    mounted() {
        this.$vue.$on('index', res => {
            this.index = res
        })
    },
    methods: {
        play(id, i) {
            this.index = i
            this.$emit('playInfo', {
                id: id,
                i: i
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
}

.red {
    color: #c63030;
}
</style>
