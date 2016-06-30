Pendiente:

Soportar bloques de animaciones.

startBlock
endBlock

Que permita usar wait para todo el bloque, en este caso
se ejecuta cuando todos hayan terminado.

inspiración:
http://www.hongkiat.com/blog/creative-css-animations/

Recurso: para obtener valor del translate:

function getComputedTranslateY(obj)
{
    if(!window.getComputedStyle) return;
    var style = getComputedStyle(obj),
        transform = style.transform || style.webkitTransform || style.mozTransform;
    var mat = transform.match(/^matrix3d\((.+)\)$/);
    if(mat) return parseFloat(mat[1].split(', ')[13]);
    mat = transform.match(/^matrix\((.+)\)$/);
    return mat ? parseFloat(mat[1].split(', ')[5]) : 0;
}

* Soporte para delay en playCascade