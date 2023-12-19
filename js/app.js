const page = 1
const quantity = 24
const API_KEY = 'g19e-FxcbQtdkCab6lafsqMiutZeCV_cVQkUgqw4_6E'

const splitToChunks = (array, n) => {
	let result = []
	for (let i = n; i > 0; i--) {
		result.push(array.splice(0, Math.ceil(array.length / i)))
	}
	return result
}

const createDiv = (className) => {
	const div = document.createElement('div')
	div.className = className
	return div
}

const createAuthorInfo = (firstName, lastName, userName) => {
	const div = createDiv('author-wrapper')

	if (firstName) {
		const span = document.createElement('span')
		span.textContent = 'Name: ' + firstName
		span.className = 'author'
		div.appendChild(span)
	}
	if (lastName) {
		const span = document.createElement('span')
		span.textContent = 'Last name: ' + lastName
		span.className = 'author'
		div.appendChild(span)
	}
	if (userName) {
		const span = document.createElement('span')
		span.textContent = 'Username: ' + userName
		span.className = 'author'
		div.appendChild(span)
	}

	return div
}

const createSlide = (imgUrl, firstName, lastName, userName) => {
	const slide = createDiv('swiper-slide slider__item')
	const slideImg = createDiv('slider__img')
	slideImg.style = `background-image: url(${imgUrl});`

	const likesDiv = createDiv('likes-wrapper')
	likesDiv.innerHTML = `<svg class="heart" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1792 1792" id="Heart"><path d="M896 1664q-26 0-44-18l-624-602q-10-8-27.5-26T145 952.5 77 855 23.5 734 0 596q0-220 127-344t351-124q62 0 126.5 21.5t120 58T820 276t76 68q36-36 76-68t95.5-68.5 120-58T1314 128q224 0 351 124t127 344q0 221-229 450l-623 600q-18 18-44 18z" fill="#fe2a46" class="color000000 svgShape"></path></svg>`

	const likeCount = document.createElement('span')
	likeCount.className = 'like'
	likeCount.textContent = 0

	if (firstName || lastName || userName) {
		const authorInfo = createAuthorInfo(firstName, lastName, userName)
		slideImg.append(authorInfo)
	}

	likesDiv.appendChild(likeCount)
	slideImg.appendChild(likesDiv)
	slide.appendChild(slideImg)

	return slide
}

const createSwiper = (images) => {
	const swiper = createDiv('swiper slider')
	const swiperWrapper = createDiv('swiper-wrapper slider__wrapper')

	images.forEach(img => {
		const slide = createSlide(img.urls.full, img.user.first_name, img.user.last_name, img.user.username)
		swiperWrapper.appendChild(slide)
	});

	swiper.appendChild(swiperWrapper)
	return swiper
}

const fetchPhoto = async () => {
	try {
		return fetch(`https://api.unsplash.com/search/photos?page=${page}&per_page=${quantity}&query=nature&orientation=portrait&client_id=${API_KEY}`)
			.then(res => res.json())
			.then(data => { return data })
	} catch (error) {
		console.error('An error occured when uploading a photo:' + error);
		return []
	}
}

const photos = await fetchPhoto()
const slidesImages = splitToChunks(photos.results, 4)

const mainWrapper = createDiv('main-wrapper')
slidesImages.forEach(images => {
	const swiper = createSwiper(images)
	mainWrapper.appendChild(swiper)
});

document.body.appendChild(mainWrapper)


document.querySelectorAll('.slider').forEach((n, i) => {
	window[`slider${i + 1}`] = new Swiper(n, {
		freeMode: true,
		centerSlides: true,
		direction: 'vertical',
		mousewheel: true,
		slidesPerView: 1.75,
		slidesOffsetBefore: -125,
	})
})
bindSwipers(slider1, slider2, slider3, slider4)

document.querySelectorAll('.heart').forEach(heart => {
	heart.addEventListener('click', () => {
		const likes = +heart.nextElementSibling.textContent
		heart.nextElementSibling.textContent = likes + 1
	})
});