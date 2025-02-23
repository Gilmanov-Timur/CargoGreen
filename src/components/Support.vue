<template>
	<div class="row contacts">
		<div class="col-auto">
			<div class="contacts-title">Отправка посылок</div>
			<div class="contacts-contact">
				<div class="my-1 my-md-0">
					<a href="tel:+998943580090">
						<b-icon icon="telephone-fill"/>
						(94) 358-00-90
					</a>
				</div>
				<div class="my-1 my-md-0">
					<a href="https://t.me/cargogreenchilanzar" target="_blank">
						<img src="@/assets/telegram.svg" width="16" height="16" alt="" />
						@cargogreenchilanzar
					</a>
				</div>
			</div>
		</div>
		<div class="col-auto">
			<div class="contacts-title">Получение посылок</div>
			<div class="contacts-contact">
				<div class="my-1 my-md-0">
					<a href="tel:+998940740090">
						<b-icon icon="telephone-fill"/>
						(94) 074-00-90
					</a>
				</div>
				<div class="my-1 my-md-0">
					<a href="https://t.me/cargogreenchilanzar" target="_blank">
						<img src="@/assets/telegram.svg" width="16" height="16" alt="" />
						@cargogreenchilanzar
					</a>
				</div>
			</div>
		</div>
		<div class="col-auto">
			<div class="contacts-title">Жалобы и предложения</div>
			<div class="contacts-contact">
				<div class="my-1 my-md-0">
					<a href="tel:+998911904590">
						<b-icon icon="telephone-fill"/>
						(91) 190-45-90
					</a>
				</div>
				<div class="my-1 my-md-0">
					<a href="https://t.me/ftadjibaev" target="_blank">
						<img src="@/assets/telegram.svg" width="16" height="16" alt="" />
						@ftadjibaev
					</a>
				</div>
			</div>
		</div>
	</div>
</template>

<style lang="scss" scoped>
.contacts {
	margin-top: -6px;
	margin-bottom: -5px;
	color: #fff;

	a {
		color: inherit;
	}

	svg {
		width: 1em;
		height: 1em;
	}
}

.contacts-sidebar {
	margin: 0;

	.contacts-title {
		font-weight: bold;
	}

	.contacts-contact {
		margin-bottom: 15px;
	}
}

@media (max-width: 767px) {
	.contacts-contact {
		font-size: 18px;
	}
}
</style>
