<!--
 * @Description: el-menu 组件
 * @Autor: bhj
 * @Date: 2022-03-11 14:28:44
 * @LastEditors: bhj
 * @LastEditTime: 2022-03-11 14:30:37
-->

<template>
  <el-menu :default-active="activeName" :default-openeds="defaultOpeneds" ref="elMenu" class="el-menu-vertical-demo" text-color="#fff" color="#1890ff" :collapse="collapse" :unique-opened="openedOnly">
    <template v-for="(val, key) in menuList">
      <el-submenu :index="val[props.index]" v-if="val[props.children] && val[props.children].length > 0" :key="key">
        <template slot="title">
          <!-- <img class="imgIcon" :src="menuIconShow(val.icon)" alt="" /> -->
          <span>{{ val[props.label] }}</span>
        </template>
        <SubItem :chil="val[props.children]" :props="props" @getSubItem="onMenuItemClick" />
      </el-submenu>
      <el-menu-item :index="val[props.index]" v-else-if="!val[props.children]" @click="onMenuItemClick(val)" :key="key">
        <i :class="val.icon"></i>
        <span slot="title">{{ val[props.label] }}</span>
      </el-menu-item>
    </template>
  </el-menu>
</template>

<script>
import SubItem from './subItem'
export default {
  name: 'Menu',
  components: {
    SubItem
  },
  props: {
    collapse: {
      type: Boolean,
      default: () => {
        return true
      }
    },
    activeName: {
      type: String,
      default: () => {
        return ''
      }
    },
    menuList: {
      type: Array,
      required: true,
      default: () => {
        return []
      }
    },
    props: {
      type: Object,
      default: () => {
        return {
          children: 'children',
          label: 'label',
          index: 'code'
        }
      }
    },
    // 是否只展开一个菜单
    openedOnly: {
      type: Boolean,
      default: () => {
        return true
      }
    },
    // 默认激活的菜单
    defaultOpeneds: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  computed: {
    // menuIconShow() {
    //   return (icon) => {
    //     return require(`../../assets/menuImg/${icon}.png`)
    //   }
    // }
  },
  methods: {
    onMenuItemClick(item) {
      this.$emit('getmenu', item)
    },
    collaspeAllMenu() {
      this.$refs.elMenu.openedMenus = []
      this.clearActiveName()
    },
    clearActiveName() {
      this.$refs.elMenu.activeIndex = ''
    }
  }
}
</script>
<style lang="scss" scoped>
.el-menu-vertical-demo {
  -moz-user-select: none;
  -o-user-select: none;
  -khtml-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
  user-select: none;
  .imgIcon {
    width: 14px;
    height: 14px;
    margin-right: 10px;
  }
}
.el-menu {
  border: none;
  background-color: transparent;
  color: #fff;
}
.el-submenu__title {
  > i {
    color: #fff;
  }
}
.el-menu-item-group__title {
  padding: 0;
}
.el-submenu__title:hover {
  background-color: #1890ff;
  user-select: none;
}
.el-menu-item.is-active {
  color: #fff;
  background-color: #1890ff;
}
.el-menu-item:focus,
.el-menu-item:hover {
  background-color: #1890ff;
}
.el-menu-item {
  background-color: transparent;
}
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 268px;
  min-height: 400px;
}
</style>
<style lang="scss">
// 鼠标悬停
.el-menu--vertical {
  display: inline;
  width: 40px !important;
  .el-menu--popup-right-start {
    width: 40px !important;
    background-color: #303133;
    padding-right: 0;
    margin-left: 10px;
    border-radius: 5px;
    &::before {
      content: '';
      display: inline-block;
      width: 0;
      height: 0;
      border-width: 8px;
      border-style: solid;
      border-color: rgba(0, 0, 0, 0) #303133 rgba(0, 0, 0, 0) rgba(0, 0, 0, 0);
      position: absolute;
      top: 50%;
      left: -16px;
      transform: translateY(-50%);
    }
    .el-menu-item {
      color: #fff;
      height: 40px;
      line-height: 40px;
      font-size: 12px;
      min-width: 10px !important;
      padding: 0;
      &:hover {
        background-color: #1890ff;
      }
    }
  }
}
</style>
