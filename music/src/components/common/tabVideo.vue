<template>
<div class="tabVideo">
    <ul class="items">
        <li>
            <router-link to='/tabVideo/Video'><span></span>视频</router-link>
        </li>
        <li>
            <router-link to='/tabVideo/NewMv'><span></span>MV</router-link>
        </li>

    </ul>
    <router-view></router-view>

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
.tabVideo {
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
