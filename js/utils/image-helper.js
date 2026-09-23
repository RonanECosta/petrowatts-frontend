const getImagemSrcFrom = (ev) => {
    let imagemSrc = './assets/img/placeholder-ev.png';

    if (ev.thumbnail) {
        if (ev.thumbnail.startsWith('data:image')) {
            imagemSrc = ev.thumbnail;
        } else {
            imagemSrc = `data:image/jpeg;base64,${ev.thumbnail}`;
        }
    }

    return imagemSrc;
};