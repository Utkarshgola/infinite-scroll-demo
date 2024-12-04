(function () {

    const quotesEl = document.querySelector('.quotes');
    const loaderEl = document.querySelector('.loader');

    // get the quotes from API
    const getQuotes = async (page, limit) => {
        const API_URL = `https://api.javascripttutorial.net/v1/quotes/?page=${page}&limit=${limit}`;
        const response = await fetch(API_URL);
        // handle 404
        if (!response.ok) {
            throw new Error(`An error occurred: ${response.status}`);
        }
        return await response.json();
    }

    // show the quotes
    const showQuotes = (quotes) => {
        quotes.forEach(quote => {
            const quoteEl = document.createElement('blockquote');
            quoteEl.classList.add('quote');

            quoteEl.innerHTML = `
            <span>${quote.id})</span>
            ${quote.quote}
            <footer>${quote.author}</footer>
        `;

            quotesEl.appendChild(quoteEl);
        });
    };

    const hideLoader = () => {
        loaderEl.classList.remove('show');
    };

    const showLoader = () => {
        loaderEl.classList.add('show');
    };

    const hasMoreQuotes = (page, limit, total) => {
        const startIndex = (page - 1) * limit + 1;
        return total === 0 || startIndex < total;
    };

    // load quotes
    const loadQuotes = async (page, limit) => {
        showLoader();

        setTimeout(async () => {
            try {
                // if having more quotes to fetch
                if (hasMoreQuotes(page, limit, total)) {
                    // call the API to get quotes
                    const response = await getQuotes(page, limit);
                    // show quotes
                    showQuotes(response.data);
                    // update the total
                    total = response.total;
                }
            } catch (error) {
                console.log(error.message);
            } finally {
                
                hideLoader();
            }
        }, 500);

    };

    // control variables
    let currentPage = 1;
    const limit = 10;
    let total = 0;
    let isThrottled = false;


    const throttle = (callback, limit) => {
        return function () {
            if (!isThrottled) {
                callback.apply(this, arguments);
                isThrottled = true;

                setTimeout(() => {
                    isThrottled = false;
                }, limit);
            }
        };
    };

    // scroll event listener
    const onScroll = () => {
        const {
            scrollTop,
            scrollHeight,
            clientHeight
        } = document.documentElement;

        if (scrollTop + clientHeight >= scrollHeight - 5 &&
            hasMoreQuotes(currentPage, limit, total)) {
            currentPage++;
            console.log(scrollHeight);
            console.log(clientHeight + scrollTop);
            console.log(currentPage);
            loadQuotes(currentPage, limit);
        }
    };

    window.addEventListener('scroll', throttle(onScroll, 200), {
        passive: true
    });

    // initialize
    loadQuotes(currentPage, limit);

})();