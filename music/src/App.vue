<template>
<div id="app">
    <my-header></my-header>
    <my-body></my-body>
    <login />
</div>
</template>

<script>
import Body from './views/Body'
import Header from './views/Header'
import Login from './views/Login'

export default {
    data() {
        return {

        }
    },
    name: 'app',
    components: {
        'myHeader': Header,
        'myBody': Body,
        Login,
    }
}
</script>

<style>
@media screen and (max-width: 719px) {
    html {
        font-size: 6px;
        transition: all 1s;
    }
}

@media screen and (min-width: 920px) {
    html {
        font-size: 16px;
        transition: all 1s;
    }
}

* {
    padding: 0;
    margin: 0;
}
</style>
