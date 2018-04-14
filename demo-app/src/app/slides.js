export default class Slider{
    constructor(containerId, options){
        this.id = containerId;
        this.container = document.getElementById(`${this.id}`);
        this.slides = document.querySelectorAll(`.slide[slider="${this.id}"]`);
        this.navigation = document.querySelectorAll(`[slide-link='${this.id}']`);
        this.currentSlide = 0;
        this.frozen = false;
        this.focused = true;

        if (options) this.applyOptions(options);
        this.init();
    }

    applyOptions(options){
        this.scrollable = options.scrollable === true;
        this.autoplay = options.autoplay;
        this.loop = options.loop === true;
    }

    init(){
        const prevBtn = document.querySelector(`[slide-control='${this.id}'][slide-previous]`),
              nextBtn = document.querySelector(`[slide-control='${this.id}'][slide-next]`);

        this.slides.forEach( (slide, index) => index === this.currentSlide ? slide.classList.add('active') : null );

        this.updateNavigation();

        prevBtn ? prevBtn.addEventListener('click', this.previous.bind(this, null)) : null;
        nextBtn ? nextBtn.addEventListener('click', this.next.bind(this, null)) : null;

        if ( this.scrollable === true ) {
            this.setupScrollEvents();
        }

        this.navigation.forEach( link =>
            link.addEventListener('click', this.goToSlide.bind(this, link.dataset.slide))
        )

        if ( this.autoplay ) {
            setInterval(this.next.bind(this, null), this.autoplay);
        }
    }

    setupScrollEvents(){
        this.container.addEventListener('mouseenter', () => this.focused = true);
        this.container.addEventListener('mouseleave', e => this.focused = false);

        document.addEventListener('wheel', e => {
            if ( this.focused && e.deltaY > 0 ) {
                if ( this.loop || !this.loop && this.currentSlide !== this.slides.length-1 ) {
                    e.preventDefault()
                    this.next();
                }
            } else if ( this.focused && e.deltaY < 0 ) {
                if ( this.loop || !this.loop && this.currentSlide !== 0 ) {
                    e.preventDefault()
                    this.previous();
                }
            }
        });
    }

    updateNavigation(){
        this.navigation.forEach( link => {
            if (link.dataset.slide == this.currentSlide) {
                link.classList.add('active')
            } else {
                link.classList.remove('active')
            }
        })
    }

    previous(index){
        // if ( !index && this.currentSlide === 0 && this.loop === false ){
        //     return;
        // }
        if ( !this.frozen ){
            this.resetClasses();

            this.slides[this.currentSlide].classList.add('hide-right');

            if (index) this.currentSlide = index;
            else this.currentSlide === 0 ? this.currentSlide = this.slides.length - 1 : this.currentSlide --;

            this.slides[this.currentSlide].classList.add('active');
            this.slides[this.currentSlide].classList.add('show-left');

            this.updateNavigation();
            this.freeze();
        }
    }

    next(index){
        if ( !index && this.currentSlide === this.slides.length-1 && this.loop === false ){
            return;
        }
        if ( !this.frozen ){
            this.resetClasses();

            this.slides[this.currentSlide].classList.add('hide-left');

            if (index) this.currentSlide = index;
            else this.currentSlide === this.slides.length - 1 ? this.currentSlide = 0 : this.currentSlide ++;

            this.slides[this.currentSlide].classList.add('active');
            this.slides[this.currentSlide].classList.add('show-right');

            this.updateNavigation();
            this.freeze();
        };
    }

    goToSlide(slide){
        if ( !this.frozen ){
            if ( slide < this.currentSlide) this.previous(slide);
            else if (slide > this.currentSlide) this.next(slide);
        }
    }

    freeze(){
        this.frozen = true;
        setTimeout( () => this.frozen = false, 1000);
    }

    resetClasses(){
        this.slides.forEach( slide => {
            slide.classList.remove('active');
            slide.classList.remove('show-right');
            slide.classList.remove('show-left');
            slide.classList.remove('hide-right');
            slide.classList.remove('hide-left');
        })
    }
}
