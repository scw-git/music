<template>
<div class="tab">
    <ul class="items">
        <li>
            <router-link to='/tab/FindMusic'><span></span>个性推荐</router-link>
        </li>
        <li>
            <router-link to='/tab/RecommendMusic'><span></span>歌单</router-link>
        </li>
        <li>
            <router-link to='/tab/TopList'><span></span>排行榜</router-link>
        </li>
        <li>
            <router-link to='/tab/NewMusic'><span></span>最新音乐
            </router-link>
        </li>

    </ul>
    <keep-alive>
        <router-view></router-view>
    </keep-alive>

</div>
</template>

<script>
export default {
    data() {
        return {

        }
    },
}
</script>

<style lang="less">
.tab {
    .items {
        width: 100%;
        height: 100%;
        list-style: none;
        display: flex;
        justify-content: center;
        border-bottom: 1px solid #e1e1e2;
        margin-bottom: 30px;

        li {
            margin: 0 15px;
        }

        a {
            box-sizing: border-box;
            width: 100%;
            display: inline-block;
            padding: 15px 15px;
            color: rgb(102, 102, 102);
            font-size: 0.9rem;
            text-decoration: none;

            &:hover {
                color: #c62f2f;
            }
        }

        .router-link-exact-active {
            color: #c62f2f;
            border-bottom: 1px solid #c62f2f;
        }
    }
}
</style>
