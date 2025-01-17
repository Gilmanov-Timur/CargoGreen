export function isPinflCorrect(pinfl) {
	if (/^\d{14}$/.test(pinfl)) {
		const gen = Number(pinfl[0]);
		let century = '19';

		if (gen <= 2) {
			century = '18';
		} else if (gen >= 5) {
			century = '20';
		}

		const birthYear = century + pinfl.substring(5, 7);
		const birthMonth = pinfl.substring(3, 5);
		const birthDay = pinfl.substring(1, 3);
		const birthDate = birthMonth + '/' + birthDay + '/' + birthYear;

		if (
			new Date(birthDate).toLocaleDateString('en', {
				year: 'numeric',
				month: '2-digit',
				day: '2-digit',
			}) === birthDate &&
			gen > 0 &&
			gen < 7
		) {
			let total = 0;

			for (let i = 0; i <= pinfl.length - 2; i++) {
				const remainder = i % 3;
				let weightDigit = 0;

				if (remainder === 0) {
					weightDigit = 7;
				} else if (remainder === 1) {
					weightDigit = 3;
				} else {
					weightDigit = 1;
				}

				total = total + Number(pinfl[i]) * weightDigit;
			}

			if (total % 10 === Number(pinfl[pinfl.length - 1])) {
				return true;
			}
		} else {
			return false;
		}
	}

	return false;
}

export function getBirthdateFromPinfl(pinfl) {
	const gen = Number(pinfl[0]);
	let century = '19';

	if (gen < 3) {
		century = '18';
	} else if (gen > 4) {
		century = '20';
	}

	const birthYear = century + pinfl.substring(5, 7);
	const birthMonth = pinfl.substring(3, 5);
	const birthDay = pinfl.substring(1, 3);

	return birthYear + birthMonth + birthDay;
}