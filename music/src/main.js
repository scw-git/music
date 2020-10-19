import Vue from 'vue'
// import './plugins/axios'   不能用 vue add axios 是 npm i axios
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import axios from 'axios'



Vue.prototype.$axios = axios.create({
    baseURL: 'https://api.mtnhao.com'
})

Vue.prototype.$vue = new Vue() //创建空的实例，用于事件总线

//格式最新音乐中的数字
Vue.filter('formatNum', (num) => {
        if (num < 10) {
            return num = '0' + num
        } else {
            return num
        }
    })
    //格式化播放量
Vue.filter('formatPlayCount', (count) => {
        if (count > 100000) {
            return parseInt(count / 10000) + '万'
        } else {
            return count
        }
    })
    //格式化时长1(毫米转分秒)
Vue.filter('formatDuration', dt => {
        let m = parseInt(dt / 1000 / 60)
        if (m < 10) {
            m = '0' + m
        } else { m = m }
        //方法一：
        // let s = (parseInt(dt / 1000 % 60) 
        // if (s < 10) {
        //     s = '0' + s
        // } else { s = s }
        //方法二：
        let s = (parseInt(dt / 1000 % 60) + '').padStart(2, '0')

        return m + ':' + s
    })
    //格式化时长2(秒转分秒)
Vue.filter('formatDt', (time) => {
        let m = (parseInt(time / 60) + '').padStart(2, '0')
        let s = (parseInt(time % 60) + '').padStart(2, '0')
        return `${m}:${s}`
    })
    //格式化年月日
Vue.filter('formatYMD', function(time) {
        let md = new Date(time)
        let y = md.getFullYear()
        let m = (md.getMonth() + 1 + '').padStart(2, '0')
            //padStart()和padStart()一共接受两个参数，第一个参数用来指定字符串的最小长度，第二个参数是用来补全的字符串。
            // let m = '5'.padStar(2,'0') 如果是字符串形式，不用加''。参数形式要加个''
        let d = (md.getDate() + '').padStart(2, '0')
        return `${y}-${m}-${d}`

    })
    //格式化年月日时分
Vue.filter('formatTime', time => {
    let md = new Date(time)
    let y = md.getFullYear()
    let m = (md.getMonth() + 1 + '').padStart(2, '0')
    let d = (md.getDate() + '').padStart(2, '0')
    let h = (md.getHours() + '').padStart(2, '0')
    let s = (md.getMinutes() + '').padStart(2, '0')
    return `${y}-${m}-${d} ${h}:${s}`

})

Vue.config.productionTip = false

new Vue({
    router,
    render: h => h(App)
}).$mount('#app')