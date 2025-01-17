<template>
	<b-container class="h-100">
		<div class="row align-items-center h-100">
			<div class="col text-center">
				<div class="h2 mb-4">
					{{ $t('page-not-found') }}
				</div>
				<b-button variant="primary" to="/">
					{{ $t('back-to-cabinet') }}
				</b-button>
			</div>
		</div>
	</b-container>
</template>
