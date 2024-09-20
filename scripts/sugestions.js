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
	) // Fetch the data
	const dataTo = await response.json() // Convert the response to JS
	const data = await JSON.parse(dataTo.contents)[1]

	suggestionsList.innerHTML = ''

	await data.forEach((element) => {
		suggestionsList.innerHTML += `
          <div class="suggestion-item" data-value="${element}">${element}</div>
          `
	})
}

input.addEventListener('keyup', (event) => {
	suggestions(event.target.value)
})

suggestionsList.addEventListener('click', (event) => {
	if (event.target.className == 'suggestion-item') {
		document.querySelector('.search-bar').value = event.srcElement.dataset.value
	}
})

/*
let currentIndex = 0

addEventListener('keyup', (event) => {
     // ArrowDown
     if (event.key == 'ArrowUp') {
          document.querySelectorAll('.suggestion-item').forEach(el, index => {
                document.querySelectorAll('.suggestion-item')[0].classList.add('.suggestion-item-active')
          })
     }
})
*/
