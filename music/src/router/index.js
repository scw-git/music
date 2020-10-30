import Vue from 'vue'
import VueRouter from 'vue-router'
import FindMusic from '../components/recommend/findMusic/FindMusic.vue'
import RecommendMusic from '../components/recommend/findMusic/RecommendMusic.vue'
import NewMusic from '../components/recommend/findMusic/NewMusic.vue'
import TopList from '../components/recommend/findMusic/TopList.vue'
import Video from '../components/recommend/video/Video.vue'
import NewMv from '../components/recommend/video/NewMv.vue'
import CloudMusic from '../components/myMusic/CloudMusic.vue'
import MyCollect from '../components/myMusic/MyCollect.vue'
import FavMusic from '../components/createPlayList/FavMusic.vue'
import CollectPlayList from '../components/collectPlayList/CollectPlayList.vue'
import DetailPlayList from '../components/detail/DetailPlayList.vue'
import DetailVideo from '../components/detail/DetailVideo.vue'
import DetailSong from '../components/detail/DetailSong.vue'
import SearchResult from '../components/searchResult/SearchResult.vue'
import tab from '../components/common/tab.vue'
import tabVideo from '../components/common/tabVideo.vue'

Vue.use(VueRouter)

const routes = [{
        path: '/',
        redirect: '/tab'
    },
    {
        path: '/tabVideo',
        component: tabVideo,
        redirect: '/tabVideo/Video',
        // meta: {
        //     keepAlive: true
        // },
        children: [{
            path: 'Video',
            component: Video
        }, {
            path: 'NewMv',
            component: NewMv,
            // meta: { keepAlive: true }
        }, ]
    },
    {
        path: '/tab',
        component: tab,
        redirect: '/tab/FindMusic',
        children: [{
                path: 'RecommendMusic',
                component: RecommendMusic
            },
            {
                path: 'FindMusic',
                component: FindMusic
            },
            {
                path: 'NewMusic',
                component: NewMusic
            }, {
                path: 'TopList',
                component: TopList
            }, {
                path: 'NewMv',
                component: NewMv,
            },
        ]
    },
    {
        path: '/SearchResult',
        component: SearchResult,
        // meta: {
        //     keepAlive: true
        // }
    }, {
        path: '/DetailPlayList',
        component: DetailPlayList,
        // meta: {
        //     keepAlive: true
        // }
    }, {
        path: '/DetailMv',
        component: () =>
            import ('../components/detail/DetailMv.vue')
    }, {
        path: '/DetailSong',
        component: DetailSong
    },
    {
        path: '/DetailVideo',
        component: DetailVideo
    },
    {
        path: '/CloudMusic',
        component: CloudMusic
    }, {
        path: '/MyCollect',
        component: MyCollect
    }, {
        path: '/FavMusic',
        component: FavMusic,
        // redirect: '/FavMusic/DetailPlayList',
        children: [{
            path: 'DetailPlayList',
            component: DetailPlayList,
        }, ]
    }, {
        path: '/CollectPlayList',
        component: CollectPlayList,
        children: [{
            path: 'DetailPlayList',
            component: DetailPlayList,
        }, ]
    },


]

const router = new VueRouter({
    routes
})

export default router