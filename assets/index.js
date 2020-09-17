document.addEventListener('DOMContentLoaded', () => {
    const START_HOUR = 9;
    const HALF_DAY = 'AM';
    const state = {
        lastHour: START_HOUR - 1,
        halfDay: HALF_DAY,
        inProgress: true
    };

    function renderTable(data) {
        const table = document.querySelector('.table');
        const tableheader = document.querySelector('.table__header');
        const tableBody = document.querySelector('.table__body');
        const legend = document.querySelector('.legend');
        const spinner = document.querySelector('.lds-ring');

        if (data && tableBody) {
            const Tooltip = {
                container: null,
                init() {
                    this.container = document.createElement('div');
                },
                show(top, left, title) {
                    this.init();

                    if (!this.container) return;

                    console.log('show');
                    this.container.classList.add('tooltip');
                    this.container.style.top = top;
                    this.container.style.left = left;
                    this.container.textContent = title;
                    document.body.appendChild(this.container);
                },
                hide() {
                    console.log('hide');
                    document.body.removeChild(this.container);
                }
            };

            for (let i = 0; i < data.length; i++) {
                const item = data[i];

                state.lastHour = START_HOUR - 1;
                state.halfDay = HALF_DAY;

                if (item) {
                    const day = document.createElement('div');
                    const dayName = document.createElement('div');
                    const dayProgress = document.createElement('div');

                    day.classList.add('day');
                    dayName.classList.add('day__name');
                    dayName.textContent = item.day;
                    dayProgress.classList.add('day__progress');

                    item.occupied.forEach(isOccupied => {
                        const dayHour = document.createElement('div');

                        dayHour.classList.add('day__hour');
                        dayHour.setAttribute('tabindex', 0);

                        /* Current time in title */
                        state.lastHour++;
                        let lastHour = state.lastHour;

                        if (state.lastHour > 12) {
                            if (state.halfDay === HALF_DAY) state.halfDay = 'PM';
                            lastHour = state.lastHour - 12;
                        }

                        const title = `${lastHour < 10 ? '0' : ''}${lastHour}:00 ${state.halfDay}`;

                        dayHour.title = title;
                        /* End current time in title */

                        dayHour.addEventListener('focus', e => {
                            const body = document.querySelector('body');
                            const { x, y, height, width } = e.target.getBoundingClientRect();

                            Tooltip.show(y + height + body.scrollTop, x + width / 2, title);
                        });
                        dayHour.addEventListener('blur', () => Tooltip.hide());

                        if (isOccupied) {
                            dayHour.classList.add('day__hour--occupied');
                        }

                        dayProgress.appendChild(dayHour);
                    });

                    day.appendChild(dayName);
                    day.appendChild(dayProgress);
                    tableBody.appendChild(day);
                }
            }

            tableheader.classList.add('table__header--visible')
            state.inProgress = false;
            table.style.display = 'block';
            legend.style.display = 'block';
            spinner.style.display = 'none';
        }
    }

    setTimeout(() => renderTable(MOCKUP), 3000);
});