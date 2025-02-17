<template>
    <div class="row">
        <div class="cold-md-12">
            Sorry. It isn't your fault. We have done something wrong.
            <hr>
            <router-link class="btn btn-danger" :to="{name: 'inicio'}">Volver</router-link>
        </div>
    </div>
</template>

<script>

export default {
    name: "NotFound"
}
</script>
