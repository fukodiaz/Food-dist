window.addEventListener('DOMContentLoaded', () => {

	//Tabs

	const tabs = document.querySelectorAll('.tabheader__item'),
		tabsContent = document.querySelectorAll('.tabcontent'),
		tabsParent = document.querySelector('.tabheader__items');


	function hideTabContent() {
		tabsContent.forEach(item => {
			item.classList.add('hide');
			item.classList.remove('show', 'fade');
		});

		tabs.forEach(item => {
			item.classList.remove('tabheader__item_active');
		});
	}

	function showTabContent(i = 0) {
		tabsContent[i].classList.add('show', 'fade');
		tabsContent[i].classList.remove('hide');
		tabs[i].classList.add('tabheader__item_active');
	}

	hideTabContent();
	showTabContent();

	tabsParent.addEventListener('click', (event) => {
		const target = event.target;

		if (target && target.classList.contains('tabheader__item')) {
			tabs.forEach((item, i) => {
				if (target == item) {
					hideTabContent();
					showTabContent(i);
				}
			});
		}
	});

	// Timer

	const deadline = '2020-11-02';

	function getTimeRemaining(endtime) {
		const t = Date.parse(endtime) - Date.parse(new Date()),
			days = Math.floor(t / (1000 * 60 * 60 * 24)),
			hours = Math.floor((t / (1000 * 60 * 60) % 24)),
			minutes = Math.floor((t / 1000 / 60) % 60),
			seconds = Math.floor((t / 1000) % 60);

		return {
			'total': t,
			'days': days,
			'hours': hours,
			'minutes': minutes,
			'seconds': seconds
		};
	}

	function getZero(num) {
		if (num >= 0 && num < 10) {
			return `0${num}`;
		} else {
			return num;
		}
	}

	function setClock(selector, endtime) {
		const timer = document.querySelector(selector),
			days = timer.querySelector('#days'),
			hours = timer.querySelector('#hours'),
			minutes = timer.querySelector('#minutes'),
			seconds = timer.querySelector('#seconds'),
			timeInterval = setInterval(updateClock, 1000); // через 1 секунду обнова


		updateClock(); // против мигания, при заходе юзера сразу без задержки покажет верное время

		function updateClock() {
			const t = getTimeRemaining(endtime);

			days.innerHTML = getZero(t.days);
			hours.innerHTML = getZero(t.hours);
			minutes.innerHTML = getZero(t.minutes);
			seconds.innerHTML = getZero(t.seconds);

			if (t.total <= 0) {
				clearInterval(timeInterval);
			}
		}
	}

	setClock('.timer', deadline);

	// Modal

	const modalTrigger = document.querySelectorAll('[data-modal]'),
		//modalCloseBtn = document.querySelector('[data-close]'),
		modal = document.querySelector('.modal');


	const modalTimerId = setTimeout(openModal, 3000);

	function openModal() {
		modal.classList.add('show');
		modal.classList.remove('hide');
		document.body.style.overflow = 'hidden';
		clearInterval(modalTimerId);
	}

	modalTrigger.forEach(item => {
		item.addEventListener('click', openModal);
	});

	function closeModal() {
		modal.classList.add('hide');
		modal.classList.remove('show');
		document.body.style.overflow = '';
	}

	//modalCloseBtn.addEventListener('click', closeModal);

	modal.addEventListener('click', (event) => {
		if (event.target === modal || event.target.getAttribute('data-close') == '') {
			closeModal();
		}
	});

	document.addEventListener('keydown', (e) => {
		if (e.code === "Escape" && modal.classList.contains('show')) {
			closeModal();
		}
	});

	//

	function showModalByScroll() {
		if (window.pageYOffset + document.documentElement.clientHeight >= document.documentElement.scrollHeight) {
			openModal();
			window.removeEventListener('scroll', showModalByScroll);
		}
	}

	window.addEventListener('scroll', showModalByScroll);

	// Используем класс для карточек

	class MenuCard {
		constructor(src, alt, title, descr, price, parentSelector, ...classes) {
			this.src = src;
			this.alt = alt;
			this.title = title;
			this.descr = descr;
			this.price = price;
			this.classes = classes;
			this.parent = document.querySelector(parentSelector);
			this.transfer = 27;
			this.changeToUAH();
		}

		changeToUAH() {
			this.price = this.price * this.transfer; // перевод из доллара в гривны
		}

		render() {
			const element = document.createElement('div');

			if (this.classes.length === 0) {
				this.element = 'menu__item';
				element.classList.add(this.element);
			} else {
				this.classes.forEach(className => element.classList.add(className));
			}

			element.innerHTML = `
					<img src=${this.src} alt=${this.alt}>
					<h3 class="menu__item-subtitle">${this.title}</h3>
					<div class="menu__item-descr">${this.descr}</div>
					<div class="menu__item-divider"></div>
					<div class="menu__item-price">
						<div class="menu__item-cost">Цена:</div>
						<div class="menu__item-total"><span>${this.price}</span> грн/день</div>
					</div>
			`;
			this.parent.append(element);
		}
	}


	const getResource = async (url) => {
		const res = await fetch(url);

		if (!res.ok) {
			throw new Error(`Could not fetch ${url}, status: ${res.status}`);
		}

		return await res.json();
	};

	// getResource('http://localhost:3000/menu')
	// 	.then(data => {
	// 		data.forEach(({img, altimg, title, descr, price}) => {
	// 			new MenuCard(img, altimg, title, descr, price, '.menu .container').render();
	// 		});
	// 	});


	// Другой способ формирования верстки на основе данных с сервера

	getResource('http://localhost:3000/menu')
		.then(data => createCard(data));

	function createCard(data) {
		data.forEach(({img, altimg, title, descr, price}) => {
			const element = document.createElement('div');

			element.classList.add('menu__item');
			element.innerHTML = `
				<img src=${img} alt=${altimg}>
				<h3 class="menu__item-subtitle">${title}</h3>
				<div class="menu__item-descr">${descr}</div>
				<div class="menu__item-divider"></div>
				<div class="menu__item-price">
					<div class="menu__item-cost">Цена:</div>
					<div class="menu__item-total"><span>${price}</span> грн/день</div>
				</div>
			`;

			document.querySelector('.menu .container').append(element);
		});
	}

	// new MenuCard(
	// 	"img/tabs/vegy.jpg",
	// 	"vegy",
	// 	'Меню "Фитнес"',
	// 	'Меню "Фитнес" - это новый подход к приготовлению блюд: больше свежих овощей и фруктов. Продукт активных и здоровых людей. Это абсолютно новый продукт с оптимальной ценой и высоким качеством!',
	// 	9,
	// 	'.menu .container',
	// 'menu__item', 
	// 'big'
	// ).render();

	// Forms

	const forms = document.querySelectorAll('form');


	const message = {
		loading: 'img/form/054 spinner.svg',
		success: 'Спасибо! Скоро свяжемя с вами',
		failure: 'Что-то пошло не так...'
	};

	forms.forEach(item => {
		bindPostData(item);
	});

	const postData = async (url, data) => {
		const res = await fetch(url, {
			method: "POST",
			headers: {
				'Content-type': 'application/json'
			},
			body: data
		});

		return await res.json();
	};


	function bindPostData(form) {
		form.addEventListener('submit', (event) => {
			event.preventDefault();

			const statusMessage = document.createElement('img');
			statusMessage.src = message.loading;
			statusMessage.style.cssText = `
				display: block;
				margin: 0 auto;
			`;
			//form.append(statusMessage);
			form.insertAdjacentElement('afterend', statusMessage);

			// const request = new XMLHttpRequest();
			// request.open('POST', 'server.php');

			//request.setRequestHeader('Content-type', 'mulptipart/form-data');

			//request.setRequestHeader('Content-type', 'application/json');
			const formData = new FormData(form);

			// const object = {};
			// formData.forEach(function (value, key) {
			// 	object[key] = value;
			// });


			const json = JSON.stringify(Object.fromEntries(formData.entries()));

			//const json = JSON.stringify(object);

			// request.send(json);

			// fetch('server.php', {
			// 	method: "POST",
			// 	headers: {
			// 		'Content-type': 'application/json'
			// 	},
			// 	body: JSON.stringify(object)
			// })

			postData('http://localhost:3000/requests', json)
				//	.then (data => data.text())
				.then(data => {
					console.log(data);
					showThanksModal(message.success);
					statusMessage.remove();
				}).catch(() => {
					showThanksModal(message.failure);
				}).finally(() => {
					form.reset();
				});

			// request.addEventListener('load', () => {
			// 	if (request.status === 200) {
			// 		console.log(request.response);
			// 		showThanksModal(message.success);
			// 		form.reset();

			// 		statusMessage.remove();
			// 	} else {
			// 		showThanksModal(message.failure);
			// 	}
			// });
		});
	}


	// 54 Урок: Красивое оповещение

	function showThanksModal(message) {
		const prevModalDialog = document.querySelector('.modal__dialog');
		prevModalDialog.classList.add('hide');
		openModal();

		const thanksModal = document.createElement('div');
		thanksModal.classList.add('modal__dialog');
		thanksModal.innerHTML = `
			<div class="modal__content">
				<div class="modal__close" data-close>×</div>
				<div class="modal__title">${message}</div>
			</div>
		`;

		document.querySelector('.modal').append(thanksModal);
		setTimeout(() => {
			thanksModal.remove();
			prevModalDialog.classList.add('show');
			prevModalDialog.classList.remove('hide');
			closeModal();
		}, 4000);
	}

	// get -запрос через fetch

	// fetch('https://jsonplaceholder.typicode.com/todos/1')
	// 	.then(response => response.json())
	// 	.then(json => console.log(json));

	// post - запрос

	// fetch('https://jsonplaceholder.typicode.com/posts', {
	// 	method: "POST",
	// 	body: JSON.stringify({name: 'Alex'}),
	// 	headers:{
	// 		'Content-type': 'application/json'
	// 	}
	// })
	// .then(response => response.json())
	// .then(json => console.log(json));


	fetch('http://localhost:3000/menu')
		.then(data => data.json())
		.then(res => console.log(res));

	// Slider
	
	const slides = document.querySelectorAll('.offer__slide'),
			prev = document.querySelector('.offer__slider-prev'),
			next = document.querySelector('.offer__slider-next'),
			total = document.querySelector('#total'),
			current = document.querySelector('#current');

	let slideIndex = 1;

	showSlides(slideIndex);

	if (slides.length < 10) {
		total.textContent = `0${slides.length}`;
	} else {
		total.textContent = slides.length;
	}

	function showSlides(n) {
		if (n > slides.length) {
			slideIndex = 1;
		}

		if (n < 1) {
			slideIndex = slides.length;
		}

		slides.forEach(item => item.style.display = 'none');

		slides[slideIndex - 1].style.display = 'block';

		if (slides.length < 10) {
			current.textContent = `0${slideIndex}`;
		} else {
			current.textContent = slideIndex;
		}
	}
	
	function plusSlides(n) {
		showSlides(slideIndex += n);
	}

	prev.addEventListener('click', () => {
		plusSlides(-1);
	});

	next.addEventListener('click', () => {
		plusSlides(1);
	});

});
