let date = moment().format('MMM Do YY')
const dateFormNow = localStorage.getItem('date')

if (!dateFormNow || dateFormNow != date) fetchBackground()
else setBackground()

async function fetchBackground() {
	const url = `https://api.unsplash.com/photos/random?query=wallpaper&orientation=landscape&client_id=JHn_5zbyTz583TZhNGUTeRl0StyNStCy54lkBBYP6dg`

	const response = await fetch(url) // Fetch the data
	const data = await response.json() // Convert the response to JSON
	getContrastingColor(data.urls.full)

	localStorage.setItem('image-url', await data.urls.full)
	localStorage.setItem('date', date)

	return 0
}

function setBackground() {
	const imageUrl = localStorage.getItem('image-url')

	if (!imageUrl) {
		fetchBackground()
		console.log('fetching Background')
		return 0
	}

	getContrastingColor(imageUrl)
}

async function getContrastingColor(url) {
	document.body.style.backgroundImage = `url(${await url})`
	getAverageColor(url)
}

async function getAverageColor(imageUrl) {
	const img = new Image()
	img.crossOrigin = 'Anonymous' // Handle CORS for external images if necessary
	img.src = imageUrl
	let returnValue = 0

	img.onload = function () {
		const canvas = document.createElement('canvas')
		const context = canvas.getContext('2d')

		// Set the canvas size to the image size
		canvas.width = img.width
		canvas.height = img.height

		// Draw the image onto the canvas
		context.drawImage(img, 0, 0, canvas.width, canvas.height)

		// Get the image data from the canvas
		const imageData = context.getImageData(
			0,
			0,
			img.naturalWidth,
			img.naturalHeight
		)
		const data = imageData.data
		let r = 0,
			g = 0,
			b = 0

		// Loop through all the pixels to calculate the average color
		for (let i = 0; i < data.length; i += 4) {
			r += data[i] // Red
			g += data[i + 1] // Green
			b += data[i + 2] // Blue
		}

		// Get the average values
		const pixelCount = data.length / 4
		r = 255 - Math.floor(r / pixelCount) + 100
		g = 255 - Math.floor(g / pixelCount) + 100
		b = 255 - Math.floor(b / pixelCount) + 100

		returnValue = `rgb(${r}, ${b}, ${b})`
		document.documentElement.style.cssText = `--text-color: ${returnValue}`
		
	}

	img.onerror = function () {
		console.error(
			'Image loading failed. Check the URL or cross-origin permissions.'
		)
	}
}
