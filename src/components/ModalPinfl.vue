<template>
	<b-modal
		id="modal-pinfl"
		centered
		scrollable
		size="xl"
		header-close-label="Закрыть"
		title="ПИНФЛ"
		header-bg-variant="info"
		header-text-variant="white"
		:hide-footer="true"
	>
		<template v-slot:default>
			<img src="@/assets/pinfl.jpg" class="img-fluid" alt="" />
		</template>
	</b-modal>
</template>
