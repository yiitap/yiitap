<template>
	<section class="o-table-grid">
		<div class="rows" v-for="(row, i) in rows" :key="`row-${i}`">
			<div v-for="(col, j) in columns" :key="`col-${j}`">
				<div
					class="cell"
					:class="{ selected: row <= selectedRows && col <= selectedColumns }"
					@mouseover="select(row, col)"
					@click="onSelected"
				></div>
			</div>
		</div>

		<footer>{{ selectedRows }} x {{ selectedColumns }}</footer>
	</section>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const emit = defineEmits(['select'])

const rows = ref(6)
const columns = ref(6)
const selectedRows = ref(2)
const selectedColumns = ref(2)

function onHide() {
	rows.value = 5
	columns.value = 5
	selectedRows.value = 2
	selectedColumns.value = 2
}

function select(row: number, col: number) {
	selectedRows.value = row
	selectedColumns.value = col

	if (rows.value === row && rows.value < 10) {
		rows.value += 1
	}
	if (columns.value === col && columns.value < 10) {
		columns.value += 1
	}
}

function onSelected() {
	emit('select', {
		rows: selectedRows.value,
		cols: selectedColumns.value,
		withHeaderRow: true,
	})
}
</script>

<style lang="scss">
.o-table-grid {
	.rows {
		display: flex;
		justify-content: flex-start;
		cursor: pointer;
	}

	.cell {
		height: 20px;
		width: 20px;
		margin: 4px;
		border: solid 1px #ccc;
		border-radius: 2px;
	}

	.cell.selected {
		border: solid 1px #1976d2;
		background: rgba(#1976d2, 0.2);
	}

	footer {
		text-align: center;
		padding-top: 10px;
	}
}
</style>
