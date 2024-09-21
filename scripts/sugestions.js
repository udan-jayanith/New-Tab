const input = document.querySelector('.search-bar')
const suggestionsList = document.querySelector('.suggestions-list')

async function suggestions(value) {
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
}

let currentIndex = 0

input.addEventListener('keyup', (event) => {
	const suggestionItem = document.querySelectorAll('.suggestion-item')
	suggestionItem[0].classList.add('suggestion-item-active')

	removeClass()

	if (event.key == 'ArrowDown') {
		if (currentIndex < suggestionItem.length) currentIndex++
		suggestionItem[currentIndex].classList.add('suggestion-item-active')
	}

	if (event.key == 'ArrowUp') {
		if (currentIndex >= 0) currentIndex--
		suggestionItem[currentIndex].classList.add('suggestion-item-active')
	}

	if (event.key == 'ArrowDown' || event.key == 'ArrowUp') return 0
	suggestions(event.target.value)
})

function removeClass() {
	document.querySelectorAll('.suggestion-item').forEach((el) => {
		el.classList.remove('suggestion-item-active')
	})
}

suggestionsList.addEventListener('click', (event) => {
	if (event.target.className == 'suggestion-item') {
		document.querySelector('.search-bar').value = event.srcElement.dataset.value
	}
})
