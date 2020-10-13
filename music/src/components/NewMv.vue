<template>
<div class="NewMv">
    <!-- 地区分类 -->
    <div class="area ">
        <span class=" first">地区：</span>
        <span @click="area='全部'" :class="{active:area=='全部'}">全部</span>
        <span @click="area='内地'" :class="{active:area=='内地'}">内地</span>
        <span @click="area='港台'" :class="{active:area=='港台'}">港台</span>
        <span @click="area='欧美'" :class="{active:area=='欧美'}">欧美</span>
        <span @click="area='日本'" :class="{active:area=='日本'}">日本</span>
        <span @click="area='韩国'" :class="{active:area=='韩国'}">韩国</span>
    </div>
    <!-- 类型 -->
    <div class="type ">
        <span class=" first">类型：</span>
        <span @click="type='全部'" :class="{active:type=='全部'}">全部</span>
        <span @click="type='官方版'" :class="{active:type=='官方版'}">官方版</span>
        <span @click="type='原声'" :class="{active:type=='原声'}">原声</span>
        <span @click="type='现场版'" :class="{active:type=='现场版'}">现场版</span>
        <span @click="type='网易出品'" :class="{active:type=='网易出品'}">网易出品</span>
    </div>
    <!-- 排序 -->
    <div class="order">
        <span class=" first">排序：</span>
        <span @click="order='上升最快'" :class="{active:order=='上升最快'}">上升最快</span>
        <span @click="order='官方版'" :class="{active:order=='官方版'}">官方版</span>
        <span @click="order='最热'" :class="{active:order=='最热'}">最热</span>
        <span @click="order='最新'" :class="{active:order=='最新'}">最新</span>

    </div>
    <!-- 精彩MV-->
    <div class="NewMv">
        <div class="items">
            <div class="item" v-for="(item,i) in mv" :key="i" @click="toDetailMV(item.id)">
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
    <!--分页器-->
    <div class="fy">
        <el-pagination background layout="prev, pager, next" :total="total" @current-change="handleCurrentChange" :page-size="limit" :current-page='page'>
        </el-pagination>
    </div>
</div>
</template>

<script>
export default {
    data() {
        return {
            area: '全部',
            type: '全部',
            order: '上升最快',
            limit: 28,
            page: 1,
            total: 100,
            mv: [],
        }
    },
    methods: {
        handleCurrentChange(val) {
            // console.log(`当前页: ${val}`);
            this.page = val
            this.getMv()

        },
        //  跳转到mv详情
        toDetailMV(id) {
            this.$router.push({
                path: '/DetailMv',
                query: {
                    mvId: id
                }
            })
        },
        getMv() {
            this.$axios({
                method: 'get',
                url: '/mv/all',
                params: {
                    area: this.area,
                    type: this.type,
                    order: this.order,
                    limit: this.limit,
                    offset: (this.page - 1) * this.limit
                }
            }).then(res => {
                {
                    this.mv = res.data.data
                    if (res.data.count) {
                        this.total = res.data.count
                    }
                    console.log(res.data)
                }
            })
        }
    },
    watch: {
        area() {
            this.getMv()
            this.page = 1

        },
        type() {
            this.getMv()
            this.page = 1

        },
        order() {
            this.getMv()
            this.page = 1

        },
    },
    created() {
        this.getMv()
    }
}
</script>

<style scoped>
.area {
    margin-top: 10px;
    margin-bottom: 20px;
}

.type {
    margin-bottom: 20px;
}

.order {
    margin-bottom: 40px;
}

.area .active,
.type .active,
.order .active {
    color: rgb(224, 126, 21);
}

.NewMv span {
    cursor: pointer;
    padding: 10px 20px;
}

.NewMv .first {
    padding-left: 0;
}

.NewMv>>>.el-pagination.is-background .el-pager li:not(.disabled) {
    background-color: rgb(244, 244, 245);
    color: rgb(0, 0, 0);
}

.NewMv>>>.el-pagination.is-background .el-pager li:not(.disabled).active {
    background-color: rgb(230, 175, 23);
    color: white;
}

.NewMv>>>.el-pagination.is-background .el-pager li:not(.disabled):hover {
    color: rgb(255, 189, 7);

}

.fy {
    display: flex;
    justify-content: center;
    margin-top: 10px;
}

/**公共属性开始 */
.NewMv .item {
    width: 18%;
    padding: 10px 5px;
}

.NewMv .item>p {
    padding-top: 5px;
    font-size: 0.9rem;
}

.NewMv .item .img-wrap {
    position: relative;
    overflow: hidden;
    cursor: pointer;
}

.NewMv .item .img-wrap img {
    width: 100%;
    height: 100%;
    border-radius: 0.4rem;
}

.NewMv .item .img-wrap .cover-content {
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

.NewMv .item .img-wrap:hover .cover-content {
    transition: all 0.5s;
    top: 0;
}

.NewMv .item .img-wrap .cover-content p {
    padding-left: 5px;
    font-size: 0.8rem;
}

.NewMv .cover-play-btn {
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

.NewMv .item .img-wrap:hover .cover-play-btn {
    opacity: 1;
    transition: all 0.8s;
}

.NewMv .cover-play-btn>div {
    color: rgb(198, 47, 47);
    font-size: 1.5rem;
}

.NewMv .items {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
}

.NewMv .items .item {
    width: 24%;
}

.NewMv .items .item .name {
    margin: 8px 5px;
    font-size: 0.9rem;
}

.NewMv .items .item .img-wrap {
    width: 100%;
    position: relative;
}

.NewMv .items .item .img-wrap .cover {
    position: absolute;
    top: 8px;
    right: 10px;
    color: white;
}

.NewMv .items .item .img-wrap .cover span {
    padding: 0 3px;
}
</style>
