<template>
    <div>
        <el-table :data="tableData" stripe style="width: 100%">
            <el-table-column prop="date" label="Date" width="180" />
            <el-table-column prop="name" label="Name" width="180" />
            <el-table-column prop="address" label="Address" />
        </el-table>
    </div>
</template>

<script lang="ts" setup>
interface TableRow {

}

const props = withDefaults(
    defineProps<{
        tableData: TableRow[];
    }>(),
    {
        tableData: () => [

        ]
    }
);
</script>

<style lang="less" scoped></style>