<template>
<div id="app">
    <my-header></my-header>
    <my-body></my-body>
</div>
</template>

<script>
import Body from './views/Body'
import Header from './views/Header'

export default {
    data() {
        return {

        }
    },
    name: 'app',
    components: {
        'myHeader': Header,
        'myBody': Body,
    }
}
</script>

<style>
@import './components/common.css';

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
