module.exports = {
	runtimeCompiler: true,
	productionSourceMap: false,
	publicPath: process.env.NODE_ENV === 'production' ? '/' : '/',
	pwa: {
		name: 'CargoGreen',
		themeColor: '#21bf86',
		appleMobileWebAppCapable: 'yes',
		manifestOptions: {
			background_color: '#ffffff',
			description: 'Выгодная доставка из Китая',
		},
		iconPaths: {
			favicon16: null,
		}
	},
	devServer: {
		proxy: {
			'^/api': {
				target: 'https://app.cargogreen.uz',
				changeOrigin: true,
				pathRewrite: {
					'^/api': ''
				},
			}
		}
	},
	chainWebpack: config => {
		config.module
			.rule('i18n')
			.resourceQuery(/blockType=i18n/)
			.type('javascript/auto')
			.use('i18n')
			.loader('@kazupon/vue-i18n-loader')
			.end()
	}
}
