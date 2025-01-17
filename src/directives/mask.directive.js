import Inputmask from 'inputmask'

export default {
	bind: function(input, {value}) {
		Inputmask(value).mask(input)
		input.addEventListener('paste', function() {
			input.dispatchEvent(new CustomEvent('input'));
		});
		input.addEventListener('change', function() {
			input.dispatchEvent(new CustomEvent('input'));
		});
	},
	unbind: function(input) {
		if (input.inputmask) {
			input.inputmask.remove()
		}
	}
}
