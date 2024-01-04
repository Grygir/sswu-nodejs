const mark = document.createElement('span');
mark.innerText = '\u2714';
mark.classList.add('done');
mark.title = 'done';
document.querySelector('h1').appendChild(mark)
