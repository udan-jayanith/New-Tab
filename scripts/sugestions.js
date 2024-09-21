const input = document.querySelector('.search-bar')
const suggestionsList = document.querySelector('.suggestions-list')
let validator = true

async function suggestions(value) {
	if (!validator) return 0
	validator = false
	if (value == '' || value == ' ') suggestionsList.style.display = 'none'
	else suggestionsList.style.display = 'block'

	const response = await fetch(
		'https://api.allorigins.win/get?url=' +
			encodeURIComponent(
				`https://www.google.com/complete/search?client=chrome&q=${value}`
			)
	)
	const dataTo = await response.json()
	const data = await JSON.parse(dataTo.contents)[1]

	suggestionsList.innerHTML = ''

	await data.forEach((element) => {
		suggestionsList.innerHTML += `
          <div class="suggestion-item" data-value="${element}">${element}</div>
          `
	})

	validator = true
}

let currentIndex = 0

input.addEventListener('keyup', (event) => {
	const suggestionItem = document.querySelectorAll('.suggestion-item')

	try {
		if (suggestionItem && validator)
			suggestionItem[0].classList.add('suggestion-item-active')
	} catch (error) {
		return 0
	}

	removeClass()

	if (event.key == 'ArrowDown') {
		if (currentIndex < suggestionItem.length) currentIndex++

		suggestionItem[currentIndex].classList.add('suggestion-item-active')
		document.querySelector('.search-bar').value = document.querySelector(
			'.suggestion-item-active'
		).dataset.value
	}

	if (event.key == 'ArrowUp') {
		if (currentIndex >= 0) currentIndex--

		suggestionItem[currentIndex].classList.add('suggestion-item-active')
		document.querySelector('.search-bar').value = document.querySelector(
			'.suggestion-item-active'
		).dataset.value
	}

	const activeSug = document.querySelector('.suggestion-item-active')
	if (activeSug) {
		var topPos = activeSug.offsetTop
		document.getElementById('suggestions').scrollTop = topPos 
	}
	if (event.key == 'ArrowDown' || event.key == 'ArrowUp' || event.key == ' ')
		return 0

	if (validator) suggestions(event.target.value)
})

function removeClass() {
	document.querySelectorAll('.suggestion-item').forEach((el) => {
		el.classList.remove('suggestion-item-active')
	})
	document.getElementById('suggestions').scrollTop = 0
}

suggestionsList.addEventListener('click', (event) => {
	if (event.target.className == 'suggestion-item') {
		document.querySelector('.search-bar').value = event.dataset.value
	}
})
