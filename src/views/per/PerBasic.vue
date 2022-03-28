<template>
  <div>
    <el-tabs v-model="activeName" type="card" >
    <el-tab-pane label="个人信息" name="InfMana">
      <InfMana></InfMana>
    </el-tab-pane>
    <el-tab-pane label="修改密码" name="PasMana">
      <PasMana></PasMana>
    </el-tab-pane>
  </el-tabs>
  </div>

</template>

<script>
import InfMana from "@/components/per/basic/InfMana";
import PasMana from "@/components/per/basic/PasMana";

export default {
  name: "PerBasic",
  data(){
    return{
      activeName:'InfMana'
    }
  },
  components: {
    InfMana,
    PasMana
  }

}
</script>

<style scoped>

</style>