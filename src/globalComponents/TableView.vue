<template>
    <div class="table-view">
        <el-table :data="tableData" border style="width: 100%">
            <el-table-column type="index" :index="1" label="#" align="center" />
            <template v-for="item in tableColumns" :key="item.prop">
                <el-table-column v-if="item.slots === 'switch'" :label="item.label" align="center" #default="scope">
                    <el-switch v-model="scope.row[item.prop]" @change="handleSwitchChange(scope.row)" />
                </el-table-column>
                <el-table-column v-else-if="item.slots === 'action'" :label="item.label" #default="scope" align="center"
                    min-width="80">
                    <el-button v-if="item.btns!.edit" type="primary" size="small" :icon="Edit"
                        @click="handleEdit(scope.row)"></el-button>
                    <el-button v-if="item.btns!.del" type="danger" size="small" :icon="Delete"
                        @click="handleDelete(scope.row)"></el-button>
                    <el-tooltip class="box-item" effect="dark" content="分配角色" placement="top"><el-button
                            v-if="item.btns!.allocate" type="warning" size="small" :icon="Setting"
                            @click=" handleAllocate(scope.row)"></el-button>
                    </el-tooltip>
                </el-table-column>
                <el-table-column v-else-if="item.slots === 'tag'" :label="item.label" #default="scope" align="center">
                    <template v-if="item.prop === 'level'">
                        <el-tag v-if="scope.row[item.prop] === '0'" type="primary">一级</el-tag>
                        <el-tag v-else-if="scope.row[item.prop] === '1'" type="success">二级</el-tag>
                        <el-tag v-else type="warning">三级</el-tag>
                    </template>
                </el-table-column>
                <el-table-column v-else show-overflow-tooltip :label="item.label" :prop="item.prop"
                    :align="item.align ? item.align : 'center'" :width="item.width" />
            </template>
        </el-table>
        <el-pagination v-if="total > 0" :current-page="searchFormData.pagenum" :page-size="searchFormData.pagesize"
            :page-sizes="[2, 10, 20, 30]" size="small" :background="true"
            layout="total, sizes, prev, pager, next, jumper" :total="total" @size-change="handleSizeChange"
            @current-change="handleCurrentChange" />
    </div>
</template>

<script setup lang="ts">
import type { UserTableDataInterface, SearchFormDataInterface } from '@/interface'
import type { TableColumnInterface } from '@/interface'
import { Delete, Edit, Setting } from '@element-plus/icons-vue'
defineProps({
    tableData: {
        type: Array as () => any[],
        required: true,
        default: () => []
    },
    tableColumns: {
        type: Array as () => TableColumnInterface[],
        required: true,
        default: () => []
    },
    searchFormData: {
        type: Object as () => SearchFormDataInterface,
        default: () => ({
            pagenum: 1,
            pagesize: 2
        })
    },
    total: {
        type: Number,
        default: 0
    }
})
const emit = defineEmits(['del', 'edit', 'allocate', 'currentChange', 'sizeChange', 'switchChange'])
// 切换状态
const handleSwitchChange = (row: UserTableDataInterface) => {
    emit('switchChange', row)
}
// 切换角色
const handleAllocate = (row: UserTableDataInterface) => {
    emit('allocate', row)
}
// 删除
const handleDelete = (row: UserTableDataInterface) => {
    emit('del', row)
}
// 编辑
const handleEdit = (row: UserTableDataInterface) => {
    emit('edit', row)
}
const handleSizeChange = (val: number) => {
    emit('sizeChange', val)
}
const handleCurrentChange = (val: number) => {
    emit('currentChange', val)
}
</script>

<style lang="less" scoped>
.table-view {

    .el-pagination {
        margin-top: 15px;
    }
}
</style>