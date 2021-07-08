'use strict'

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal')
const overlay = document.querySelector('.overlay')
const btnCloseModal = document.querySelector('.btn--close-modal')
const btnsOpenModal = document.querySelectorAll('.btn--show-modal')

const openModal = function (e) {
  e.preventDefault()
  modal.classList.remove('hidden')
  overlay.classList.remove('hidden')
}

const closeModal = function () {
  modal.classList.add('hidden')
  overlay.classList.add('hidden')
}


btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal))

btnCloseModal.addEventListener('click', closeModal)
overlay.addEventListener('click', closeModal)

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal()
  }
})

const
  tabs = document.querySelectorAll('.operations__tab'),
  tabsContainer = document.querySelector('.operations__tab-container'),
  tabsContent = document.querySelectorAll('.operations__content'),
  btnScrollTo = document.querySelector('.btn--scroll-to'),
  section1 = document.querySelector('#section--1'),
  nav = document.querySelector('.nav')

//Button scrolling
btnScrollTo.addEventListener('click', (e) => {
  // const s1coords = section1.getBoundingClientRect()
  // console.log(s1coords)
  // console.log(e.target.getBoundingClientRect())

  // console.log('Current scroll (X/Y)', window.pageXOffset, window.pageYOffset)

  // console.log('height/width viewport:', document.documentElement.clientHeight, document.documentElement.clientWidth)
  // console.log(window.screen.width)

  //Scrolling to
  // window.scrollTo(s1coords.left + window.pageXOffset, s1coords.top + window.pageYOffset)

  // window.scrollTo({
  //   // left: s1coords.left + window.pageXOffset,
  //   top: s1coords.top + window.pageYOffset,
  //   behavior: 'smooth'
  // })
  section1.scrollIntoView({
    behavior: 'smooth'
  })
})

document.querySelector('.nav__links').addEventListener('click', (e) => {
  e.preventDefault()

  //Matching strategy
  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href')
    document.querySelector(id).scrollIntoView({
      behavior: 'smooth'
    })
  }
})

// Tabbed component


tabsContainer.addEventListener('click', (e) => {
  const clicked = e.target.closest('button')
  // Guard clause
  if (!clicked) return

  // Remove active classes
  tabs.forEach(t => t.classList.remove('operations__tab--active'))
  tabsContent.forEach(c => c.classList.remove('operations__content--active'))

  // Activate tab
  clicked.classList.add('operations__tab--active')

  // Activate content area
  document.querySelector(`.operations__content--${clicked.dataset.tab}`).classList.add('operations__content--active')
})

// Menu fade animation
function handleHover(e) {
  if (e.target.classList.contains('nav__link')) {
    const
      link = e.target,
      siblings = link.closest('.nav').querySelectorAll('.nav__link'),
      logo = link.closest('.nav').querySelector('img')

    siblings.forEach(el => {
      if (el !== link) el.style.opacity = this
    })
    logo.style.opacity = this
  }
}

//Passing argument into handler
//event по умолчанию передается
nav.addEventListener('mouseover', handleHover.bind(0.5))

nav.addEventListener('mouseout', handleHover.bind(1))

//// Old sticky navigation
// const initialCoords = section1.getBoundingClientRect()

// window.addEventListener('scroll', (e) => {
//   // console.log(window.scrollY)

//   window.scrollY > initialCoords.top
//     ? nav.classList.add('sticky')
//     : nav.classList.remove('sticky')
// })

//// Intersection Observer: sticky navigation
// function obsCallBack(entries, observer) {
//   entries.forEach(entry => console.log(entry))
// }

// const obsOptions = {
//   root: null, //viewport
//   threshold: [0, 0.2] //коэффицент пересечения, при котором cb будет вызван
//   //если массив, то срабатывает при нескольких значениях
// }

// const observer = new IntersectionObserver(obsCallBack, obsOptions)
// observer.observe(section1)

function stickyNav(entries) {
  const [entry] = entries
  // console.log(entry)
  if (!entry.isIntersecting) {
    nav.style.animation = ''
    nav.classList.add('sticky')
  }
  else {
    nav.classList.remove('sticky')
  }
}

const header = document.querySelector('.header')
const navHeight = nav.getBoundingClientRect().height
const headerObserver = new IntersectionObserver(stickyNav, {
  root: null, //viewport
  threshold: 0,//коэффицент пересечения, при котором cb будет вызван
  //если массив, то вызывается при нескольких значениях
  rootMargin: `-${navHeight}px` //пиксели, которые будут добавлены вне
})
headerObserver.observe(header)

//Reveal sections
const allSections = document.querySelectorAll('.section')

function revealSection(entries, observer) {
  const [entry] = entries
  if (!entry.isIntersecting) return
  entry.target.classList.remove('section--hidden')
  observer.unobserve(entry.target)
}

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15
})
allSections.forEach((section) => {
  sectionObserver.observe(section)
  section.classList.add('section--hidden')
})

//Lazy-loading inages
const imgTargets = document.querySelectorAll('img[data-src]')

function loadImg(entries, observer) {
  const [entry] = entries

  if (!entry.isIntersecting) return

  entry.target.src = entry.target.dataset.src
  entry.target.addEventListener('load', () => entry.target.classList.remove('lazy-img'))

}

const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: '200px'
})

imgTargets.forEach(img => imgObserver.observe(img))

// SLIDER:
const slider = function () {


  const
    slides = document.querySelectorAll('.slide'),
    btnLeft = document.querySelector('.slider__btn--left'),
    btnRight = document.querySelector('.slider__btn--right'),
    dotContainer = document.querySelector('.dots')

  let curSlide = 0

  const maxSlide = slides.length - 1



  function createDots() {
    slides.forEach((_, i) => {
      dotContainer.insertAdjacentHTML('beforeend', `<button class="dots__dot" data-slide="${i}"</button>`)
    })
  }


  function activeDots(slide) {
    document.querySelectorAll('.dots__dot').forEach(dot => dot.classList.remove('dots__dot--active'))
    document.querySelector(`.dots__dot[data-slide="${slide}"]`).classList.add('dots__dot--active')
  }

  function goToSlide(slide) {
    slides.forEach((s, i) => s.style.transform = `translateX(${100 * (i - slide)}%)`)
  }

  function nextSlide() {
    curSlide === maxSlide ? curSlide = 0 : curSlide++
    goToSlide(curSlide)
    activeDots(curSlide)
  }


  function prevSlide() {
    curSlide === 0 ? curSlide = maxSlide : curSlide--
    goToSlide(curSlide)
    activeDots(curSlide)
  }

  function init() {
    goToSlide(0)
    createDots()
    activeDots(0)
  }

  init()


  btnRight.addEventListener('click', nextSlide)
  btnLeft.addEventListener('click', prevSlide)

  function onArrowClick(e) {
    if (e.key === 'ArrowRight') nextSlide()
    e.key === 'ArrowLeft' && prevSlide()
    document.removeEventListener('keydown', onArrowClick)
    setTimeout(() => {
      document.addEventListener('keydown', onArrowClick)

    }, 600)
  }

  document.addEventListener('keydown', onArrowClick)

  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('dots__dot')) {
      const { slide } = e.target.dataset
      goToSlide(slide)
      activeDots(slide)

    }
  })
}
slider()

document.addEventListener('DOMContentLoaded', (e) => {//Just HTML
  console.log('HTML Parsed and DOM tree built!', e)
})

// window.addEventListener('beforeunload', (e) => {
//   e.preventDefault()
//   console.log(e)
//   e.returnValue = ''
// })