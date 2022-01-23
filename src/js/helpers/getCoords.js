// получаем координаты элемента в контексте документа
function getCoords(elem) {
  const box = elem.getBoundingClientRect();

  return {
    top: box.top + pageYOffset,
    left: box.left + pageXOffset,
    right: box.right + pageXOffset,
    bottom: box.bottom + pageYOffset,
  };
}
