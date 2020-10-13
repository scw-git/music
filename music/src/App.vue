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

* {
    padding: 0;
    margin: 0;
}
</style>
