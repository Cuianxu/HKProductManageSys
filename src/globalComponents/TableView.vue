<template>
    <div>
        <el-table :data="tableData" stripe style="width: 100%">
            <el-table-column label="#" type="index">

            </el-table-column>
            <el-table-column :prop="item.prop" :label="item.label" width="180" v-for="(item, index) in tableItems"
                :key="item.prop">
                <template v-if="item.componentType == 'switch'" #default="scope">
                    <el-switch v-model="scope.row[item.prop]" @change="statusUpdate(scope.row)" />
                </template>
                <template v-else #default="scope">
                    {{ scope.row[item.prop] }}
                </template>
            </el-table-column>
            <el-table-column label="操作">
                <template #default>


                    <el-button type="primary"><el-icon>
                            <EditPen />
                        </el-icon></el-button>
                    <el-button type="danger"><el-icon>
                            <Delete />
                        </el-icon></el-button>
                    <el-button type="warning">
                        <el-icon>
                            <Setting />
                        </el-icon>
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script lang="ts" setup>

import { onMounted } from 'vue';
import { ref } from 'vue';

interface TableRow {
    [key: string]: string | number | boolean;
}
interface TableItem {
    prop: string,
    label: string,
    width?: string,
    componentType?: string
}
const emits = defineEmits(['statusEdit'])
const statusUpdate = (data: any) => {
    console.log(data);

    emits('statusEdit', data)
}
const props = withDefaults(
    defineProps<{
        tableData: TableRow[];
        tableItems: TableItem[]
    }>(),
    {
        tableData: () => [

        ], tableItems: () => []
    }
);
const s = ref('')
const showtableData = ref<TableRow[]>([])

onMounted(() => {


    showtableData.value = props.tableData
    console.log(showtableData, 234);

})
</script>

<style lang="less" scoped></style>