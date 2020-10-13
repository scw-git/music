import Vue from 'vue'
import VueRouter from 'vue-router'
import FindMusic from '../components/FindMusic.vue'
import RecommendMusic from '../components/RecommendMusic.vue'
import NewMusic from '../components/NewMusic.vue'
import NewMv from '../components/NewMv.vue'
import SearchResult from '../components/SearchResult.vue'
import DetailPlayList from '../components/DetailPlayList.vue'
import DetailMv from '../components/DetailMv.vue'
import SongDetail from '../components/SongDetail.vue'

Vue.use(VueRouter)

const routes = [{
        path: '/',
        redirect: '/FindMusic'
    },
    {
        path: '/FindMusic',
        component: FindMusic
    },
    {
        path: '/RecommendMusic',
        component: RecommendMusic
    },
    {
        path: '/NewMusic',
        component: NewMusic
    }, {
        path: '/NewMv',
        component: NewMv
    }, {
        path: '/SearchResult',
        component: SearchResult
    }, {
        path: '/DetailPlayList',
        component: DetailPlayList
    }, {
        path: '/DetailMv',
        component: DetailMv
    }, {
        path: '/SongDetail',
        component: SongDetail
    },


]

const router = new VueRouter({
    routes
})

export default router