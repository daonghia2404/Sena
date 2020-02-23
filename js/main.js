window.onload = () => {
    const loader = {
        init:function() {
            this.load();
        },
        load:function(){
            //loader page
            const loader = document.querySelector('.loader');

            function hide() {
                loader.classList.remove('active');
            }

            setTimeout(hide, 1000); //remove class after 1 second
        }
    }
    loader.init();

    const video = {
        init:function() {
            this.clickBtn();
        },
        clickBtn : function() {
            const btn = document.querySelector('.banner__button');
            const overlay = document.querySelector('.banner');
            const video = document.querySelector('video');

            btn.addEventListener('click', () => {
                overlay.classList.add('active');
                video.muted = false;    //bật tiếng video
            })
        }
    }
    video.init();

    const navigation = {
        init: function () {
            this.clickButton();
            this.fixedMenu();
        },
        clickButton: function () {
            const btn = document.querySelector('.nav__button');
            const menu = document.querySelector('.nav__menu');

            btn.addEventListener('click', () => {
                menu.classList.toggle('active');
            })
        },
        fixedMenu: function () {
            const nav = document.querySelector('.nav');
            const banner = document.querySelector('.banner');

            window.addEventListener('scroll', () => {
                if (window.scrollY > 100) { //cuộn xuống dưới 100 thì add class 
                    nav.classList.add('active');
                    banner.style.marginTop = "0px"; //fix lỗi giật màn hình
                } else {
                    nav.classList.remove('active');
                    banner.style.marginTop = "-129px"; //fix lỗi giật màn hình
                }
            })
        }
    }
    navigation.init();

    const service = {
        init: function () {
            this.progress();
        },
        progress: function () {
            const progress = document.querySelectorAll('.about__progress');

            const options = {
                threshold: 1,
                rootMargin: "0px",
            };

            function pre(item) {
                item.classList.add('active');
            };

            const observer = new IntersectionObserver((entries) => {        //hiệu ứng cuộn chuột khi màn hình chứa phần tử đó
                entries.forEach(entry => {
                    if (!entry.isIntersecting) {
                        return;
                    } else {
                        pre(entry.target);
                        observer.unobserve(entry.target);
                    }
                })
            }, options);

            progress.forEach(item => {
                observer.observe(item);
            })
        }
    }
    service.init();

    const ourteam = {
        init: function () {
            this.grabSlider('.ourteam', '.ourteam__item', '.button__next', '.button__prev');
            this.grabSlider('.clients', '.clients__item.ourteam__item', '.button__next', '.button__prev');
            this.grabSlider('.company', 'li');
        },
        grabSlider: function (e, item, nextBtn, prevBtn) {
            const grabSlide = document.querySelector(e);
            const wrap = grabSlide.querySelector('#wrap');
            const items = document.querySelectorAll(item);
            let size = items[0].offsetWidth;

            let isDown = false;
            let startX;
            let scrollLeft;

            function slideItem(){
                index = Math.round(wrap.scrollLeft / size);
                wrap.style.scrollBehavior = 'smooth';
                wrap.scrollLeft = size * index;
            }

            //add event grab wrap
            wrap.addEventListener('mousedown', (e) => {
                isDown = true;
                startX = e.pageX - wrap.offsetLeft; //this value will take x at first
                scrollLeft = wrap.scrollLeft; //this value will take scroll left at first
                wrap.style.scrollBehavior = 'unset';
            })
            wrap.addEventListener('mouseleave', () => {
                isDown = false;
                slideItem();
            })
            wrap.addEventListener('mouseup', () => {
                isDown = false;
                slideItem();
            })
            wrap.addEventListener('mousemove', (e) => {
                if (!isDown) return;
                e.preventDefault();
                //transfrom slide by grab and move left right
                const x = e.pageX - wrap.offsetLeft;
                const walk = x - startX;
                wrap.scrollLeft = scrollLeft - walk;
            })

            //Add Click Button
            const next = grabSlide.querySelector(nextBtn);
            const prev = grabSlide.querySelector(prevBtn);
            

            if (next === null || prev === null) return;

            let count = 0;

            wrap.scrollLeft = size * count;

            next.addEventListener('click', () => {
                if (wrap.scrollLeft + 15 >= wrap.scrollWidth - wrap.clientWidth) return;
                count++;
                wrap.style.scrollBehavior = 'smooth';
                wrap.scrollLeft = size * count;
            });

            prev.addEventListener('click', () => {
                if (wrap.scrollLeft <= 0) return;
                count--;
                wrap.style.scrollBehavior = 'smooth';
                wrap.scrollLeft = size * count;
            });

        }
    }
    ourteam.init();

    //Isotope
    let grid = document.querySelector('.grid');
    if (grid === null) return;

    var iso = new Isotope('.grid', {
        itemSelector: '.element-item',
        layoutMode: 'fitRows',
        transitionDuration: 500,
    });

    // filter functions
    var filterFns = {
        // show if number is greater than 50
        numberGreaterThan50: function (itemElem) {
            var number = itemElem.querySelector('.number').textContent;
            return parseInt(number, 10) > 50;
        },
        // show if name ends with -ium
        ium: function (itemElem) {
            var name = itemElem.querySelector('.name').textContent;
            return name.match(/ium$/);
        }
    };

    // bind filter button click
    var filtersElem = document.querySelector('.filters-button-group');
    filtersElem.addEventListener('click', function (event) {
        // only work with buttons
        if (!matchesSelector(event.target, 'button')) {
            return;
        }
        var filterValue = event.target.getAttribute('data-filter');
        // use matching filter function
        filterValue = filterFns[filterValue] || filterValue;
        iso.arrange({
            filter: filterValue
        });
    });

    // change is-checked class on buttons
    var buttonGroups = document.querySelectorAll('.button-group');
    for (var i = 0, len = buttonGroups.length; i < len; i++) {
        var buttonGroup = buttonGroups[i];
        radioButtonGroup(buttonGroup);
    }

    function radioButtonGroup(buttonGroup) {
        buttonGroup.addEventListener('click', function (event) {
            // only work with buttons
            if (!matchesSelector(event.target, 'button')) {
                return;
            }
            buttonGroup.querySelector('.is-checked').classList.remove('is-checked');
            event.target.classList.add('is-checked');
        });
    }

    const project = {
        init: function () {
            this.countUp();
        },
        countUp: function () {

            //Đếm lên 
            const items = document.querySelectorAll('[data-count]')
            let counter = 0;

            function countUp(item) {
                item.parentNode.classList.add('active');
                item.innerHTML = counter.toString();    //lấy giá trị max cần đếm
                counter++;
                if (counter < item.dataset.count) {     //kiểm tra khi đếm = max thì dừng lại
                    setTimeout(function () {
                        countUp(item);
                    }, 20)
                }
            }

            const options = {
                threshold: 1,
                rootMargin: "0px",
            };

            function pre(item) {
                item.classList.add('active');
            };

            const observer = new IntersectionObserver((entries) => {  //hiệu ứng cuộn chuột khi màn hình chứa phần tử đó
                entries.forEach(entry => {
                    if (!entry.isIntersecting) {
                        return;
                    } else {
                        countUp(entry.target);
                        observer.unobserve(entry.target);
                    }
                })
            }, options);

            items.forEach(item => {
                observer.observe(item);
            })
        }
    }
    project.init();

    const whyChooseUs = {
        init: function () {
            this.tab();
        },
        tab: function () {
            const tabs = document.querySelectorAll('.tab__item');

            tabs.forEach(item => item.addEventListener('click', (e) => {
                tabs.forEach(i => i.classList.remove('active'));
                const self = e.target;
                self.parentNode.classList.toggle('active'); //trỏ tới phần tử cha của phần tử được click
            }))
        }
    }
    whyChooseUs.init();

    const company = {
        init: function () {
            this.btnSlider();
        },
        btnSlider: function () {
            const button = document.querySelectorAll('[data-slider]');
            const wrap = document.querySelector('.conpany__wrap');

            button.forEach(item => item.addEventListener('click', (e) => {
                button.forEach(i => i.classList.remove('active'));
                wrap.style.scrollBehavior = 'smooth';
                wrap.scrollLeft = e.target.dataset.slider * ((wrap.scrollWidth - wrap.clientWidth) / 3);    //tìm vị trí và kích thước của slide và tạo event slide khi được click
                e.target.classList.add('active');
            }))

        }
    }
    company.init();
}