<template>
  <div class="subItem">
    <template v-for="(val, key) in chil">
      <el-submenu :index="val[props.index]" :key="key" v-if="val[props.children] && val[props.children].length > 0">
        <template slot="title"> {{ val[props.label] }} </template>
        <sub-item :chil="val[props.children]" :props="props" @getSubItem="onSubTtemClick" />
      </el-submenu>
      <el-menu-item :index="val[props.index]" v-else :key="key" @click="onSubTtemClick(val)">
        <i class="smallPoint"></i>
        {{ val[props.label] }}
      </el-menu-item>
    </template>
  </div>
</template>

<script>
export default {
  name: 'subItem',
  props: {
    chil: {
      type: Array,
      default() {
        return []
      }
    },
    props: {
      type: Object,
      default() {
        return {
          children: 'qyEntity',
          label: 'describe',
          index: 'qyEntity'
        }
      }
    }
  },
  methods: {
    onSubTtemClick(item) {
      this.$emit('getSubItem', item)
    }
  }
}
</script>
<style lang="scss" scoped>
.smallPoint {
  display: inline-block;
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background-color: #fff;
  margin-right: 10px;
  vertical-align: 2px;
}
</style>
