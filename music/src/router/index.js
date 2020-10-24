import Vue from 'vue'
import VueRouter from 'vue-router'
import FindMusic from '../components/FindMusic.vue'
import RecommendMusic from '../components/RecommendMusic.vue'
import NewMusic from '../components/NewMusic.vue'
import NewMv from '../components/NewMv.vue'
import SearchResult from '../components/SearchResult.vue'
import DetailPlayList from '../components/DetailPlayList.vue'
import SongDetail from '../components/SongDetail.vue'
import tab from '../components/common/tab.vue'
import tabVideo from '../components/common/tabVideo.vue'
import TopList from '../components/TopList.vue'
import Video from '../components/Video.vue'
import DetailVideo from '../components/DetailVideo.vue'

Vue.use(VueRouter)

const routes = [{
        path: '/',
        redirect: '/tab'
    },
    {
        path: '/tabVideo',
        component: tabVideo,
        redirect: '/tabVideo/Video',
        meta: {
            keepAlive: true
        },
        children: [{
            path: 'Video',
            component: Video
        }, {
            path: 'NewMv',
            component: NewMv
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
            },
        ]
    },
    {
        path: '/SearchResult',
        component: SearchResult
    }, {
        path: '/DetailPlayList',
        component: DetailPlayList,
        meta: {
            keepAlive: true
        }
    }, {
        path: '/DetailMv',
        component: () =>
            import ('../components/DetailMv.vue')
    }, {
        path: '/SongDetail',
        component: SongDetail
    },
    {
        path: '/DetailVideo',
        component: DetailVideo
    },


]

const router = new VueRouter({
    routes
})

export default router