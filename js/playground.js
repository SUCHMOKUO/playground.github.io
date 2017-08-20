//import sass
import '../sass/playground.scss';
//import libraries
import f from './functions';
import projects from './projects';
import jump from 'jump.js';

const $scrollDownBtn = f.q('#scrollDownBtn');
const $main = f.q('main');
const maxPage = Math.ceil(projects.length / 11);
let currentPage = 0;
let $prePageBtn;
let $nextPageBtn;

function refreshProjectList(page, callback) {
    const startIndex = 11 * page;
    let i = startIndex;
    for (; i < startIndex + 11; i ++) {
        f.insertTo($main, `
        <a class="project" href="./${projects[i].folder}/index.html">
            <h2>${projects[i].title}</h2>
            <p>
                <i class="fa fa-file-text-o"></i>
                ${projects[i].description}
                <time>
                    <i class="fa fa-clock-o"></i>
                    ${projects[i].date}
                </time>
            </p>
        </a>`);
    }
    currentPage = i / 11;
    f.insertTo($main, `
    <section class="pageControl">
        <button id="prePageBtn">
            <i class="fa fa-angle-left"></i>
        </button>
        <div id="curPage"><p>Page: <input type='number' value="${currentPage}" /></p></div>
        <button id="nextPageBtn">
            <i class="fa fa-angle-right"></i>
        </button>
    </section>`);
    callback();
}
const refreshProjectListAndCallback = (page) => refreshProjectList(page, () => {
    $prePageBtn = f.q('#prePageBtn');
    $nextPageBtn = f.q('#nextPageBtn');
    if (currentPage < 2) {
        $prePageBtn.setAttribute('disabled', 'true');
    }
    if (currentPage == maxPage) {
        $nextPageBtn.setAttribute('disabled', 'true');
    }
    $nextPageBtn.addEventListener('click', () => {
        f.clean($main);
        refreshProjectListAndCallback(currentPage);
    });
    $prePageBtn.addEventListener('click', () => {
        f.clean($main);
        refreshProjectListAndCallback(currentPage - 2);
    });
});

$scrollDownBtn.addEventListener('click', () => jump('#mainPage'));
refreshProjectListAndCallback(currentPage);